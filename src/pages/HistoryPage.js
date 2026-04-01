import React from "react";
import { useNavigate } from "react-router-dom";
import AppFooter from "../components/AppFooter";
import PlaceholderButton from "../components/PlaceholderButton";
import SiteHeader from "../components/SiteHeader";
import { useAnalysis } from "../context/AnalysisContext";
import "../styles/history.css";
import "../styles/dashboard.css";

function formatDateParts(isoDate) {
  const date = new Date(isoDate);

  return {
    date: date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short"
    })
  };
}

function getDomainLabel(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (error) {
    return url;
  }
}

function getScoreTone(score) {
  if (score < 70) {
    return "error";
  }

  return "primary";
}

function HistoryPage() {
  const navigate = useNavigate();
  const { historyError, historyLoading, historyRecords, loadHistoryRecord } = useAnalysis();

  const handleViewReport = (recordId) => {
    const didLoad = loadHistoryRecord(recordId);

    if (didLoad) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="history-page bg-background text-on-surface min-h-screen flex flex-col aurora-glow selection:bg-primary/30">
      <SiteHeader
        navItems={[
          { label: "Home", to: "/" },
          { label: "Dashboard", to: "/dashboard" },
          { label: "History", to: "/history" }
        ]}
        ctaLabel="Get Started"
        ctaTo="/analysis"
        logoClassName="w-[92px] text-stone-50 flex-shrink-0"
        navItemClassName="text-stone-400 hover:text-white transition-colors duration-300"
        navItemActiveClassName="text-lime-400 font-semibold"
        ctaClassName="bg-primary text-on-primary-container min-h-[38px] px-6 rounded-full font-bold scale-95 active:scale-90 transition-transform"
      />

      <main className="relative flex-1 pt-32 pb-20 px-6 lg:px-12 max-w-screen-2xl mx-auto w-full">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-primary font-label text-xs uppercase tracking-[0.2em] mb-3 block">Audit Archive</span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface mb-2">History Dashboard</h1>
            <p className="text-on-surface-variant max-w-xl">
              Review the audits saved under your account and reopen any report with the same dashboard flow and scoring context.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-surface-container-high border border-outline-variant/20 px-5 py-3 rounded-xl text-sm font-semibold text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">history</span>
              {historyRecords.length} Saved
            </div>
            <div className="flex items-center gap-2 bg-surface-container-high border border-outline-variant/20 px-5 py-3 rounded-xl text-sm font-semibold text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">account_circle</span>
              Account Linked
            </div>
          </div>
        </div>

        <div className="w-full">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary">history</span>
              <h2 className="text-xl font-bold tracking-tight">Saved Reports</h2>
            </div>
            <div className="glass-panel overflow-hidden rounded-3xl border border-outline-variant/10 shadow-xl">
            {historyLoading ? (
              <div className="px-8 py-20 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-high text-primary">
                  <span className="material-symbols-outlined text-3xl">cloud_sync</span>
                </div>
                <h2 className="text-2xl font-bold mb-3">Loading cloud history</h2>
                <p className="text-on-surface-variant max-w-md mx-auto leading-relaxed">
                  Pulling your saved audits from Supabase now.
                </p>
              </div>
            ) : historyError ? (
              <div className="px-8 py-20 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-high text-error">
                  <span className="material-symbols-outlined text-3xl">cloud_off</span>
                </div>
                <h2 className="text-2xl font-bold mb-3">Cloud history unavailable</h2>
                <p className="text-on-surface-variant max-w-md mx-auto leading-relaxed">
                  {historyError}
                </p>
              </div>
            ) : historyRecords.length === 0 ? (
              <div className="px-8 py-20 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-high text-primary">
                  <span className="material-symbols-outlined text-3xl">history</span>
                </div>
                <h2 className="text-2xl font-bold mb-3">No audits saved yet</h2>
                <p className="text-on-surface-variant max-w-md mx-auto leading-relaxed">
                  Run a website audit from your dashboard flow and it will be saved here under your signed-in profile automatically.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-high/50">
                        <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.1em] text-on-surface-variant">URL Destination</th>
                        <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.1em] text-on-surface-variant">Scan Date</th>
                        <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.1em] text-on-surface-variant">Overall Score</th>
                        <th className="px-8 py-5 text-right text-xs font-black uppercase tracking-[0.1em] text-on-surface-variant">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {historyRecords.map((record) => {
                        const { date, time } = formatDateParts(record.createdAt);
                        const score = record.metrics?.auditSummary?.score || 0;
                        const tone = getScoreTone(score);
                        const label =
                          record.metrics?.auditSummary?.statusLabel ||
                          record.metrics?.metaTitle ||
                          "Saved Audit";

                        return (
                          <tr key={record.id} className="group hover:bg-surface-container-high/30 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center overflow-hidden">
                                  {record.metrics?.headlessSnapshotUrl ? (
                                    <img
                                      className="w-full h-full object-cover opacity-90"
                                      alt={record.url}
                                      src={record.metrics.headlessSnapshotUrl}
                                    />
                                  ) : (
                                    <span className="material-symbols-outlined text-primary text-lg">language</span>
                                  )}
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-on-surface">{getDomainLabel(record.url)}</div>
                                  <div className="text-[10px] text-on-surface-variant">{label}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-6">
                              <div className="text-sm text-on-surface-variant">{date}</div>
                              <div className="text-[10px] text-outline italic">{time}</div>
                            </td>
                            <td className="px-6 py-6">
                              <div className="flex items-center space-x-2">
                                <span className={`${tone === "error" ? "text-error" : "text-primary"} font-black text-lg`}>{score}</span>
                                <span className="text-[10px] text-on-surface-variant">/ 100</span>
                                <div className="w-8 h-1 bg-surface-container rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${tone === "error" ? "bg-error" : "bg-primary"}`}
                                    style={{ width: `${score}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <PlaceholderButton
                                className={`px-5 py-2 rounded-full border border-outline-variant text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                                  tone === "error"
                                    ? "hover:bg-error hover:text-on-error hover:border-error"
                                    : "hover:bg-primary hover:text-on-primary hover:border-primary"
                                }`}
                                onClick={() => {
                                  handleViewReport(record.id);
                                }}
                              >
                                View Report
                              </PlaceholderButton>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="px-8 py-6 bg-surface-container-high/20 flex justify-between items-center">
                  <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                    Showing {historyRecords.length} saved {historyRecords.length === 1 ? "result" : "results"}
                  </div>
                  <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                    Synced with cloud history
                  </div>
                </div>
              </>
            )}
            </div>
          </section>
        </div>
      </main>

      <AppFooter className="bg-[#0b0f08]" borderClassName="border-[#1c2116]" textClassName="text-[#a9ada0]" linkHoverClassName="hover:text-[#c5fd5d]" />
    </div>
  );
}

export default HistoryPage;
