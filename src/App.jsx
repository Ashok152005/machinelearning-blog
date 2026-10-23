import { useEffect, useState } from "react";
import { T, Q, G } from "./data";
import "./App.css";

const html = (s) => ({ __html: s });
const ACCENTS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#0ea5e9", "#8b5cf6", "#ef4444", "#14b8a6"];
const NAV = [["home", "Home"], ...T.map((o) => [o.id, o.n.split(" (")[0].replace("Regression", "Reg.")]), ["quiz", "Quiz"], ["summary", "Revision"], ["glossary", "Glossary"]];
const ROWS = [
  ["Linear Regression", "Predict a number", "Supervised", "Predicting exam marks", "Only straight-line patterns"],
  ["Logistic Regression", "Predict class probability", "Supervised", "Email spam filter", "Simple decision boundary"],
  ["Decision Tree", "Decide using questions", "Supervised", "Loan approval", "Overfits when deep"],
  ["KNN", "Classify by neighbours", "Supervised", "Recommendations", "Slow on big data"],
  ["K-Means", "Group into K clusters", "Unsupervised", "Grouping customers", "K must be chosen"],
  ["Hierarchical", "Nested groups", "Unsupervised", "Grouping species", "Costly on big data"],
  ["PCA", "Reduce features", "Unsupervised", "Visualising data", "Loses some information"],
  ["Association Rules", "Items bought together", "Pattern mining", "Market basket", "Too many rules"],
];

function CodeBlock({ code }) {
  const [ok, setOk] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code);
    setOk(true);
    setTimeout(() => setOk(false), 1500);
  };
  return (
    <div className="code">
      <div className="code-bar">
        <span><i /><i /><i /></span>
        <small>python</small>
        <button onClick={copy}>{ok ? "Copied ✓" : "Copy"}</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
}

function Topic({ o, i }) {
  const [tab, setTab] = useState("learn");
  return (
    <section id={o.id} className="card reveal" style={{ "--a": ACCENTS[i] }}>
      <div className="card-head">
        <span className="num">{String(i + 1).padStart(2, "0")}</span>
        <div>
          <div className="tag">{o.t}</div>
          <h2>{o.n}</h2>
        </div>
      </div>
      <p className="def" dangerouslySetInnerHTML={html("<b>Definition:</b> " + o.d)} />
      <div className="formula" dangerouslySetInnerHTML={html(o.f)} />
      <div className="tabs">
        {[["learn", "Concepts"], ["example", "Worked example"], ["code", "Python"], ["more", "Pros & cons"]].map(([k, l]) => (
          <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>
      <div className="panel" key={tab}>
        {tab === "learn" && (
          <div className="two">
            <div>
              <h3>Key terms</h3>
              <ul className="terms">{o.k.map((x, j) => <li key={j} dangerouslySetInnerHTML={html(x)} />)}</ul>
            </div>
            <div>
              <h3>How it works</h3>
              <ol className="steps">{o.s.map((x, j) => <li key={j}>{x}</li>)}</ol>
            </div>
          </div>
        )}
        {tab === "example" && <div className="example" dangerouslySetInnerHTML={html(o.e)} />}
        {tab === "code" && <CodeBlock code={o.c} />}
        {tab === "more" && (
          <div className="three">
            <div className="mini"><h4>🎯 Applications</h4><p>{o.a}</p></div>
            <div className="mini good"><h4>✅ Advantages</h4><p>{o.v}</p></div>
            <div className="mini bad"><h4>⚠️ Limitations</h4><p>{o.l}</p></div>
          </div>
        )}
      </div>
      <div className="takeaway"><b>Key takeaway</b>{o.y}</div>
    </section>
  );
}

function Quiz() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const [score, setScore] = useState(0);
  const done = i >= Q.length;
  const choose = (j) => {
    if (pick !== null) return;
    setPick(j);
    if (j === Q[i][2]) setScore(score + 1);
  };
  const next = () => { setI(i + 1); setPick(null); };
  const reset = () => { setI(0); setPick(null); setScore(0); };
  return (
    <section id="quiz" className="card reveal" style={{ "--a": "#f59e0b" }}>
      <div className="tag">KNOWLEDGE CHECK</div>
      <h2>Revision Quiz</h2>
      <div className="bar"><div style={{ width: (Math.min(i, Q.length) / Q.length) * 100 + "%" }} /></div>
      {done ? (
        <div className="result">
          <div className="big">{score}/{Q.length}</div>
          <p>{score === Q.length ? "Perfect score! 🎉" : score >= 3 ? "Good job, revise the missed topics once more." : "Keep going, re-read the notes and try again."}</p>
          <button className="btn" onClick={reset}>Try again</button>
        </div>
      ) : (
        <div>
          <p className="qn">Question {i + 1} of {Q.length}</p>
          <h3 className="qt">{Q[i][0]}</h3>
          {Q[i][1].map((o, j) => (
            <button key={j} onClick={() => choose(j)} className={"opt" + (pick !== null ? (j === Q[i][2] ? " ok" : j === pick ? " no" : "") : "")}>{o}</button>
          ))}
          {pick !== null && <button className="btn" onClick={next}>{i + 1 === Q.length ? "See score" : "Next →"}</button>}
        </div>
      )}
    </section>
  );
}

export default function App() {
  const [dark, setDark] = useState(window.matchMedia?.("(prefers-color-scheme: dark)").matches);
  const [active, setActive] = useState("home");
  const [prog, setProg] = useState(0);
  const [q, setQ] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      setProg((h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100);
    };
    window.addEventListener("scroll", onScroll);
    const spy = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    const rev = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.08 }
    );
    NAV.forEach(([id]) => { const el = document.getElementById(id); el && spy.observe(el); });
    document.querySelectorAll(".reveal").forEach((el) => rev.observe(el));
    return () => { window.removeEventListener("scroll", onScroll); spy.disconnect(); rev.disconnect(); };
  }, []);

  useEffect(() => {
    document.querySelector(".nav a.on")?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [active]);

  const gl = G.filter((g) => (g[0] + g[1]).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="app">
      <div className="progress" style={{ width: prog + "%" }} />
      <nav className="nav">
        <div className="nav-in">
          {NAV.map(([id, l]) => <a key={id} href={"#" + id} className={active === id ? "on" : ""}>{l}</a>)}
        </div>
        <button className="theme" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? "☀️" : "🌙"}</button>
      </nav>

      <header id="home" className="hero">
        <div className="blob b1" /><div className="blob b2" />
        <div className="hero-in">
          <span className="pill">STUDENT NOTES · MACHINE LEARNING</span>
          <h1>Machine Learning <span>Made Simple</span></h1>
          <p>A beginner’s guide to eight core techniques, with definitions, worked examples, Python code and a revision quiz.</p>
          <div className="meta">
            <span>👤 Ashok Raja Pillai</span><span>🎓 B.Sc. Data Science</span><span>📊 Level: Beginner</span>
          </div>
          <div className="stats">
            <div><b>8</b><small>Techniques</small></div>
            <div><b>8</b><small>Worked examples</small></div>
            <div><b>5</b><small>Quiz questions</small></div>
          </div>
        </div>
      </header>

      <main>
        <section className="card reveal" style={{ "--a": "#6366f1" }}>
          <div className="tag">INTRODUCTION</div>
          <h2>What is Machine Learning?</h2>
          <p>Machine Learning (ML) is a branch of Artificial Intelligence in which a computer learns patterns from data and then uses those patterns to make predictions or decisions. Instead of a programmer writing a rule for every situation, the program is shown many examples and works out the rules itself. A spam filter, for instance, is not told every spam word; it is trained on thousands of emails already marked spam or not spam.</p>
          <h3>Three ways of learning</h3>
          <div className="three">
            <div className="mini"><h4>🏷️ Supervised</h4><p>The data has correct answers (labels). Covered here: Linear Regression, Logistic Regression, Decision Trees, KNN.</p></div>
            <div className="mini"><h4>🔍 Unsupervised</h4><p>No labels; the model finds structure on its own. Covered here: K-Means, Hierarchical Clustering, PCA.</p></div>
            <div className="mini"><h4>🛒 Pattern mining</h4><p>Finds items that frequently occur together. Covered here: Association Rule Learning.</p></div>
          </div>
          <h3>The usual workflow</h3>
          <div className="flow">
            {["Collect data", "Prepare data", "Train / test split", "Train model", "Evaluate", "Predict"].map((s, j) => <div key={s}><b>{j + 1}</b>{s}</div>)}
          </div>
          <p>Testing on data the model has never seen is important, because a model can simply memorise its training data (overfitting) and still fail on new cases.</p>
        </section>

        {T.map((o, i) => <Topic key={o.id} o={o} i={i} />)}

        <Quiz />

        <section id="summary" className="card reveal" style={{ "--a": "#10b981" }}>
          <div className="tag">QUICK REVISION</div>
          <h2>All Topics at a Glance</h2>
          <div className="tw">
            <table>
              <thead><tr><th>Technique</th><th>Purpose</th><th>Type</th><th>Typical use</th><th>Main limitation</th></tr></thead>
              <tbody>{ROWS.map((r) => <tr key={r[0]}>{r.map((c, j) => <td key={j}>{j === 0 ? <b>{c}</b> : c}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <h3>Conclusion</h3>
          <p>Choosing a technique starts with the question being asked. If the goal is to predict a number, use regression. To assign a category, use logistic regression, a tree or KNN. To discover groups in unlabelled data, use K-Means or hierarchical clustering. To simplify a dataset with many columns, use PCA, and to find items that go together, use association rules. No single method is best everywhere, so understanding the purpose and limits of each one is the real skill.</p>
        </section>

        <section id="glossary" className="card reveal" style={{ "--a": "#ec4899" }}>
          <div className="tag">REVISION TOOL</div>
          <h2>Glossary</h2>
          <input className="search" placeholder="🔎  Search a term…" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="gl">
            {gl.map((g) => <div key={g[0]} className="gi"><b>{g[0]}</b><p>{g[1]}</p></div>)}
            {!gl.length && <p>No matching term.</p>}
          </div>
        </section>
      </main>

      <footer>Ashok Raja Pillai | 55019 | B.Sc. Data Science | ML Blog Content</footer>
    </div>
  );
}
