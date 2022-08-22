import axios from "axios"
import { ethers } from "ethers"
import React, { useState } from "react"

export default function SubmitTx() {
  const [transactionData, setTransactionData] = useState("")
  const [value, setValue] = useState("")
  const [toAddress, setToAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [fromAddress, setFromAddress] = useState(
    "0x0000000000000000000000000000000000000000"
  )
  const [gasPrice, setGasPrice] = useState("")
  const [gasLimit, setGasLimit] = useState("")
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setLoading(true)
    const data = new FormData()
    data.append("to", toAddress)
    data.append("value", value)
    data.append("data", transactionData)
    data.append("from", fromAddress)
    data.append("gasPrice", gasPrice)
    data.append("gasLimit", gasLimit)
    axios.post("/sendTxn", data)
    setTimeout(() => setLoading(false), 1000)
  }
  return (
    <div className="SubmitTx">
      <p>Trace Ethereum transactions with Foundry</p>
      <form onSubmit={handleSubmit}>
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
        <br />
        <span>GasPrice&nbsp;&nbsp;</span>
        <input
          value={gasPrice}
          placeholder="GasPrice (wei)"
          onChange={(e) => setGasPrice(e.target.value)}
          type="number"
          style={{ width: "50%" }}
        />
        <br />
        <span>GasLimit&nbsp;&nbsp;</span>
        <input
          value={gasLimit}
          placeholder="GasLimit (wei)"
          onChange={(e) => setGasLimit(e.target.value)}
          type="number"
          style={{ width: "50%" }}
        />
        <br />
        <span>From Address&nbsp;&nbsp;</span>
        <input
          value={fromAddress}
          placeholder="From Address"
          onChange={(e) => setFromAddress(e.target.value)}
          type="string"
          style={{ width: "50%" }}
        />
        <br />
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
    </div>
  )
}
