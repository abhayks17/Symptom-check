import React, { useState } from "react";
import axios from "axios";
import "./Interview.css";

// --- Stepper Component ---
const Stepper = ({ currentStep, lang }) => {
  const stepLabels = {
    en: ["Introduction", "Details", "Symptoms", "Analyze", "Results"],
    ml: ["ആമുഖം", "വിവരങ്ങൾ", "ലക്ഷണങ്ങൾ", "വിലയിരുത്തുക", "ഫലം"],
  };

  const steps = stepLabels[lang] || stepLabels.en;

  return (
    <div className="stepper-container">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        let stepClass = "step-item";
        if (stepNumber === currentStep) {
          stepClass += " active";
        } else if (stepNumber < currentStep) {
          stepClass += " completed";
        }

        return (
          <div key={label} className={stepClass}>
            <div className="step-marker"></div>
            <div className="step-label">{label}</div>
          </div>
        );
      })}
    </div>
  );
};

// --- Main Interview Component ---
export default function Interview() {
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState("en");
  const [accepted, setAccepted] = useState(false);

  // Updated state to handle detailed habits and conditions
  const [details, setDetails] = useState({
    name: "",
    age: "",
    habits: {
      smoking: "no",
      alcohol: "no",
    },
    conditions: {
      diabetes: "not-checked",
      hypertension: "not-checked",
      heart_disease: "not-checked",
    },
  });

  const [issue, setIssue] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handlers for updated habits and conditions state
  const handleHabitChange = (habit, value) => {
    setDetails((prev) => ({
      ...prev,
      habits: { ...prev.habits, [habit]: value },
    }));
  };

  const handleConditionChange = (condition, value) => {
    setDetails((prev) => ({
      ...prev,
      conditions: { ...prev.conditions, [condition]: value },
    }));
  };

  const handleCheckboxChange = (keyword) => {
    setKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword]
    );
  };

  const handleSubmit = async () => {
  if (!issue) return alert(lang === 'ml' ? 'പ്രശ്നം തിരഞ്ഞെടുക്കുക' : 'Please select an issue');
  
  setLoading(true);
  try {
    const payload = {
      lang,
      details,
      issue,
      keywords,
    };

    const res = await axios.post("http://localhost:5000/api/symptoms/predict", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Assuming backend returns { problem: "...", severity: "..." }
    if (res.data && res.data.problem) {
      setResult(res.data);
      setStep(5);
    } else {
      alert(lang === 'ml' ? 'ഫലം ലഭിച്ചില്ല, പിന്നെ ശ്രമിക്കുക' : 'No result received, try again');
    }
  } catch (err) {
    console.error("Backend Error:", err);
    alert(lang === 'ml' ? 'ബാക്ക്‌എൻഡ് കണക്ട് ചെയ്യാനായില്ല' : 'Failed to connect to backend');
  }
  setLoading(false);
};


  const resetInterview = () => {
    setStep(1);
    setLang("en");
    setAccepted(false);
    setDetails({
        name: "",
        age: "",
        habits: { smoking: "no", alcohol: "no" },
        conditions: { diabetes: "not-checked", hypertension: "not-checked", heart_disease: "not-checked" },
    });
    setIssue("");
    setKeywords([]);
    setResult(null);
  }

  // --- Multilingual Text & Data ---
  const T = {
    title: { en: "Symptom Interview", ml: "ലക്ഷണങ്ങൾ അഭിമുഖം" },
    next: { en: "Next", ml: "അടുത്തത്" },
    back: { en: "Back", ml: "പിന്നിലേക്ക്" },
    acceptTerms: { en: "I accept the terms and conditions", ml: "നിബന്ധനകളും വ്യവസ്ഥകളും ഞാൻ അംഗീകരിക്കുന്നു" },
    continue: { en: "Continue", ml: "തുടരുക" },
    personalDetails: { en: "Personal Details", ml: "വ്യക്തിഗത വിവരങ്ങൾ" },
    name: { en: "Name", ml: "പേര്" },
    age: { en: "Age (in years)", ml: "പ്രായം (വർഷത്തിൽ)" },
    habits: { en: "Habits", ml: "ശീലങ്ങൾ" },
    conditions: { en: "Existing Conditions", ml: "നിലവിലുള്ള രോഗങ്ങൾ" },
    selectIssue: { en: "Select Main Issue", ml: "പ്രധാന പ്രശ്നം തിരഞ്ഞെടുക്കുക" },
    otherSymptoms: { en: "Select Other Symptoms", ml: "മറ്റ് ലക്ഷണങ്ങൾ തിരഞ്ഞെടുക്കുക" },
    analyze: { en: "Analyze Health Condition", ml: "ആരോഗ്യ സ്ഥിതി വിലയിരുത്തുക" },
    results: { en: "Results", ml: "ഫലം" },
    restart: { en: "Start New Interview", ml: "പുതിയ അഭിമുഖം ആരംഭിക്കുക" },
    predictedProblem: { en: "Predicted Problem", ml: "പ്രതീക്ഷിച്ച പ്രശ്നം" },
    severity: { en: "Severity", ml: "ഗൗരവനില" },
    smoking: { en: "Smoking", ml: "പുകവലി" },
    alcohol: { en: "Alcohol", ml: "മദ്യപാനം" },
    diabetes: { en: "Diabetes", ml: "പ്രമേഹം" },
    hypertension: { en: "Hypertension", ml: "രക്താതിമർദ്ദം" },
    heart_disease: { en: "Heart Disease", ml: "ഹൃദ്രോഗം" },
    yes: { en: "Yes", ml: "അതെ" },
    no: { en: "No", ml: "ഇല്ല" },
    occasionally: { en: "Occasionally", ml: "ഇടയ്ക്കിടെ" },
    not_checked: { en: "Not Checked", ml: "പരിശോധിച്ചിട്ടില്ല" },
  };

  const symptoms = [
    { en: "Fever", ml: "ജ്വരം" }, { en: "Cough", ml: "ചുമ" }, { en: "Cold", ml: "തണുപ്പ്" },
    { en: "Headache", ml: "തലവേദന" }, { en: "Nausea", ml: "മനംമറക്കം" }, { en: "Stomach Pain", ml: "വയറ്റുവേദന" },
    { en: "Vomiting", ml: "ഛർദ്ദി" }, { en: "Chest Pain", ml: "മാര്വേദന" }, { en: "Breathless", ml: "ശ്വാസംമുട്ടൽ" },
    { en: "Fatigue", ml: "തളർച്ച" }, { en: "Stress", ml: "സമ്മർദ്ദം" }, { en: "Body Pain", ml: "ശരീരവേദന" },
  ];
  // Convert severity number to descriptive level
const getSeverityText = (severity, lang) => {
  if (severity <= 3) return lang === 'ml' ? 'ചെറിയ (Minor)' : 'Minor';
  if (severity <= 7) return lang === 'ml' ? 'മധ്യസ്ഥ (Moderate)' : 'Moderate';
  return lang === 'ml' ? 'ഗുരുതരമായ (Dangerous)' : 'Dangerous';
};

// Suggest actions based on severity
const getActionText = (severity, lang) => {
  if (severity <= 3)
    return lang === 'ml'
      ? 'ഹൃസ്വം വിശ്രമിക്കുക, വീട്ടിൽ നിരീക്ഷിക്കുക, ഡോക്ടറെ 24 മണിക്കൂറിനുള്ളിൽ കാണുക.'
      : 'Rest, monitor at home, visit a doctor within 24 hours.';
  if (severity <= 7)
    return lang === 'ml'
      ? 'വൈദ്യ സഹായം തേടുക, ഡോക്ടറെ 12 മണിക്കൂറിനുള്ളിൽ കാണുക.'
      : 'Seek medical attention, consult a doctor within 12 hours.';
  return lang === 'ml'
      ? 'ഇടപെടൽ ഉടൻ ആവശ്യമാണ്, അടിയന്തര വിഭാഗത്തിൽ പ്രവേശിക്കുക.'
      : 'Immediate medical intervention required, visit emergency department.';
};

// Suggest doctor based on problem
const suggestDoctor = (problem, lang) => {
  const prob = problem.toLowerCase();
  if (prob.includes("heart") || prob.includes("ഹൃദയ")) return lang === 'ml' ? "ഹൃദ്രോഗ വിദഗ്ധൻ" : "Cardiologist";
  if (prob.includes("food") || prob.includes("ഭക്ഷ്യ") || prob.includes("stomach") || prob.includes("വയറ")) return lang === 'ml' ? "ഗാസ്ട്രോയെൻറോളജിസ്റ്റ്" : "Gastroenterologist";
  if (prob.includes("migraine") || prob.includes("മൈഗ്രെയ്ൻ") || prob.includes("headache") || prob.includes("തലവേദന")) return lang === 'ml' ? "ന്യുറോളജിസ്റ്റ്" : "Neurologist";
  if (prob.includes("fever") || prob.includes("ജ്വരം") || prob.includes("cold") || prob.includes("ചുമ")) return lang === 'ml' ? "ജനറൽ ഫിസിഷ്യൻ" : "General Physician";
  return lang === 'ml' ? "ജനറൽ ഫിസിഷ്യൻ" : "General Physician";
};

  const habitsList = [
    { key: "smoking", label: T.smoking[lang] },
    { key: "alcohol", label: T.alcohol[lang] }
  ];

  const conditionsList = [
      { key: "diabetes", label: T.diabetes[lang] },
      { key: "hypertension", label: T.hypertension[lang] },
      { key: "heart_disease", label: T.heart_disease[lang] }
  ];


  // --- Helper to render option buttons ---
  const renderOptions = (group, itemKey, handler, options) => (
    <div className="options-group">
      {options.map((optionValue) => (
        <button
          key={optionValue}
          className={`option-btn ${details[group][itemKey] === optionValue ? "selected" : ""}`}
          onClick={() => handler(itemKey, optionValue)}
        >
          {T[optionValue.replace('-', '_')][lang]}
        </button>
      ))}
    </div>
  );
  
  return (
    <div className="interview-layout">
      <Stepper currentStep={step} lang={lang} />
      <div className="interview-container">
        <div className="interview-box">
          
          {/* Step 1: Language + Terms */}
          {step === 1 && (
            <div className="step-content center">
              <h2>{lang === "ml" ? "ഭാഷ തിരഞ്ഞെടുക്കുക" : "Select Language"}</h2>
              <div className="lang-buttons">
                <button className={lang === 'en' ? 'selected' : ''} onClick={() => setLang("en")}>English</button>
                <button className={lang === 'ml' ? 'selected' : ''} onClick={() => setLang("ml")}>മലയാളം</button>
              </div>
              <div className="checkbox-row">
                <input
                  id="terms-checkbox"
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                <label htmlFor="terms-checkbox">{T.acceptTerms[lang]}</label>
              </div>
              <button
                className="main-btn"
                disabled={!accepted}
                onClick={() => setStep(2)}
              >
                {T.continue[lang]}
              </button>
            </div>
          )}

          {/* Step 2: Personal Details */}
          {step === 2 && (
            <div className="step-content">
              <h3>{T.personalDetails[lang]}</h3>
              <div className="form-grid">
                <input type="text" placeholder={T.name[lang]} value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })}/>
                <input type="number" placeholder={T.age[lang]} value={details.age} onChange={(e) => setDetails({ ...details, age: e.target.value })} />
              </div>
              
              <h4>{T.habits[lang]}</h4>
              {habitsList.map(({key, label}) => (
                  <div className="check-item" key={key}>
                      <label>{label}</label>
                      {renderOptions('habits', key, handleHabitChange, ['yes', 'no', 'occasionally'])}
                  </div>
              ))}

              <h4>{T.conditions[lang]}</h4>
              {conditionsList.map(({key, label}) => (
                  <div className="check-item" key={key}>
                      <label>{label}</label>
                      {renderOptions('conditions', key, handleConditionChange, ['yes', 'no', 'not-checked'])}
                  </div>
              ))}

              <div className="nav-buttons">
                <button onClick={() => setStep(1)}>{T.back[lang]}</button>
                <button onClick={() => setStep(3)} disabled={!details.name || !details.age}>{T.next[lang]}</button>
              </div>
            </div>
          )}
          
          {/* Step 3: Symptoms */}
          {step === 3 && (
            <div className="step-content">
              <h3>{T.selectIssue[lang]}</h3>
              <select value={issue} onChange={(e) => setIssue(e.target.value)}>
                <option value="">{lang === "ml" ? "തിരഞ്ഞെടുക്കുക" : "Select"}</option>
                {symptoms.map((s) => ( <option key={s.en} value={s.en}>{lang === "ml" ? s.ml : s.en}</option> ))}
              </select>
              <h4>{T.otherSymptoms[lang]}</h4>
              <div className="symptom-grid">
                {symptoms.filter(s => s.en !== issue).map((s) => (
                  <button key={s.en} className={`symptom ${keywords.includes(s.en) ? "selected" : ""}`} onClick={() => handleCheckboxChange(s.en)}>
                    {lang === "ml" ? s.ml : s.en}
                  </button>
                ))}
              </div>
              <div className="nav-buttons">
                <button onClick={() => setStep(2)}>{T.back[lang]}</button>
                <button onClick={() => setStep(4)} disabled={!issue}>{T.next[lang]}</button>
              </div>
            </div>
          )}

          {/* Step 4: Submit */}
          {step === 4 && (
            <div className="step-content center">
              <h3>{T.analyze[lang]}</h3>
              <p>{lang === 'ml' ? 'നിങ്ങളുടെ ആരോഗ്യനില വിലയിരുത്താൻ താഴെയുള്ള ബട്ടൺ ക്ലിക്ക് ചെയ്യുക.' : 'Click the button below to analyze your health condition.'}</p>
              <button className="main-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? (lang === 'ml' ? 'വിലയിരുത്തുന്നു...' : 'Analyzing...') : T.analyze[lang]}
              </button>
              <div className="nav-buttons single">
                 <button onClick={() => setStep(3)}>{T.back[lang]}</button>
              </div>
            </div>
          )}
{/* Step 5: Results */}
{step === 5 && result && (
  <div className="step-content center">
    <h3>{T.results[lang]}</h3>
    <div className="result-box">
      {/* Personalized greeting */}
      <p>
        {details.name
          ? `${details.name}, ${lang === 'ml' ? 'നിങ്ങളുടെ വിശകലനം കാണിക്കുന്നത്:' : 'your analysis indicates:'} ${result.problem}`
          : `${lang === 'ml' ? 'നിങ്ങളുടെ വിശകലനം കാണിക്കുന്നത്:' : 'Analysis indicates:'} ${result.problem}`}
      </p>

      {/* Severity description */}
      <p>
        {lang === 'ml'
          ? `ഗൗരവം: ${getSeverityText(result.severity, 'ml')}`
          : `Severity: ${getSeverityText(result.severity, 'en')}`}
      </p>

      {/* Recommended action */}
      <p>
        {lang === 'ml'
          ? `ശുപാർശ ചെയ്ത നടപടി: ${getActionText(result.severity, 'ml')}`
          : `Recommended action: ${getActionText(result.severity, 'en')}`}
      </p>

      {/* Doctor recommendation */}
      <p>
        {lang === 'ml'
          ? `പരിശോധിക്കാൻ ഡോക്ടർ: ${suggestDoctor(result.problem, 'ml')}`
          : `Doctor to consult: ${suggestDoctor(result.problem, 'en')}`}
      </p>
    </div>
    <button className="main-btn" onClick={resetInterview}>
      {T.restart[lang]}
    </button>
  </div>
)}


        </div>
      </div>
    </div>
  );
}
