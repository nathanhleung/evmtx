import "./App.css"
import SubmitTx from "./components/SubmitTx"
import { TraceProps } from "./components/Trace"
import TraceBoard from "./components/TraceBoard"
import Transaction from "./components/Transaction"

const traces: TraceProps[] = [
  {
    from: "haowang.eth",
    to: "nathan.eth",
    identation: 1
  },
  { from: "nathan.eth", to: "haowang.eth", identation: 2 },
  { from: "nathan.eth", to: "haowang.eth", identation: 1 }
]

export default function App() {
  return (
    <div className="App">
      <h1>FIP</h1>
      <SubmitTx />
      <h2>Trace Data</h2>
      <Transaction
        from="haowang.eth"
        to="nathan.eth"
        gasPrice={10}
        value={1e7}
        transactionFee={1e10}
        maxFeePerGas={1}
        maxPriorityFeePerGas={0}
        gasLimit={1e7}
        gasUsage={1e6}
        inputData="0x"
        exeStatus={true}
      ></Transaction>
      <div>
        <h3> Traces </h3>
        <TraceBoard traces={traces}></TraceBoard>
        <TraceBoard traces={traces}></TraceBoard>
      </div>
    </div>
  )
}
