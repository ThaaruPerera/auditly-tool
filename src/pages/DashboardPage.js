import React, { useEffect, useMemo, useState } from "react";
import auditlyLogo from "../assets/auditly.svg";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import PlaceholderButton from "../components/PlaceholderButton";
import PlaceholderLink from "../components/PlaceholderLink";
import SiteHeader from "../components/SiteHeader";
import { useAnalysis } from "../context/AnalysisContext";
import "../styles/analysis.css";
import "../styles/dashboard.css";

const PDF_LOGO_SVG = `
<svg width="72" height="15" viewBox="0 0 72 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.7132 1.6748C8.7132 1.8868 8.8828 2.0352 9.0736 2.0352H10.2396C10.4304 2.0352 10.6 2.2048 10.6 2.3956V14.5008C10.6 14.6916 10.4304 14.8612 10.2396 14.8612H7.1868C6.996 14.8612 6.8476 14.6916 6.8476 14.5008V10.3244C6.8476 10.1124 6.678 9.964 6.4872 9.964H4.1128C3.9008 9.964 3.7524 10.1124 3.7524 10.3244V14.5008C3.7524 14.6916 3.5828 14.8612 3.392 14.8612H0.339204C0.148404 14.8612 4.00748e-06 14.6916 4.00748e-06 14.5008V2.3956C4.00748e-06 2.2048 0.148404 2.0352 0.339204 2.0352H1.7596C1.9504 2.0352 2.12 1.8868 2.12 1.6748V0.360403C2.12 0.169603 2.2684 2.42233e-06 2.4592 2.42233e-06H8.3528C8.5648 2.42233e-06 8.7132 0.169603 8.7132 0.360403V1.6748ZM3.7524 7.5684C3.7524 7.7804 3.9008 7.9288 4.1128 7.9288H6.4872C6.678 7.9288 6.8476 7.7804 6.8476 7.5684V3.286C6.8476 3.0952 6.678 2.9256 6.4872 2.9256H4.1128C3.9008 2.9256 3.7524 3.0952 3.7524 3.286V7.5684ZM11.8609 12.826C11.6701 12.826 11.5217 12.6564 11.5217 12.4656V0.360403C11.5217 0.169603 11.6701 2.42233e-06 11.8609 2.42233e-06H14.9137C15.1045 2.42233e-06 15.2741 0.169603 15.2741 0.360403V11.5752C15.2741 11.766 15.4225 11.9356 15.6345 11.9356H18.0089C18.1997 11.9356 18.3693 11.766 18.3693 11.5752V0.360403C18.3693 0.169603 18.5177 2.42233e-06 18.7085 2.42233e-06H21.7613C21.9521 2.42233e-06 22.1217 0.169603 22.1217 0.360403V12.4656C22.1217 12.6564 21.9521 12.826 21.7613 12.826H20.3621C20.1501 12.826 20.0017 12.9744 20.0017 13.1864V14.5008C20.0017 14.6916 19.8321 14.84 19.6413 14.84H13.7477C13.5569 14.84 13.3873 14.6916 13.3873 14.5008V13.1864C13.3873 12.9744 13.2389 12.826 13.0269 12.826H11.8609ZM33.3678 1.908C33.5586 1.908 33.7282 2.0776 33.7282 2.2684V12.7836C33.7282 12.9744 33.5586 13.144 33.3678 13.144H32.0746C31.8838 13.144 31.7354 13.2924 31.7354 13.5044V14.5008C31.7354 14.6916 31.5658 14.84 31.375 14.84H23.4674C23.2766 14.84 23.1282 14.6916 23.1282 14.5008V0.360403C23.1282 0.169603 23.2766 2.42233e-06 23.4674 2.42233e-06H31.375C31.5658 2.42233e-06 31.7354 0.169603 31.7354 0.360403V1.5476C31.7354 1.7596 31.8838 1.908 32.0746 1.908H33.3678ZM27.241 2.9256C27.029 2.9256 26.8806 3.0952 26.8806 3.286V11.5752C26.8806 11.766 27.029 11.9356 27.241 11.9356H29.6154C29.8062 11.9356 29.9758 11.766 29.9758 11.5752V3.286C29.9758 3.0952 29.8062 2.9256 29.6154 2.9256H27.241ZM41.9634 2.5652C41.9634 2.7772 41.7938 2.9256 41.603 2.9256H40.2886C40.0978 2.9256 39.9282 3.0952 39.9282 3.286V11.5752C39.9282 11.766 40.0978 11.9356 40.2886 11.9356H41.603C41.7938 11.9356 41.9634 12.084 41.9634 12.296V14.5008C41.9634 14.6916 41.7938 14.8612 41.603 14.8612H34.501C34.3102 14.8612 34.1618 14.6916 34.1618 14.5008V12.296C34.1618 12.084 34.3102 11.9356 34.501 11.9356H35.8154C36.0062 11.9356 36.1758 11.766 36.1758 11.5752V3.286C36.1758 3.0952 36.0062 2.9256 35.8154 2.9256H34.501C34.3102 2.9256 34.1618 2.7772 34.1618 2.5652V0.360403C34.1618 0.169603 34.3102 2.42233e-06 34.501 2.42233e-06H41.603C41.7938 2.42233e-06 41.9634 0.169603 41.9634 0.360403V2.5652ZM41.9979 2.9256C41.8071 2.9256 41.6587 2.7772 41.6587 2.5652V0.360403C41.6587 0.169603 41.8071 2.42233e-06 41.9979 2.42233e-06H52.6191C52.8099 2.42233e-06 52.9795 0.169603 52.9795 0.360403V2.5652C52.9795 2.7772 52.8099 2.9256 52.6191 2.9256H49.5451C49.3543 2.9256 49.1847 3.0952 49.1847 3.286V14.4584C49.1847 14.6704 49.0363 14.8188 48.8243 14.8188H45.7927C45.5807 14.8188 45.4323 14.6704 45.4323 14.4584V3.286C45.4323 3.0952 45.2627 2.9256 45.0719 2.9256H41.9979ZM62.5499 12.3384V14.5432C62.5499 14.734 62.4015 14.8824 62.1895 14.8824H55.4903C55.2783 14.8824 55.1299 14.734 55.1299 14.5432V13.5468C55.1299 13.3348 54.9603 13.1864 54.7695 13.1864H53.4763C53.2855 13.1864 53.1371 13.0168 53.1371 12.826V0.360403C53.1371 0.169603 53.2855 2.42233e-06 53.4763 2.42233e-06H56.5079C56.7199 2.42233e-06 56.8683 0.169603 56.8683 0.360403L56.8895 11.6176C56.8895 11.8084 57.0379 11.978 57.2499 11.978H62.1895C62.4015 11.978 62.5499 12.1264 62.5499 12.3384ZM70.8499 2.42233e-06C71.0407 2.42233e-06 71.2103 0.169603 71.2103 0.360403V6.5084C71.2103 6.6992 71.0407 6.8688 70.8499 6.8688H69.6839C69.4931 6.8688 69.3235 7.0172 69.3235 7.2292V8.4588C69.3235 8.6708 69.1751 8.8192 68.9631 8.8192H68.1363C67.9455 8.8192 67.7759 8.9888 67.7759 9.1796V14.5008C67.7759 14.6916 67.6275 14.8612 67.4367 14.8612H64.3839C64.1931 14.8612 64.0235 14.6916 64.0235 14.5008V9.1796C64.0235 8.9888 63.8751 8.8192 63.6631 8.8192H62.8363C62.6455 8.8192 62.4759 8.6708 62.4759 8.4588V7.2292C62.4759 7.0172 62.3275 6.8688 62.1155 6.8688H60.9495C60.7587 6.8688 60.6103 6.6992 60.6103 6.5084V0.360403C60.6103 0.169603 60.7587 2.42233e-06 60.9495 2.42233e-06H64.0023C64.1931 2.42233e-06 64.3627 0.169603 64.3627 0.360403V5.6816C64.3627 5.8724 64.5111 6.042 64.7231 6.042H67.0975C67.2883 6.042 67.4579 5.8724 67.4579 5.6816V0.360403C67.4579 0.169603 67.6063 2.42233e-06 67.7971 2.42233e-06H70.8499Z" fill="#000000"/>
</svg>
`;

function MetricCard({ icon, value, label }) {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
      <span className="material-symbols-outlined text-on-surface-variant mb-4" style={{ fontSize: 20 }}>
        {icon}
      </span>
      <div className="text-3xl font-bold mb-1 text-on-surface">{value}</div>
      <div className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">{label}</div>
    </div>
  );
}

function SnapshotImage({ alt, fallbackSrc, src }) {
  const [attempt, setAttempt] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);
  const resolvedSrc = useMemo(() => {
    if (!src) {
      return fallbackSrc;
    }

    const separator = src.includes("?") ? "&" : "?";
    return `${src}${separator}refresh=${attempt}`;
  }, [attempt, fallbackSrc, src]);

  useEffect(() => {
    setAttempt(0);
    setHasLoaded(false);
  }, [src]);

  useEffect(() => {
    if (!src || hasLoaded || attempt >= 6) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setAttempt((currentAttempt) => currentAttempt + 1);
    }, 2500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [attempt, hasLoaded, src]);

  return (
    <img
      className="w-full aspect-video object-cover rounded-xl border border-outline-variant/20 grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer"
      alt={alt}
      src={resolvedSrc}
      onLoad={() => {
        setHasLoaded(true);
      }}
      onError={() => {
        if (attempt < 6) {
          setAttempt((currentAttempt) => currentAttempt + 1);
        }
      }}
    />
  );
}

function loadImageDataUrl(src, width = null, height = null) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width || image.naturalWidth || image.width;
      canvas.height = height || image.naturalHeight || image.height;
      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Could not prepare export image."));
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = () => reject(new Error("Could not load Auditly logo for export."));
    image.src = src;
  });
}

function drawWrappedText(pdf, text, x, y, maxWidth, lineHeight) {
  const lines = pdf.splitTextToSize(text || "", maxWidth);
  pdf.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function DashboardLoadingOverlay({
  currentUrl,
  error,
  progress,
  progressLabel,
  status,
  onBackHome
}) {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });

  return (
    <div
      className="fixed inset-0 z-40 overflow-hidden"
      onMouseMove={(event) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
      }}
      onMouseLeave={() => {
        setMousePosition({ x: null, y: null });
      }}
    >
      <div className="absolute inset-0 bg-[#0b0f08]/55 backdrop-blur-md" />
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#45493f 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: mousePosition.x === null ? 0 : 0.3,
          backgroundImage: "radial-gradient(rgba(197, 253, 93, 0.95) 1.2px, transparent 1.2px)",
          backgroundSize: "40px 40px",
          maskImage:
            mousePosition.x === null
              ? "none"
              : `radial-gradient(180px circle at ${mousePosition.x}px ${mousePosition.y}px, black 0%, rgba(0,0,0,0.95) 35%, transparent 100%)`,
          WebkitMaskImage:
            mousePosition.x === null
              ? "none"
              : `radial-gradient(180px circle at ${mousePosition.x}px ${mousePosition.y}px, black 0%, rgba(0,0,0,0.95) 35%, transparent 100%)`
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] aurora-blur" />
      <div className="relative z-10 flex h-screen items-center justify-center px-6">
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {status !== "error" ? (
              <>
                <div className="absolute inset-0 rounded-full border border-primary/30 animate-[pulse-ring_3s_infinite]" />
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-[pulse-ring_3s_infinite_1s]" />
              </>
            ) : null}
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-container shadow-[0_0_40px_rgba(197,253,93,0.4)] flex items-center justify-center animate-[float_4s_ease-in-out_infinite]">
              <span
                className="material-symbols-outlined text-on-primary-container text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                dataset
              </span>
            </div>
          </div>

          <div className="mt-12">
            <h1 className="text-3xl font-headline font-semibold tracking-tight text-on-surface mb-3">
              {status === "error" ? "Analysis failed" : "Analyzing website"}
              <span className="text-primary">{status === "error" ? "." : "..."}</span>
            </h1>
            <p className="text-on-surface-variant font-body text-base leading-relaxed tracking-wide opacity-80">
              {status === "error"
                ? error || "We couldn't extract the website content."
                : currentUrl
                  ? `extracting data from ${currentUrl}`
                  : "extracting data and generating insights"}
            </p>
            {status === "error" ? (
              <button
                type="button"
                className="mt-8 bg-primary text-on-primary-container px-6 py-3 rounded-full font-bold"
                onClick={onBackHome}
              >
                Back Home
              </button>
            ) : (
              <div className="mt-8 flex flex-col items-center gap-3">
                <div className="text-4xl font-black tracking-tight text-primary tabular-nums">
                  {progress}%
                </div>
                <div className="w-48 h-[6px] bg-surface-container-highest rounded-full overflow-hidden mx-auto">
                  <div
                    className="h-full bg-primary rounded-full transition-[width] duration-200 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                  Current Stage
                </div>
                <div className="px-4 py-2 rounded-full border border-outline-variant/20 bg-surface-container-high/40 text-sm font-medium text-on-surface">
                  {progressLabel}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const { analyzeUrl, currentUrl, error, metrics, progress, progressLabel, status } = useAnalysis();
  const factualMetrics = metrics || {
    aiInsights: [],
    auditSummary: {
      score: 0,
      statusLabel: "Awaiting Analysis",
      summaryText: "Run a scan to generate the audit summary."
    },
    ctaCount: 0,
    externalLinkCount: 0,
    headlessSnapshotUrl: "",
    wordCount: 0,
    headingCount: 0,
    imageCount: 0,
    internalLinkCount: 0,
    metaDescription: "Not found",
    metaTitle: "Not found",
    missingAltTextPercentage: "0%",
    recommendations: [],
    readingTime: "0.0m"
  };
  const metricCards = [
    { icon: "description", value: factualMetrics.wordCount.toLocaleString(), label: "Total Word Count" },
    { icon: "format_h1", value: String(factualMetrics.headingCount).padStart(2, "0"), label: "Heading Count (H1-H3)" },
    { icon: "ads_click", value: String(factualMetrics.ctaCount).padStart(2, "0"), label: "CTA Count" },
    { icon: "timer", value: factualMetrics.readingTime, label: "Reading Time" },
    { icon: "link", value: String(factualMetrics.internalLinkCount).padStart(2, "0"), label: "Internal Links" },
    { icon: "open_in_new", value: String(factualMetrics.externalLinkCount).padStart(2, "0"), label: "External Links" },
    { icon: "image", value: String(factualMetrics.imageCount).padStart(2, "0"), label: "Image Count" },
    { icon: "warning", value: factualMetrics.missingAltTextPercentage, label: "% Missing Alt Text" }
  ];
  const insightCards = factualMetrics.aiInsights;
  const recommendationCards = factualMetrics.recommendations;

  const handleRerunAnalysis = async () => {
    if (!currentUrl) {
      navigate("/");
      return;
    }

    try {
      await analyzeUrl(currentUrl);
    } catch (rerunError) {
      // The loading overlay already surfaces analysis errors.
    }
  };

  const handleExportPdf = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;
    const sectionGap = 10;
    const accentColor = [74, 106, 0];
    const primaryText = [0, 0, 0];
    const secondaryText = [82, 87, 76];
    let y = margin;

    const ensureSpace = (neededHeight = 24) => {
      if (y + neededHeight <= pageHeight - margin) {
        return;
      }

      pdf.addPage();
      y = margin;
    };

    const addSectionTitle = (title) => {
      ensureSpace(14);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.setTextColor(...accentColor);
      pdf.text(title, margin, y);
      y += 6;
      pdf.setDrawColor(...accentColor);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 6;
    };

    const logoSvgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(PDF_LOGO_SVG)}`;
    const logoDataUrl = await loadImageDataUrl(logoSvgDataUrl, 720, 150);

    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");
    pdf.setTextColor(242, 245, 231);
    pdf.addImage(logoDataUrl, "PNG", margin, y - 1.8, 34, 7);
    y += 17;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.setTextColor(...primaryText);
    pdf.text("Auditly Website Audit Report", margin, y);
    y += 8;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(...secondaryText);
    y = drawWrappedText(
      pdf,
      `Generated from ${currentUrl || "the current scan"} on ${new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      })}.`,
      margin,
      y,
      contentWidth,
      5
    );
    y += sectionGap;

    addSectionTitle("Audit Summary");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(32);
    pdf.setTextColor(...accentColor);
    pdf.text(String(factualMetrics.auditSummary.score), margin, y + 10);
    pdf.setFontSize(10);
    pdf.text("/100", margin + 18, y + 10);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(...primaryText);
    pdf.text(factualMetrics.auditSummary.statusLabel, margin + 38, y + 4);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(...secondaryText);
    y = drawWrappedText(pdf, factualMetrics.auditSummary.summaryText, margin + 38, y + 10, contentWidth - 38, 5);
    y += sectionGap;

    addSectionTitle("Factual Metrics");
    const metricColumnWidth = contentWidth / 2;
    const metricRows = [
      [`Total Word Count: ${factualMetrics.wordCount.toLocaleString()}`, `Heading Count (H1-H3): ${factualMetrics.headingCount}`],
      [`CTA Count: ${factualMetrics.ctaCount}`, `Reading Time: ${factualMetrics.readingTime}`],
      [`Internal Links: ${factualMetrics.internalLinkCount}`, `External Links: ${factualMetrics.externalLinkCount}`],
      [`Image Count: ${factualMetrics.imageCount}`, `% Missing Alt Text: ${factualMetrics.missingAltTextPercentage}`]
    ];

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(...primaryText);
    metricRows.forEach(([leftText, rightText]) => {
      ensureSpace(8);
      pdf.text(leftText, margin, y);
      pdf.text(rightText, margin + metricColumnWidth, y);
      y += 7;
    });
    y += 2;
    pdf.setFont("helvetica", "bold");
    pdf.text("Meta Title", margin, y);
    y += 5;
    pdf.setFont("helvetica", "normal");
    y = drawWrappedText(pdf, factualMetrics.metaTitle, margin, y, contentWidth, 5);
    y += 3;
    pdf.setFont("helvetica", "bold");
    pdf.text("Meta Description", margin, y);
    y += 5;
    pdf.setFont("helvetica", "normal");
    y = drawWrappedText(pdf, factualMetrics.metaDescription, margin, y, contentWidth, 5);
    y += sectionGap;

    addSectionTitle("AI Content Insights");
    insightCards.forEach((insight) => {
      ensureSpace(28);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(...primaryText);
      pdf.text(insight.title, margin, y);
      y += 5;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(...secondaryText);
      y = drawWrappedText(pdf, insight.body, margin, y, contentWidth, 5);
      y += 5;
    });

    addSectionTitle("Critical Recommendations");
    recommendationCards.forEach((recommendation) => {
      ensureSpace(24);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(...primaryText);
      pdf.text(`${recommendation.title} (${recommendation.priority})`, margin, y);
      y += 5;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(...secondaryText);
      y = drawWrappedText(pdf, recommendation.body, margin, y, contentWidth, 5);
      y += 5;
    });

    pdf.save("auditly-report.pdf");
  };

  return (
    <div className="dashboard-page bg-surface text-on-surface selection:bg-primary selection:text-on-primary-container">
      <SiteHeader
        navItems={[
          { label: "Home", to: "/" },
          { label: "Dashboard", to: "/dashboard" },
          { label: "History", to: "/history" }
        ]}
        ctaLabel="Analyze"
        ctaTo="/analysis"
        logoClassName="w-[92px] text-stone-50 flex-shrink-0"
        navItemClassName="text-stone-400 hover:text-white transition-colors duration-300"
        navItemActiveClassName="text-lime-400 font-semibold"
        ctaClassName="bg-primary text-on-primary-container min-h-[38px] px-6 rounded-full font-bold scale-95 active:scale-90 transition-transform"
      />

      <main className="relative pt-32 pb-20 px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-primary font-label text-xs uppercase tracking-[0.2em] mb-3 block">Analysis Complete</span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface mb-2">Audit Dashboard</h1>
            <p className="text-on-surface-variant max-w-xl">
              Comprehensive evaluation of content integrity, SEO optimization, and messaging clarity powered by AuraAudit AI.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="flex items-center gap-2 bg-surface-container-high border border-outline-variant/20 px-5 py-3 rounded-xl text-sm font-semibold hover:bg-surface-container-highest transition-colors"
              onClick={handleExportPdf}
            >
              <span className="material-symbols-outlined text-sm">download</span> Export PDF
            </button>
            <PlaceholderButton className="flex items-center gap-2 bg-surface-container-high border border-outline-variant/20 px-5 py-3 rounded-xl text-sm font-semibold hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined text-sm">share</span> Share Report
            </PlaceholderButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary">analytics</span>
                <h2 className="text-xl font-bold tracking-tight">Factual Metrics</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metricCards.map((metric) => (
                  <MetricCard
                    key={metric.label}
                    icon={metric.icon}
                    value={metric.value}
                    label={metric.label}
                  />
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="glass-panel p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 20 }}>
                      title
                    </span>
                    <div className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">
                      Meta Title
                    </div>
                  </div>
                  <div className="text-base font-semibold text-on-surface leading-relaxed">
                    {factualMetrics.metaTitle}
                  </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 20 }}>
                      short_text
                    </span>
                    <div className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">
                      Meta Description
                    </div>
                  </div>
                  <div className="text-sm font-medium text-on-surface leading-relaxed">
                    {factualMetrics.metaDescription}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                <h2 className="text-xl font-bold tracking-tight">AI Content Insights</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {insightCards.map((insight) => (
                  <div
                    key={insight.title}
                    className="bg-surface-container-high p-8 rounded-2xl border border-outline-variant/10 relative overflow-hidden group"
                  >
                    <div className="absolute -right-8 -top-8 w-32 h-32 aurora-glow rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>
                        {insight.icon}
                      </span>
                      {insight.title}
                    </h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                      {insight.body}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {insight.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-widest"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary">checklist</span>
                <h2 className="text-xl font-bold tracking-tight">Critical Recommendations</h2>
              </div>
              <div className="space-y-4">
                {recommendationCards.map((recommendation) => (
                  <div
                    key={recommendation.title}
                    className={`bg-surface-container-low p-6 rounded-2xl flex items-start gap-6 border-l-4 group hover:bg-surface-container transition-colors ${
                      recommendation.priorityTone === "error"
                        ? "border-error"
                        : recommendation.priorityTone === "warning"
                          ? "border-[#eedc47]"
                          : "border-primary"
                    }`}
                  >
                    <div className="mt-1">
                      <span
                        className={`material-symbols-outlined ${
                          recommendation.priorityTone === "error"
                            ? "text-error"
                            : recommendation.priorityTone === "warning"
                              ? "text-[#eedc47]"
                              : "text-primary"
                        }`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {recommendation.icon}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1 gap-4">
                        <h4 className="font-bold text-on-surface">{recommendation.title}</h4>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded whitespace-nowrap ${
                            recommendation.priorityTone === "error"
                              ? "text-error bg-error/10"
                              : recommendation.priorityTone === "warning"
                                ? "text-[#eedc47] bg-[#eedc47]/10"
                                : "text-primary bg-primary/10"
                          }`}
                        >
                          {recommendation.priority}
                        </span>
                      </div>
                      <p className="text-sm text-on-surface-variant">{recommendation.body}</p>
                    </div>
                    <button type="button" className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                      chevron_right
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <div className="glass-panel p-8 rounded-3xl border border-outline-variant/10 shadow-xl relative overflow-hidden">
              <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
              <div className="text-center mb-8 relative">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-primary/20 p-2 mb-4">
                  <div className="w-full h-full rounded-full bg-surface-container-highest flex flex-col items-center justify-center border-4 border-primary shadow-[0_0_30px_rgba(197,253,93,0.2)]">
                    <span className="text-4xl font-black text-on-surface leading-none">{factualMetrics.auditSummary.score}</span>
                    <span className="text-[10px] font-bold text-primary-container uppercase tracking-tighter">Score</span>
                  </div>
                </div>
                <h3 className="text-xl font-extrabold tracking-tight">Audit Summary</h3>
                <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-[0.1em]">{factualMetrics.auditSummary.statusLabel}</p>
              </div>
              <div className="space-y-6">
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {factualMetrics.auditSummary.summaryText}
                </p>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Target URL</label>
                  <p className="text-sm font-mono text-primary truncate">{currentUrl || "Awaiting analysis..."}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Scan Date</label>
                    <p className="text-sm font-semibold">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Status</label>
                    <p className="text-sm font-semibold">{status === "success" ? "Live Scan" : "Ready"}</p>
                  </div>
                </div>
                <div className="pt-6 border-t border-outline-variant/10">
                  <SnapshotImage
                    alt={currentUrl ? `Visual scan snapshot of ${currentUrl}` : "Visual scan snapshot placeholder"}
                    fallbackSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuAZMXyAZ15D20HcxQFASRR7z3ZoOWX7Lipb6Gk7kz6j3AYjdEDnvD_jCSNp1d1gSVGNw5cFjcQa6cKV8Cgcc80QJV_R5j3NdHUCGYnQ4n8Hqg0THthlqYho0ViPn74wZgJNulml6pUqHKCPKZPNQE6XK5pPX8_0N7tjMJrjqIgV643-t76DPAXeBF7EqWXYzOsSTqfRZRqmPUQeG-cs5YSQVLdqJWuL6tfDJuMGjkCJh_blclRQ3dAqOXbg2gEeuRrdTfExLH0m2Ls"
                    src={factualMetrics.headlessSnapshotUrl}
                  />
                  <p className="text-[10px] text-center text-on-surface-variant mt-3 italic">
                    Visual scan snapshot generated via headless browser
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full py-4 bg-primary text-on-primary-container rounded-2xl font-bold text-sm hover:shadow-[0_0_20px_rgba(197,253,93,0.2)] transition-shadow"
                  onClick={handleRerunAnalysis}
                >
                  Rerun Analysis
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant px-2">History</h4>
              <div className="space-y-2">
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">language</span>
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <p className="text-xs font-bold text-on-surface truncate">marketing-ops-site.io</p>
                    <p className="text-[10px] text-on-surface-variant">Yesterday • Score: 84</p>
                  </div>
                </div>
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/5 flex items-center gap-4 opacity-60">
                  <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined">language</span>
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <p className="text-xs font-bold text-on-surface truncate">saas-landing-page.com</p>
                    <p className="text-[10px] text-on-surface-variant">2 days ago • Score: 92</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {status === "loading" || status === "error" ? (
          <DashboardLoadingOverlay
            currentUrl={currentUrl}
            error={error}
            progress={progress}
            progressLabel={progressLabel}
            status={status}
            onBackHome={() => navigate("/")}
          />
        ) : null}
      </main>

      <footer className="w-full py-12 border-t border-[#1c2116] bg-[#0b0f08]">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 gap-6">
          <div className="font-['Product_Sans'] text-xs uppercase tracking-widest text-[#a9ada0]">© 2026 Auditly. All rights reserved.</div>
          <div className="flex gap-8">
            <PlaceholderLink className="font-['Product_Sans'] text-xs uppercase tracking-widest text-[#a9ada0] hover:text-[#c5fd5d] transition-colors">
              Privacy Policy
            </PlaceholderLink>
            <PlaceholderLink className="font-['Product_Sans'] text-xs uppercase tracking-widest text-[#a9ada0] hover:text-[#c5fd5d] transition-colors">
              Terms of Service
            </PlaceholderLink>
            <PlaceholderLink className="font-['Product_Sans'] text-xs uppercase tracking-widest text-[#a9ada0] hover:text-[#c5fd5d] transition-colors">
              Cookie Policy
            </PlaceholderLink>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default DashboardPage;
