import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../context/AnalysisContext";
import "../styles/analysis.css";

function AnalysisPage() {
  const navigate = useNavigate();
  const { status } = useAnalysis();

  useEffect(() => {
    if (status === "loading" || status === "success" || status === "error") {
      navigate("/dashboard");
    }
  }, [navigate, status]);

  return null;
}

export default AnalysisPage;
