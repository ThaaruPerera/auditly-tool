import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../context/AnalysisContext";

function UrlAnalysisForm() {
  const [url, setUrl] = useState("");
  const { analyzeUrl } = useAnalysis();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      navigate("/dashboard");
      await analyzeUrl(url);
    } catch (error) {}
  };

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <form
        className="glass-card p-2 rounded-full flex items-center gap-2 group transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/30"
        onSubmit={handleSubmit}
      >
        <div className="pl-4 flex items-center text-primary">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            language
          </span>
        </div>
        <input
          className="bg-transparent border-none focus:ring-0 text-on-surface w-full placeholder:text-outline py-4"
          placeholder="Enter your website URL..."
          type="text"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-primary to-primary-container text-on-primary-container px-8 py-4 rounded-full font-bold whitespace-nowrap scale-100 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          Analyze Now
        </button>
      </form>
    </div>
  );
}

export default UrlAnalysisForm;
