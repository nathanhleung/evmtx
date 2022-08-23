
import "./App.css";
import { Link } from "react-router-dom";
import Connection from './components/Connection'

export default function App() {
  return (
    <div className="App">
      <h1>FIP</h1>
      <Link to="/submitTx"> <button style={{float:"right"}}> Add a New Transaction </button> </Link>
      <table>
        <tr>
          <th>Transaction Index</th>
          <th>From</th>
          <th>To</th>
        </tr>
      </table>
      <Connection />
    </div>
  )
}
