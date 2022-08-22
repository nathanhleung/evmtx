
import "./App.css";
import { Link } from "react-router-dom";
import Connection from "./components/Connection"
import SubmitTx from "./components/SubmitTx"
import { TraceProps } from "./components/Trace"
import TraceBoard from "./components/TraceBoard"
import Transaction from "./components/Transaction"

export default function App() {
  return (
    <div className="App">
      <h1>FIP</h1>
      <Link to="/test"> <button style={{float:"right"}}> Add a New Transaction </button> </Link>
      <table>
        <tr>
          <th>Transaction Index</th>
          <th>From</th>
          <th>To</th>
        </tr>
      </table>
    </div>
  )
}
