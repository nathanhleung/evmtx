import "./App.css";

import { useState } from "react";
import { TraceProps } from "./components/Trace";
import TraceBoard from "./components/TraceBoard";
import Transaction from "./components/Transaction";

const traces: TraceProps[] = [
  {
    from: "haowang.eth",
    to: "nathan.eth",
    identation: 1,
  },
  { from: "nathan.eth", to: "haowang.eth", identation: 2 },
  { from: "nathan.eth", to: "haowang.eth", identation: 1 },
];

export default function App() {
  const [transactionData, setTransactionData] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="App">
      <h1>FIP</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setTimeout(() => setLoading(false), 1000);
        }}
      >
        <p>Trace Ethereum transactions with Foundry</p>
        <textarea
          placeholder="Transaction hex data"
          value={transactionData}
          onChange={(e) => setTransactionData(e.target.value)}
          style={{ width: "100%", fontSize: "1.5rem" }}
          rows={10}
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Tracing..." : "Trace"}
        </button>
      </form>
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
      </div>
    </div>
  );
}
