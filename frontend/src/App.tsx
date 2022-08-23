import "./App.css"
import { Link } from "react-router-dom"
import TxOverview from "./components/TxOverview"
import { TxOverviewProps } from "./components/TxOverview"

type AppProps = {
  txOverview: TxOverviewProps
}

export default function App({ txOverview }: AppProps) {
  return (
    <div className="App">
      <h1>FIP</h1>
      <Link to="/submitTx">
        {" "}
        <button style={{ float: "right" }}> Add a New Transaction </button>{" "}
      </Link>
      <table>
        <tr>
          <td>
            <th>Transaction Index</th>
            <th>From</th>
            <th>To</th>
            <br></br>
          </td>
        </tr>
        <tr>
          <td>
            <div>
              <TxOverview
                from={txOverview.from}
                to={txOverview.to}
                txIndex={txOverview.txIndex}
              />
            </div>
          </td>
        </tr>
      </table>
    </div>
  )
}
