import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import SubmitTx from "./pages/SubmitTx"
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App txOverview={[]} />}>
          {" "}
        </Route>
        <Route path="/submitTx" element={<SubmitTx />}>
          {" "}
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
)
