import React from "react";
import AppFooter from "../components/AppFooter";
import RouteButton from "../components/RouteButton";
import SiteHeader from "../components/SiteHeader";
import UrlAnalysisForm from "../components/UrlAnalysisForm";
import "../styles/home.css";

function HomePage() {
  return (
    <div className="font-body text-on-surface antialiased min-h-screen">
      <div className="hero-bg">
        <SiteHeader
          navItems={[
            { label: "Home", to: "/" },
            { label: "Dashboard", to: "/dashboard" },
            { label: "History", to: "/history" }
          ]}
          ctaLabel="Login"
          ctaTo="/login"
          logoClassName="w-[92px] text-stone-50 flex-shrink-0"
          navItemClassName="text-stone-400 hover:text-white transition-colors duration-300"
          navItemActiveClassName="text-lime-400 font-semibold"
          ctaClassName="bg-primary text-on-primary-container min-h-[38px] px-6 rounded-full font-bold scale-95 active:scale-90 transition-transform"
        />

        <main className="pt-36">
          <section className="max-w-4xl mx-auto text-center space-y-8 relative px-6 pb-28">
            <div className="absolute -top-60 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[140px] -z-10" />
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tight text-on-surface leading-[1.1]">
              AI Website <br /> <span className="text-primary">Audit Tool</span>
            </h1>
            <p className="text-xl text-on-surface-variant max-w-2xl mx-auto">
              Analyze your website’s SEO, content, and UX in seconds using our proprietary Digital Aurora engine.
            </p>
            <UrlAnalysisForm />

            <div className="pt-12 flex flex-col items-center gap-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">
                Trusted by leading innovators
              </span>
              <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale contrast-125">
                <img
                  alt="Nvidia"
                  className="h-6 object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeeuSEs29wk8XdJ7lpAq2zzkzptyOMnefBZNLqT1WEvUsfZGA3xtchOhxGzbFOw8gm9-H57ZyyVft8oXatTmQ8YrwdcciayaSpJSv20qq_k-Yuyr-rRwZLUfaK6glpBkgHNOFwtMls93QlPFYAhGCCwI5Ol1PQht0RW_fDwp1_nHhF-ezA3emeFUROG2H9WEJytHgA4oZPvjdCBMFtUCeHwL9GRLoSQ-3uTMcYuESjBFyO1Q3HZMD6AJHVGCrSl77A5TUI0zfZ4X8"
                />
                <img
                  alt="Figma"
                  className="h-6 object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcn0YUG3GMmq-sxX0IzBU27Z54CLoaKGjeCbUGxNwLPoAPlv2dW9pemRemZEG1SHTo0oWVN5t9-rJPut1jcQwmhJ5e4YJNWU6Rp6pAUrnplj8Cq8r4pwTKOs4Vpumi2h3Tusq0jmUQONIGFXN3My-dhVkURiMgpa-M2ekC9Q_0U5JnL8SUkLYTgb2AOZSALu_vdjMJUQSH2D3cHrupI77p0axuupJBtJ0rMHkPwzRXgJnL1n4k7zRJWE44SfIeLYZ6fUqvV33d6dM"
                />
                <img
                  alt="Google"
                  className="h-6 object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiPTasivte9Xn-Uu_04-HUYZiaNlzIGVW08A_93OPvD6-O7uaFr9cNI1tN7A4Kq4ugKIoHLIpaRXXVw5G6CUnLMqSxLHVeAb9we1-kVyW1YrVm2Ng1-VmsHGj3mDRRZeuJQuRVUh2IpNgldlxhwaTmT8ZP6cflavd2oXsnEUf73e6rsGZplYNgsIQ2Z5e2ZhkhRJjzZnqBTLAFPggD5Svv0CGaGv6ftzJbJsT6amOuTBr5ed0wF27Fn3E6AT6mUM191j0CVIpKux0"
                />
              </div>
            </div>
          </section>
        </main>
      </div>

      <div className="curved-transition">
        <div className="curve-shape" />
      </div>

      <div className="solid-section pb-20">
        <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="surface-container-high rounded-xl p-8 border border-outline-variant/10 hover:border-primary/20 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-on-surface">
              <span className="material-symbols-outlined text-8xl">search_check</span>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                manage_search
              </span>
            </div>
            <h3 className="text-xl font-bold mb-3">Deep SEO Scan</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Review on-page structure with metrics for headings, metadata, internal links, external links, and content length.
            </p>
          </div>
          <div className="surface-container-high rounded-xl p-8 border border-outline-variant/10 hover:border-primary/20 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-on-surface">
              <span className="material-symbols-outlined text-8xl">show_chart</span>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                heat_pump
              </span>
            </div>
            <h3 className="text-xl font-bold mb-3">Readable Content Metrics</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              See practical page signals like word count, CTA count, image coverage, and estimated reading time in one dashboard.
            </p>
          </div>
          <div className="surface-container-high rounded-xl p-8 border border-outline-variant/10 hover:border-primary/20 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-on-surface">
              <span className="material-symbols-outlined text-8xl">auto_awesome</span>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 text-primary">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                neurology
              </span>
            </div>
            <h3 className="text-xl font-bold mb-3">Content Intelligence</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Get AI-written insights and prioritized recommendations based on the actual structure and content found on the page.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto mt-40 px-6">
          <section className="rounded-xl overflow-hidden glass-card">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="p-12 space-y-6">
                <span className="text-primary text-xs font-bold uppercase tracking-widest">Practical Workflow</span>
                <h2 className="text-4xl font-headline font-bold">Analyze, Save, and Share Reports</h2>
                <p className="text-on-surface-variant">
                  Auditly helps you run a website check, review the results in a structured dashboard, save reports to your account, and generate public share links.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    <span className="text-sm font-medium">Cloud-saved report history for signed-in users</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    <span className="text-sm font-medium">Public share links for current audit snapshots</span>
                  </li>
                </ul>
                <RouteButton
                  to="/dashboard"
                  className="bg-surface-variant border border-outline-variant/20 text-on-surface px-6 py-3 rounded-full font-bold text-sm hover:bg-surface-container transition-all"
                >
                  Open Dashboard
                </RouteButton>
              </div>
              <div className="relative h-full min-h-[400px] overflow-hidden">
                <img
                  alt="Dashboard"
                  className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-40"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSet2JnWX65et1H2p-zn6Qf0g7Ju36vFGkM0dUCqsRv2tISq0Iw8rke6cXCWN_kwOMTRmNaNykqwM8Ujr1g48_Do7lQk3YrZPywEz51C0wge4mfJMO78zY4-3OAu37CAftcuz-0plvFEzN3svaIA8xosMfwSYP__LflVvY5FdnYbaTqA9PIOC6PWNFJNoCCPDOc8-Le48cPqqFHHbKURb1rD5j9eNPsvnbWHW8C7wQE89EHDxa6h4Tt52ZByE2h_kYqXU6NygRUCo"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/80" />
              </div>
            </div>
          </section>
        </div>
      </div>

      <AppFooter className="solid-section" />
    </div>
  );
}

export default HomePage;
