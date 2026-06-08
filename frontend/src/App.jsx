import { useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

export default function App() {
  const [form, setForm] = useState({
    pclass: "3", sex: "0", age: 25,
    sibsp: "0", parch: "0", fare: 7, embarked: "0"
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const predict = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/predict`, form);
      setResult(res.data);
    } catch (err) {
      alert("Error connecting to Flask API!");
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <div className="hero">
        <span className="ship">🚢</span>
        <h1>Would you have <span>survived</span> the Titanic?</h1>
        <p>Enter your details below. Our AI model predicts your fate.</p>
        <div className="stats">
          <div className="stat"><span className="num">82.68%</span><span className="label">Accuracy</span></div>
          <div className="stat"><span className="num">891</span><span className="label">Passengers</span></div>
          <div className="stat"><span className="num">100</span><span className="label">Trees</span></div>
        </div>
      </div>

      <div className="card-grid">
        <div className="form-card">
          <h2>Passenger Details</h2>
          <p className="sub">Fill in your details as a 1912 Titanic passenger</p>

          <div className="form-row">
            <div className="field">
              <label>Passenger Class</label>
              <select name="pclass" value={form.pclass} onChange={handleChange}>
                <option value="1">1st Class — First</option>
                <option value="2">2nd Class — Second</option>
                <option value="3">3rd Class — Third</option>
              </select>
            </div>
            <div className="field">
              <label>Sex</label>
              <select name="sex" value={form.sex} onChange={handleChange}>
                <option value="0">Male</option>
                <option value="1">Female</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Age — <strong>{form.age}</strong></label>
            <input type="range" name="age" min="1" max="80"
              value={form.age} onChange={handleChange}/>
          </div>

          <div className="field">
            <label>Ticket Fare — <strong>£{form.fare}</strong></label>
            <input type="range" name="fare" min="5" max="512"
              value={form.fare} onChange={handleChange}/>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Siblings / Spouse</label>
              <select name="sibsp" value={form.sibsp} onChange={handleChange}>
                <option value="0">0 — Alone</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3+</option>
              </select>
            </div>
            <div className="field">
              <label>Parents / Children</label>
              <select name="parch" value={form.parch} onChange={handleChange}>
                <option value="0">0 — None</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3+</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Port of Embarkation</label>
            <select name="embarked" value={form.embarked} onChange={handleChange}>
              <option value="0">Southampton, England (S)</option>
              <option value="1">Cherbourg, France (C)</option>
              <option value="2">Queenstown, Ireland (Q)</option>
            </select>
          </div>

          <button className="predict-btn" onClick={predict} disabled={loading}>
            {loading ? "Predicting..." : "⚡ Predict My Survival"}
          </button>
        </div>

        <div className="result-card">
          {!result ? (
            <div className="idle">
              <span className="idle-icon">🌊</span>
              <p className="idle-quote">"She's unsinkable."</p>
              <p className="idle-sub">— White Star Line, 1912</p>
              <p className="idle-hint">Fill in your details to discover your fate</p>
            </div>
          ) : (
            <div className="result">
              <div className={`verdict ${result.survived ? "survived" : "died"}`}>
                <span className="verdict-icon">{result.survived ? "🛟" : "⚓"}</span>
                <h2>{result.survived ? "Survived!" : "Did Not Survive"}</h2>
                <p>{result.survived
                  ? "You would likely have made it onto a lifeboat!"
                  : "You would not have survived the sinking."}</p>
              </div>

              <div className="prob-section">
                <div className="prob-header">
                  <span>Survival Probability</span>
                  <span className={`prob-num ${result.survived ? "survived" : "died"}`}>
                    {result.probability}%
                  </span>
                </div>
                <div className="prob-track">
                  <div
                    className={`prob-fill ${result.survived ? "survived" : "died"}`}
                    style={{ width: `${result.probability}%` }}
                  />
                </div>
                <p className="prob-hint">Based on 100 decision trees voting</p>
              </div>

              <button className="reset-btn" onClick={() => setResult(null)}>
                Try Another Passenger
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="footer">
        <p>Built by <strong>Shiva Changole</strong> — Titanic EDA & ML Project</p>
        <a href="https://github.com/ShivaiChangole/titanic-eda" target="_blank">
          View on GitHub
        </a>
      </div>
    </div>
  );
}