import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [language, setLanguage] = useState("");
  const [issue, setIssue] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [result, setResult] = useState(null);

  const symptoms = [
    { en: "Fever", ml: "ജ്വരം" },
    { en: "Cough", ml: "ചുമ" },
    { en: "Cold", ml: "തണുപ്പ്" },
    { en: "Headache", ml: "തലവേദന" },
    { en: "Nausea", ml: "മനംമറക്കം" },
    { en: "Stomach Pain", ml: "വയറ്റുവേദന" },
    { en: "Vomiting", ml: "ഛർദ്ദി" },
    { en: "Chest Pain", ml: "മാര്വേദന" },
    { en: "Breathless", ml: "ശ്വാസംമുട്ടൽ" },
    { en: "Fatigue", ml: "തളർച്ച" },
    { en: "Stress", ml: "മാനസിക സമ്മർദ്ദം" },
    { en: "Body Pain", ml: "ശരീരവേദന" },
  ];

  const toggleKeyword = (keyword) => {
    setKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword]
    );
  };

  const handleSubmit = async () => {
    if (!issue) {
      alert(language === "ml" ? "ദയവായി ഒരു പ്രധാന പ്രശ്നം തിരഞ്ഞെടുക്കുക" : "Please select a main issue");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/symptoms/predict", {
        lang: language,
        issue,
        keywords,
      });
      setResult(res.data);
    } catch (err) {
      alert("Backend not connected or error occurred!");
      console.error(err);
    }
  };

  if (!language) {
    return (
      <div className="center-screen">
        <h2>Select Language / ഭാഷ തിരഞ്ഞെടുക്കുക</h2>
        <button onClick={() => setLanguage("en")}>English</button>
        <button onClick={() => setLanguage("ml")}>മലയാളം</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h2>{language === "en" ? "Main Issue" : "പ്രധാന പ്രശ്നം"}</h2>
      <select
        onChange={(e) => setIssue(e.target.value)}
        value={issue}
        className="dropdown"
      >
        <option value="">
          {language === "en" ? "Select Issue" : "പ്രശ്നം തിരഞ്ഞെടുക്കുക"}
        </option>
        {symptoms.map((s, i) => (
          <option key={i} value={s.en}>
            {language === "en" ? s.en : s.ml}
          </option>
        ))}
      </select>

      <h2 style={{ marginTop: "30px" }}>
        {language === "en" ? "Other Symptoms" : "മറ്റ് ലക്ഷണങ്ങൾ"}
      </h2>

      <div className="symptom-grid">
        {symptoms.map((s, i) => (
          <button
            key={i}
            onClick={() => toggleKeyword(s.en)}
            className={keywords.includes(s.en) ? "selected" : "symptom-btn"}
          >
            {language === "en" ? s.en : s.ml}
          </button>
        ))}
      </div>

      <button className="predict-btn" onClick={handleSubmit}>
        {language === "en" ? "Predict Health Issue" : "ആരോഗ്യ പ്രശ്നം കണ്ടെത്തുക"}
      </button>

      {result && (
        <div className="result-box">
          <h3>
            {language === "en"
              ? `Predicted Problem: ${result.problem}`
              : `പ്രതീക്ഷിച്ച പ്രശ്നം: ${result.problem}`}
          </h3>
          <p>
            {language === "en"
              ? `Severity Level: ${result.severity}/10`
              : `ഗൗരവനില: ${result.severity}/10`}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
