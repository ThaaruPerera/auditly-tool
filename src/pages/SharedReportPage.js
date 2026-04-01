import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import SiteHeader from "../components/SiteHeader";
import { supabase } from "../lib/supabase";
import "../styles/dashboard.css";

function MetricTile({ label, value }) {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-outline-variant/10 shadow-sm">
      <div className="text-2xl font-bold text-on-surface mb-1">{value}</div>
      <div className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">{label}</div>
    </div>
  );
}

function SnapshotImage({ src, alt }) {
  return (
    <img
      className="w-full aspect-video object-cover rounded-xl border border-outline-variant/20 grayscale hover:grayscale-0 transition-all duration-500"
      alt={alt}
      src={src}
    />
  );
}

function SharedReportPage() {
  const { shareId } = useParams();
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true;

    async function loadShare() {
      if (!shareId || !supabase) {
        if (isMounted) {
          setStatus("error");
        }
        return;
      }

      const { data, error } = await supabase
        .from("public_report_shares")
        .select("share_id, url, metrics, created_at, owner_name")
        .eq("share_id", shareId)
        .maybeSingle();

      if (!isMounted) {
        return;
      }

      if (error || !data) {
        setStatus("error");
        return;
      }

      setReport(data);
      setStatus("success");
    }

    loadShare();

    return () => {
      isMounted = false;
    };
  }, [shareId]);

  const metrics = report?.metrics || {};
  const summary = metrics.auditSummary || {};
  const insightCards = metrics.aiInsights || [];
  const recommendationCards = metrics.recommendations || [];
  const pageTitle = metrics.metaTitle && metrics.metaTitle !== "Not found"
    ? metrics.metaTitle
    : report?.url || "Shared Audit Report";
  const sharedByLabel = report?.owner_name || "Auditly User";

  return (
    <div className="dashboard-page bg-surface text-on-surface min-h-screen selection:bg-primary selection:text-on-primary-container">
      <SiteHeader
        navItems={[
          { label: "Home", to: "/" },
          { label: "Dashboard", to: "/dashboard" }
        ]}
        ctaLabel="Analyze"
        ctaTo="/analysis"
        logoClassName="w-[92px] text-stone-50 flex-shrink-0"
        navItemClassName="text-stone-400 hover:text-white transition-colors duration-300"
        navItemActiveClassName="text-lime-400 font-semibold"
        ctaClassName="bg-primary text-on-primary-container min-h-[38px] px-6 rounded-full font-bold scale-95 active:scale-90 transition-transform"
      />

      <main className="relative pt-32 pb-20 px-6 lg:px-12 max-w-screen-2xl mx-auto">
        {status === "loading" ? (
          <div className="glass-panel p-10 rounded-3xl border border-outline-variant/10 shadow-xl text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-3">Loading shared report</h1>
            <p className="text-on-surface-variant">Pulling this public audit snapshot from the cloud.</p>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="glass-panel p-10 rounded-3xl border border-outline-variant/10 shadow-xl text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-3">Shared report unavailable</h1>
            <p className="text-on-surface-variant">
              This public link is missing, expired, or not configured in Supabase yet.
            </p>
          </div>
        ) : null}

        {status === "success" ? (
          <div className="space-y-8">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="text-primary font-label text-xs uppercase tracking-[0.2em] mb-3 block">Public Share</span>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface mb-2">{pageTitle}</h1>
                <p className="text-on-surface-variant max-w-xl">
                  Shared by <span className="text-on-surface font-semibold">{sharedByLabel}</span> from the current Auditly report.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 bg-surface-container-high border border-outline-variant/20 px-5 py-3 rounded-xl text-sm font-semibold text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  {new Date(report.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
                <div className="flex items-center gap-2 bg-surface-container-high border border-outline-variant/20 px-5 py-3 rounded-xl text-sm font-semibold text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">public</span>
                  Public Link
                </div>
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
                    <MetricTile label="Word Count" value={(metrics.wordCount || 0).toLocaleString()} />
                    <MetricTile label="CTA Count" value={String(metrics.ctaCount || 0).padStart(2, "0")} />
                    <MetricTile label="Reading Time" value={metrics.readingTime || "0.0 min"} />
                    <MetricTile label="Images" value={String(metrics.imageCount || 0).padStart(2, "0")} />
                    <MetricTile label="Internal Links" value={String(metrics.internalLinkCount || 0).padStart(2, "0")} />
                    <MetricTile label="External Links" value={String(metrics.externalLinkCount || 0).padStart(2, "0")} />
                    <MetricTile label="Headings" value={String(metrics.headingCount || 0).padStart(2, "0")} />
                    <MetricTile label="Missing Alt Text" value={metrics.missingAltTextPercentage || "0%"} />
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
                        {metrics.metaTitle || "Not found"}
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
                        {metrics.metaDescription || "Not found"}
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
                    {insightCards.length > 0 ? insightCards.map((insight) => (
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
                          {(insight.tags || []).map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-widest"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )) : (
                      <div className="glass-panel p-8 rounded-2xl border border-outline-variant/10 shadow-sm">
                        <p className="text-on-surface-variant">No AI insights were included in this shared report.</p>
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-primary">checklist</span>
                    <h2 className="text-xl font-bold tracking-tight">Critical Recommendations</h2>
                  </div>
                  <div className="space-y-4">
                    {recommendationCards.length > 0 ? recommendationCards.map((recommendation) => (
                      <div
                        key={recommendation.title}
                        className={`bg-surface-container-low p-6 rounded-2xl flex items-start gap-6 border-l-4 ${
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
                      </div>
                    )) : (
                      <div className="glass-panel p-8 rounded-2xl border border-outline-variant/10 shadow-sm">
                        <p className="text-on-surface-variant">No recommendations were included in this shared report.</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              <aside className="lg:col-span-4 space-y-8">
                <div className="glass-panel p-8 rounded-3xl border border-outline-variant/10 shadow-xl relative overflow-hidden">
                  <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
                  <div className="text-center mb-8 relative">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-primary/20 p-2 mb-4">
                      <div className="w-full h-full rounded-full bg-surface-container-highest flex flex-col items-center justify-center border-4 border-primary shadow-[0_0_30px_rgba(197,253,93,0.2)]">
                        <span className="text-4xl font-black text-on-surface leading-none">{summary.score || 0}</span>
                        <span className="text-[10px] font-bold text-primary-container uppercase tracking-tighter">Score</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-extrabold tracking-tight">{summary.statusLabel || "Shared Report"}</h3>
                    <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-[0.1em]">Shared by {sharedByLabel}</p>
                  </div>
                  <div className="space-y-6">
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {summary.summaryText || "No summary available."}
                    </p>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Target URL</label>
                      <p className="text-sm font-mono text-primary truncate">{report.url}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Shared Date</label>
                        <p className="text-sm font-semibold">{new Date(report.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Status</label>
                        <p className="text-sm font-semibold">Public Share</p>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-outline-variant/10">
                      <SnapshotImage
                        alt={`Shared audit snapshot of ${report.url}`}
                        src={metrics.headlessSnapshotUrl || `https://s.wordpress.com/mshots/v1/${encodeURIComponent(report.url)}?w=1200`}
                      />
                      <p className="text-[10px] text-center text-on-surface-variant mt-3 italic">
                        Visual scan snapshot generated via headless browser
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        ) : null}
      </main>

      <AppFooter className="bg-[#0b0f08]" borderClassName="border-[#1c2116]" textClassName="text-[#a9ada0]" linkHoverClassName="hover:text-[#c5fd5d]" />
    </div>
  );
}

export default SharedReportPage;
