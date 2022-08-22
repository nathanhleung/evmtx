import "./App.css";

import axios from "axios";
import { ethers } from "ethers";
import React, { useState } from "react";
import SubmitTx from "./components/SubmitTx";
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
  const [value, setValue] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("to", toAddress);
    data.append("value", value);
    data.append("data", transactionData);
    axios.post("/sendTxn", data);

    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="App">
      <h1>FIP</h1>
      <form onSubmit={handleSubmit}>
        <p>Trace Ethereum transactions with Foundry</p>
        <br />
        <span>To Address&nbsp;&nbsp;</span>
        <input
          value={toAddress}
          placeholder="To address"
          onChange={(e) => setToAddress(e.target.value)}
        />
        <br />
        <span>Value&nbsp;&nbsp;</span>
        <input
          value={value}
          placeholder="Value (wei)"
          onChange={(e) => setValue(e.target.value)}
          type="number"
          style={{ width: "50%" }}
        />
        <button
          type="button"
          onClick={() => setValue(ethers.utils.parseEther(value).toString())}
        >
          To wei
        </button>
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
        <TraceBoard traces={traces}></TraceBoard>
        <SubmitTx />
      </div>
    </div>
  );
}
