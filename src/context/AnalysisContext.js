import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

const CTA_PATTERNS = [
  "get started",
  "start",
  "sign up",
  "signup",
  "try now",
  "book demo",
  "request demo",
  "contact sales",
  "learn more",
  "analyze",
  "analyze now",
  "buy now",
  "join now"
];

const AnalysisContext = createContext(null);
const HISTORY_STORAGE_KEY = "auditlyHistory";

function safeReadJson(key, fallbackValue) {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallbackValue;
  } catch (error) {
    return fallbackValue;
  }
}

function safeWriteJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function readHistoryMap() {
  const historyMap = safeReadJson(HISTORY_STORAGE_KEY, {});
  return historyMap && typeof historyMap === "object" ? historyMap : {};
}

function readHistoryForUser(email) {
  if (!email) {
    return [];
  }

  const historyMap = readHistoryMap();
  const entries = historyMap[email];
  return Array.isArray(entries) ? entries : [];
}

function writeHistoryForUser(email, entries) {
  if (!email) {
    return;
  }

  const historyMap = readHistoryMap();
  historyMap[email] = entries;
  safeWriteJson(HISTORY_STORAGE_KEY, historyMap);
}

function createHistoryRecord(url, extractedMetrics) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    url,
    createdAt: new Date().toISOString(),
    metrics: extractedMetrics
  };
}

function normalizeUrl(rawUrl) {
  const trimmed = rawUrl.trim();

  if (!trimmed) {
    throw new Error("Enter a website URL to analyze.");
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function formatReadingTime(wordCount) {
  const readingTimeMinutes = wordCount / 225;
  const rounded = Math.max(0.1, Math.round(readingTimeMinutes * 10) / 10);
  return `${rounded.toFixed(1)}m`;
}

function countCtas(document) {
  const interactiveElements = [
    ...document.querySelectorAll("a, button, input[type='button'], input[type='submit']")
  ];

  return interactiveElements.filter((element) => {
    const sourceText = [
      element.textContent,
      element.getAttribute("value"),
      element.getAttribute("aria-label"),
      element.getAttribute("title")
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

    return CTA_PATTERNS.some((pattern) => sourceText.includes(pattern));
  }).length;
}

function collectCtaTexts(document) {
  const interactiveElements = [
    ...document.querySelectorAll("a, button, input[type='button'], input[type='submit']")
  ];

  return interactiveElements
    .map((element) =>
      [
        element.textContent,
        element.getAttribute("value"),
        element.getAttribute("aria-label"),
        element.getAttribute("title")
      ]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter((text) => {
      const lower = text.toLowerCase();
      return text && CTA_PATTERNS.some((pattern) => lower.includes(pattern));
    })
    .slice(0, 5);
}

function getHeadingTexts(document) {
  return [...document.querySelectorAll("h1, h2, h3")]
    .map((heading) => heading.textContent?.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 6);
}

function getLinkCounts(document, baseUrl) {
  const links = [...document.querySelectorAll("a[href]")];
  let internalLinkCount = 0;
  let externalLinkCount = 0;

  links.forEach((link) => {
    const href = link.getAttribute("href")?.trim();

    if (!href || href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return;
    }

    try {
      const resolvedUrl = new URL(href, baseUrl);

      if (resolvedUrl.origin === baseUrl.origin) {
        internalLinkCount += 1;
      } else {
        externalLinkCount += 1;
      }
    } catch (error) {
      // Ignore malformed href values.
    }
  });

  return { externalLinkCount, internalLinkCount };
}

function getImageMetrics(document) {
  const images = [...document.querySelectorAll("img")];
  const imageCount = images.length;
  const missingAltCount = images.filter((image) => {
    const alt = image.getAttribute("alt");
    return alt === null || alt.trim() === "";
  }).length;

  return {
    imageCount,
    missingAltCount,
    missingAltTextPercentage:
      imageCount === 0 ? "0%" : `${Math.round((missingAltCount / imageCount) * 100)}%`
  };
}

function createAiInsights({
  ctaCount,
  ctaTexts,
  externalLinkCount,
  headingCount,
  headingTexts,
  imageCount,
  internalLinkCount,
  metaDescription,
  metaTitle,
  missingAltCount,
  missingAltTextPercentage,
  wordCount
}) {
  const metaTitleLength = metaTitle === "Not found" ? 0 : metaTitle.length;
  const metaDescriptionLength = metaDescription === "Not found" ? 0 : metaDescription.length;
  const firstHeading = headingTexts[0] || "No clear primary heading was detected";
  const ctaPreview = ctaTexts.length > 0 ? ctaTexts.join(", ") : "No obvious CTA labels were detected";

  let seoBody = `The page exposes ${headingCount} headings across H1-H3, with "${firstHeading}" leading the structure. `;
  if (metaTitle === "Not found") {
    seoBody += "The meta title is missing, which weakens search snippet quality. ";
  } else if (metaTitleLength < 30) {
    seoBody += `The meta title is present but short at ${metaTitleLength} characters, which may undersell the page topic. `;
  } else if (metaTitleLength > 60) {
    seoBody += `The meta title is ${metaTitleLength} characters long, so it may truncate in search results. `;
  } else {
    seoBody += `The meta title sits in a healthy range at ${metaTitleLength} characters. `;
  }
  if (metaDescription === "Not found") {
    seoBody += "The meta description is also missing.";
  } else if (metaDescriptionLength > 160) {
    seoBody += `The meta description is ${metaDescriptionLength} characters, which is longer than the usual search preview window.`;
  } else if (metaDescriptionLength < 70) {
    seoBody += `The meta description is only ${metaDescriptionLength} characters, so it may not carry enough context.`;
  } else {
    seoBody += `The meta description is ${metaDescriptionLength} characters and should fit standard snippets cleanly.`;
  }

  let messagingBody = `The page carries ${wordCount.toLocaleString()} words, which gives enough material to judge messaging weight. `;
  if (wordCount < 250) {
    messagingBody += "That length is very lean, so the message risks feeling too thin unless the hero copy is exceptionally clear. ";
  } else if (wordCount > 1800) {
    messagingBody += "That is a dense page, so the message may feel heavy unless it is broken into strong sections. ";
  } else {
    messagingBody += "That sits in a workable middle range for explaining value without becoming overwhelming. ";
  }
  messagingBody += headingCount <= 2
    ? `Only ${headingCount} structural headings were detected, which may limit how clearly the story unfolds.`
    : `${headingCount} structural headings suggest the message is segmented into readable sections.`;

  let ctaBody = `${ctaCount} CTA${ctaCount === 1 ? "" : "s"} were detected`;
  ctaBody += ctaCount > 0 ? `, including ${ctaPreview}. ` : ". ";
  if (ctaCount === 0) {
    ctaBody += "That usually means the page lacks a clear conversion path.";
  } else if (ctaCount === 1) {
    ctaBody += "A single CTA can feel focused, but it also gives the user only one conversion path.";
  } else if (ctaCount <= 3) {
    ctaBody += "That is a healthy CTA range if one action is visually dominant.";
  } else {
    ctaBody += "That is a fairly high CTA count, so the page may feel repetitive or competitive if the actions are styled equally.";
  }

  let depthBody = `${wordCount.toLocaleString()} words, ${imageCount} image${imageCount === 1 ? "" : "s"}, ${internalLinkCount} internal links, and ${externalLinkCount} external links suggest `;
  if (wordCount < 300 && imageCount < 2) {
    depthBody += "a light-content page that may need more supporting evidence or explanation.";
  } else if (wordCount > 1200 && imageCount > 4) {
    depthBody += "a fairly detailed page with enough supporting surface area to feel substantial.";
  } else {
    depthBody += "a moderate level of depth that should feel balanced if the page hierarchy is strong.";
  }

  let uxBody = `${imageCount} images were found, and ${missingAltCount} of them are missing alt text (${missingAltTextPercentage}). `;
  uxBody += headingCount <= 2
    ? "Combined with the light heading structure, that points to an obvious scanability and accessibility concern."
    : "The heading structure helps scanability, but the missing alt coverage still creates an accessibility gap.";

  return [
    {
      icon: "search",
      title: "SEO Structure",
      body: seoBody,
      tags: ["Metrics-Based", "Technical"]
    },
    {
      icon: "campaign",
      title: "Messaging Clarity",
      body: messagingBody,
      tags: ["Content", "Clarity"]
    },
    {
      icon: "ads_click",
      title: "CTA Usage",
      body: ctaBody,
      tags: ["Conversion", "Action"]
    },
    {
      icon: "layers",
      title: "Content Depth",
      body: depthBody,
      tags: ["Depth", "Structure"]
    },
    {
      icon: "view_quilt",
      title: "UX / Structure Concerns",
      body: uxBody,
      tags: ["UX", "Audit"]
    }
  ];
}

function createRecommendations({
  ctaCount,
  headingCount,
  imageCount,
  metaDescription,
  metaTitle,
  missingAltCount,
  missingAltTextPercentage,
  wordCount
}) {
  const recommendations = [];
  const metaTitleLength = metaTitle === "Not found" ? 0 : metaTitle.length;
  const metaDescriptionLength = metaDescription === "Not found" ? 0 : metaDescription.length;

  if (metaTitle === "Not found" || metaDescription === "Not found") {
    recommendations.push({
      icon: "error",
      priority: "High Priority",
      priorityTone: "error",
      title: "Missing Search Metadata",
      body:
        metaTitle === "Not found" && metaDescription === "Not found"
          ? "Both the meta title and meta description are missing, which weakens search visibility and lowers snippet quality."
          : metaTitle === "Not found"
            ? "The page is missing a meta title, making it harder to communicate topic relevance in search results."
            : "The page is missing a meta description, so search engines may generate an inconsistent snippet automatically."
    });
  } else if (metaTitleLength > 60 || metaDescriptionLength > 160) {
    recommendations.push({
      icon: "warning",
      priority: "Medium Priority",
      priorityTone: "warning",
      title: "Metadata Length Needs Tuning",
      body: `The meta title is ${metaTitleLength} characters and the meta description is ${metaDescriptionLength} characters. One or both may truncate in search results and should be tightened.`
    });
  }

  if (missingAltCount > 0) {
    recommendations.push({
      icon: missingAltCount >= Math.max(2, Math.ceil(imageCount * 0.4)) ? "error" : "warning",
      priority:
        missingAltCount >= Math.max(2, Math.ceil(imageCount * 0.4))
          ? "High Priority"
          : "Medium Priority",
      priorityTone:
        missingAltCount >= Math.max(2, Math.ceil(imageCount * 0.4))
          ? "error"
          : "warning",
      title: "Alt Text Coverage Is Incomplete",
      body: `${missingAltCount} of ${imageCount} images are missing alt text (${missingAltTextPercentage}). That creates an accessibility gap and weakens non-visual content understanding.`
    });
  }

  if (headingCount <= 1) {
    recommendations.push({
      icon: "warning",
      priority: "Medium Priority",
      priorityTone: "warning",
      title: "Heading Structure Is Too Thin",
      body: `Only ${headingCount} heading across H1-H3 was detected. Add clearer section headings so users and crawlers can scan the page structure more easily.`
    });
  } else if (headingCount >= 10) {
    recommendations.push({
      icon: "info",
      priority: "Low Priority",
      priorityTone: "primary",
      title: "Heading Hierarchy May Feel Dense",
      body: `${headingCount} headings were detected across H1-H3. Review the hierarchy to make sure sections feel intentional rather than overly fragmented.`
    });
  }

  if (ctaCount === 0) {
    recommendations.push({
      icon: "error",
      priority: "High Priority",
      priorityTone: "error",
      title: "No Clear CTA Detected",
      body: "The page does not expose a recognizable call to action, which makes the next step unclear for the user."
    });
  } else if (ctaCount >= 5) {
    recommendations.push({
      icon: "info",
      priority: "Low Priority",
      priorityTone: "primary",
      title: "CTA Density May Be Too High",
      body: `${ctaCount} CTAs were detected. If they compete visually, the page may feel less focused and harder to convert cleanly.`
    });
  }

  if (wordCount < 250) {
    recommendations.push({
      icon: "warning",
      priority: "Medium Priority",
      priorityTone: "warning",
      title: "Content Depth Looks Light",
      body: `The page contains only ${wordCount.toLocaleString()} words, which may not be enough to explain value, support SEO, or answer user questions with confidence.`
    });
  }

  return recommendations.slice(0, 4);
}

function createAuditSummary({
  ctaCount,
  headingCount,
  imageCount,
  internalLinkCount,
  metaDescription,
  metaTitle,
  missingAltCount,
  recommendations,
  wordCount
}) {
  let score = 100;

  if (metaTitle === "Not found") {
    score -= 12;
  } else if (metaTitle.length < 30 || metaTitle.length > 60) {
    score -= 5;
  }

  if (metaDescription === "Not found") {
    score -= 10;
  } else if (metaDescription.length < 70 || metaDescription.length > 160) {
    score -= 4;
  }

  if (headingCount <= 1) {
    score -= 12;
  } else if (headingCount >= 10) {
    score -= 4;
  }

  if (ctaCount === 0) {
    score -= 14;
  } else if (ctaCount >= 5) {
    score -= 4;
  }

  if (wordCount < 250) {
    score -= 10;
  } else if (wordCount > 1800) {
    score -= 4;
  }

  if (imageCount > 0 && missingAltCount > 0) {
    score -= Math.min(16, missingAltCount * 3);
  }

  if (internalLinkCount === 0) {
    score -= 6;
  }

  const highPriorityCount = recommendations.filter(
    (recommendation) => recommendation.priorityTone === "error"
  ).length;
  const mediumPriorityCount = recommendations.filter(
    (recommendation) => recommendation.priorityTone === "warning"
  ).length;

  score -= highPriorityCount * 5;
  score -= mediumPriorityCount * 2;
  score = Math.max(42, Math.min(99, Math.round(score)));

  let statusLabel = "Exceptional Performance";
  let summaryText = "The page is structurally strong and needs only minor refinements.";

  if (score < 70) {
    statusLabel = "Needs Attention";
    summaryText = "The page has several structural or optimization gaps that should be addressed before it can perform consistently.";
  } else if (score < 85) {
    statusLabel = "Solid Foundation";
    summaryText = "The page is in workable shape, but a few content and optimization issues are holding back its full potential.";
  } else if (score < 93) {
    statusLabel = "Strong Performance";
    summaryText = "The page is performing well overall, with only a small set of improvements needed to tighten quality.";
  }

  return {
    score,
    statusLabel,
    summaryText
  };
}

function extractMetricsFromHtml(html, targetUrl) {
  const parser = new DOMParser();
  const document = parser.parseFromString(html, "text/html");
  const bodyText = (document.body?.textContent || "")
    .replace(/\s+/g, " ")
    .trim();
  const baseUrl = new URL(targetUrl);

  const wordCount = bodyText ? bodyText.split(" ").length : 0;
  const headingCount = document.querySelectorAll("h1, h2, h3").length;
  const ctaCount = countCtas(document);
  const ctaTexts = collectCtaTexts(document);
  const headingTexts = getHeadingTexts(document);
  const { externalLinkCount, internalLinkCount } = getLinkCounts(document, baseUrl);
  const { imageCount, missingAltCount, missingAltTextPercentage } = getImageMetrics(document);
  const metaTitle = document.querySelector("title")?.textContent?.trim() || "Not found";
  const metaDescription =
    document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content")
      ?.trim() || "Not found";
  const aiInsights = createAiInsights({
    ctaCount,
    ctaTexts,
    externalLinkCount,
    headingCount,
    headingTexts,
    imageCount,
    internalLinkCount,
    metaDescription,
    metaTitle,
    missingAltCount,
    missingAltTextPercentage,
    wordCount
  });
  const recommendations = createRecommendations({
    ctaCount,
    headingCount,
    imageCount,
    metaDescription,
    metaTitle,
    missingAltCount,
    missingAltTextPercentage,
    wordCount
  });
  const auditSummary = createAuditSummary({
    ctaCount,
    headingCount,
    imageCount,
    internalLinkCount,
    metaDescription,
    metaTitle,
    missingAltCount,
    recommendations,
    wordCount
  });

  return {
    aiInsights,
    auditSummary,
    ctaCount,
    externalLinkCount,
    headlessSnapshotUrl: `https://s.wordpress.com/mshots/v1/${encodeURIComponent(targetUrl)}?w=1200`,
    wordCount,
    headingCount,
    imageCount,
    internalLinkCount,
    metaDescription,
    metaTitle,
    missingAltTextPercentage,
    recommendations,
    readingTime: formatReadingTime(wordCount)
  };
}

async function fetchHtmlThroughFallbacks(targetUrl, onProgress) {
  const jinaTarget = targetUrl.replace(/^https?:\/\//i, "");
  const attempts = [
    ["Connecting directly", async () => {
      const response = await fetch(targetUrl);

      if (!response.ok) {
        throw new Error(`Direct fetch failed with ${response.status}.`);
      }

      return response.text();
    }],
    ["Trying proxy source 1", async () => {
      const response = await fetch(
        `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`
      );

      if (!response.ok) {
        throw new Error(`Proxy fetch failed with ${response.status}.`);
      }

      return response.text();
    }],
    ["Trying proxy source 2", async () => {
      const response = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`
      );

      if (!response.ok) {
        throw new Error(`JSON proxy fetch failed with ${response.status}.`);
      }

      const payload = await response.json();

      if (!payload?.contents) {
        throw new Error("JSON proxy returned no page content.");
      }

      return payload.contents;
    }],
    ["Trying proxy source 3", async () => {
      const response = await fetch(
        `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(targetUrl)}`
      );

      if (!response.ok) {
        throw new Error(`CodeTabs proxy failed with ${response.status}.`);
      }

      return response.text();
    }],
    ["Trying fallback mirror", async () => {
      const response = await fetch(`https://r.jina.ai/http://${jinaTarget}`);

      if (!response.ok) {
        throw new Error(`Jina mirror failed with ${response.status}.`);
      }

      return response.text();
    }]
  ];

  let lastError;
  const progressStops = [18, 30, 42, 54, 66];

  for (const [index, [label, attempt]] of attempts.entries()) {
    try {
      onProgress(progressStops[index], `${label}...`);
      return await attempt();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Unable to fetch the website content.");
}

export function AnalysisProvider({ children }) {
  const { user } = useAuth();
  const [status, setStatus] = useState("idle");
  const [currentUrl, setCurrentUrl] = useState("");
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("Waiting to start");
  const [historyRecords, setHistoryRecords] = useState([]);

  useEffect(() => {
    setHistoryRecords(readHistoryForUser(user?.email));
  }, [user]);

  useEffect(() => {
    const handleStorageChange = () => {
      setHistoryRecords(readHistoryForUser(user?.email));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [user]);

  const updateProgress = (value, label) => {
    setProgress(value);
    if (label) {
      setProgressLabel(label);
    }
  };

  const analyzeUrl = async (rawUrl) => {
    updateProgress(6, "Preparing target URL...");
    setMetrics(null);
    setError("");
    setStatus("loading");

    try {
      const normalizedUrl = normalizeUrl(rawUrl);

      setCurrentUrl(normalizedUrl);
      updateProgress(12, "Resolving website source...");

      const html = await fetchHtmlThroughFallbacks(normalizedUrl, updateProgress);
      updateProgress(78, "Parsing page structure...");
      const extractedMetrics = extractMetricsFromHtml(html, normalizedUrl);
      updateProgress(86, "Extracting page content...");
      updateProgress(92, "Calculating factual metrics...");

      setMetrics(extractedMetrics);
      if (user?.email) {
        const nextHistory = [
          createHistoryRecord(normalizedUrl, extractedMetrics),
          ...readHistoryForUser(user.email)
        ].slice(0, 50);
        writeHistoryForUser(user.email, nextHistory);
        setHistoryRecords(nextHistory);
      }
      updateProgress(100, "Analysis complete");
      setStatus("success");
      return extractedMetrics;
    } catch (analysisError) {
      const message =
        analysisError instanceof Error ? analysisError.message : "";

      setError(
        !message || message === "Load failed"
          ? "This site blocked browser-based fetching. Try a public URL, or we can add a small backend proxy next."
          : message
      );
      setProgressLabel("Analysis failed");
      setStatus("error");
      throw analysisError;
    }
  };

  const resetAnalysis = () => {
    setStatus("idle");
    setCurrentUrl("");
    setMetrics(null);
    setError("");
    setProgress(0);
    setProgressLabel("Waiting to start");
  };

  const loadHistoryRecord = (recordId) => {
    const matchedRecord = historyRecords.find((record) => record.id === recordId);

    if (!matchedRecord) {
      return false;
    }

    setCurrentUrl(matchedRecord.url);
    setMetrics(matchedRecord.metrics);
    setError("");
    setProgress(100);
    setProgressLabel("Loaded from history");
    setStatus("success");
    return true;
  };

  const value = useMemo(
    () => ({
      analyzeUrl,
      currentUrl,
      error,
      historyRecords,
      loadHistoryRecord,
      metrics,
      progress,
      progressLabel,
      resetAnalysis,
      status
    }),
    [currentUrl, error, historyRecords, metrics, progress, progressLabel, status]
  );

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);

  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider.");
  }

  return context;
}
