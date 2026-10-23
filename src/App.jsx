import { useEffect, useState } from "react";
import { T, Q, G } from "./data";
import "./App.css";

const html = (s) => ({ __html: s });
const ROWS = [
  ["NumPy", "Fast maths on arrays", "Python library", "Marks, images, scientific data", "Same data type only"],
  ["Pandas", "Work with tables", "Python library", "Cleaning CSV data", "Heavy on big files"],
  ["Linear Regression", "Predict a number", "Supervised", "Predicting exam marks", "Only straight-line patterns"],
  ["Logistic Regression", "Predict class probability", "Supervised", "Email spam filter", "Simple decision boundary"],
  ["Decision Tree", "Decide using questions", "Supervised", "Loan approval", "Overfits when deep"],
  ["KNN", "Classify by neighbours", "Supervised", "Recommendations", "Slow on big data"],
  ["K-Means", "Group into K clusters", "Unsupervised", "Grouping customers", "K must be chosen"],
  ["Hierarchical", "Nested groups", "Unsupervised", "Grouping species", "Costly on big data"],
  ["PCA", "Reduce features", "Unsupervised", "Visualising data", "Loses some information"],
  ["Association Rules", "Items bought together", "Pattern mining", "Market basket", "Too many rules"],
];

function useRoute() {
  const get = () => window.location.hash.replace(/^#\/?/, "") || "home";
  const [route, setRoute] = useState(get);
  useEffect(() => {
    const on = () => { setRoute(get()); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}

function Home() {
  return (
    <>
      <h1>My ML Notebook</h1>
      <p className="lead">Notes on 10 machine learning topics, each with a definition, a worked example and Python code. Pick a topic to open it.</p>
      <ol className="list">
        {T.map((o) => (
          <li key={o.id}><a href={"#/" + o.id}>{o.n}</a></li>
        ))}
      </ol>
      <p className="more"><a href="#/quiz">Take the quiz</a> · <a href="#/summary">Summary table</a> · <a href="#/glossary">Glossary</a></p>
    </>
  );
}

function Topic({ id }) {
  const i = T.findIndex((o) => o.id === id);
  const o = T[i];
  const [copied, setCopied] = useState(false);
  if (!o) return <p>Topic not found. <a href="#/home">Back to all topics</a></p>;
  const copy = () => {
    navigator.clipboard?.writeText(o.c);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const prev = T[i - 1], next = T[i + 1];
  return (
    <>
      <h1>{o.n}</h1>
      <p dangerouslySetInnerHTML={html(o.d)} />
      <div className="formula" dangerouslySetInnerHTML={html(o.f)} />

      <h2>Key terms</h2>
      <ul>{o.k.map((x, j) => <li key={j} dangerouslySetInnerHTML={html(x)} />)}</ul>

      <h2>How it works</h2>
      <ol>{o.s.map((x, j) => <li key={j}>{x}</li>)}</ol>

      <h2>Worked example</h2>
      <p dangerouslySetInnerHTML={html(o.e)} />

      <h2>Python code</h2>
      <div className="code">
        <button onClick={copy}>{copied ? "Copied" : "Copy"}</button>
        <pre>{o.c}</pre>
      </div>

      <h2>Uses, advantages and limits</h2>
      <p><b>Uses:</b> {o.a}</p>
      <p><b>Advantages:</b> {o.v}</p>
      <p><b>Limits:</b> {o.l}</p>

      <p className="summary"><b>In short:</b> {o.y}</p>

      <div className="pager">
        {prev ? <a href={"#/" + prev.id}>Previous: {prev.n}</a> : <span />}
        {next ? <a href={"#/" + next.id}>Next: {next.n}</a> : <span />}
      </div>
    </>
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
  const reset = () => { setI(0); setPick(null); setScore(0); };
  return (
    <>
      <h1>Quiz</h1>
      {done ? (
        <>
          <p className="lead">You scored {score} out of {Q.length}.</p>
          <button className="btn" onClick={reset}>Try again</button>
        </>
      ) : (
        <>
          <p className="muted">Question {i + 1} of {Q.length}</p>
          <h2>{Q[i][0]}</h2>
          {Q[i][1].map((o, j) => (
            <button key={j} onClick={() => choose(j)}
              className={"opt" + (pick !== null ? (j === Q[i][2] ? " ok" : j === pick ? " no" : "") : "")}>{o}</button>
          ))}
          {pick !== null && (
            <button className="btn" onClick={() => { setI(i + 1); setPick(null); }}>
              {i + 1 === Q.length ? "See score" : "Next question"}
            </button>
          )}
        </>
      )}
    </>
  );
}

function Summary() {
  return (
    <>
      <h1>Summary table</h1>
      <div className="tw">
        <table>
          <thead><tr><th>Topic</th><th>Purpose</th><th>Type</th><th>Typical use</th><th>Main limit</th></tr></thead>
          <tbody>{ROWS.map((r) => <tr key={r[0]}>{r.map((c, j) => <td key={j}>{j === 0 ? <b>{c}</b> : c}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <p>Start with the question you are asking. To predict a number, use regression. To assign a category, use logistic regression, a tree or KNN. To find groups in unlabelled data, use K-Means or hierarchical clustering. To reduce many columns, use PCA, and to find items that go together, use association rules. NumPy and Pandas are the tools used to prepare and handle the data for all of these.</p>
    </>
  );
}

function Glossary() {
  const [q, setQ] = useState("");
  const gl = G.filter((g) => (g[0] + g[1]).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <h1>Glossary</h1>
      <input className="search" placeholder="Search a term" value={q} onChange={(e) => setQ(e.target.value)} />
      {gl.map((g) => <p key={g[0]}><b>{g[0]}:</b> {g[1]}</p>)}
      {!gl.length && <p>No matching term.</p>}
    </>
  );
}

export default function App() {
  const route = useRoute();
  const page =
    route === "home" ? <Home /> :
    route === "quiz" ? <Quiz /> :
    route === "summary" ? <Summary /> :
    route === "glossary" ? <Glossary /> :
    <Topic id={route} />;
  return (
    <div className="wrap">
      {route !== "home" && <a className="back" href="#/home">All topics</a>}
      <main>{page}</main>
      <footer>Ashok Raja Pillai | 55019 | B.Sc. Data Science</footer>
    </div>
  );
}
