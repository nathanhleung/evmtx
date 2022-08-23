import "./App.css"
import { Link } from "react-router-dom"
import TxOverview from "./components/TxOverview"
import { TxOverviewProps } from "./components/TxOverview"

type AppProps = {
  txOverview: TxOverviewProps[]
}

export default function App({ txOverview }: AppProps) {
  const txOverviews = txOverview.map((tx) =>
    <tr>
      <td>
        <div>
          <TxOverview from={tx.from} to={tx.to} txIndex={tx.txIndex} ></TxOverview>
        </div>
      </td>
    </tr>
  ); return (
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
        {txOverviews}
      </table>
    </div>
  )
}
