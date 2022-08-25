import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Box } from "@chakra-ui/react"
import { Transaction } from "../components/"
import { TransactionResultProp } from "../components/Transaction"

type Trace = {
  from: string
  to: string
  username: string
  identation: number
}

type Txn = {
  data: string
  gasPrice: string
  value: string
}

export default function TransactionDetail() {
  const { transactionId } = useParams()
  const [traces, setTraces] = useState<Trace[]>([] as Trace[])
  const [txn, setTxn] = useState<Txn>({} as Txn)

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/transactions/" + transactionId)
      .then((response) => {
        console.log(response.data)
        setTraces(response.data.traces)
        setTxn(response.data.transactionData)
        console.log(traces)
        // use txn data stuff
      })
  }, [transactionId])
  const txnResults: TransactionResultProp[] = traces.map(
    (trace) =>
      ({
        exeStatus: true,
        from: trace.from,
        to: trace.to,
        gasPrice: txn.gasPrice,
        value: txn.value,
        maxPriorityFeePerGas: 0,
        maxFeePerGas: 0,
        gasLimit: 0,
        gasUsage: 0,
        inputData: txn.data,
        transactionFee: 0
      } as TransactionResultProp)
  )

  return (
    <div>
      {txnResults.map((result) => (
        <Transaction
          exeStatus={result.exeStatus}
          from={result.from}
          to={result.to}
          gasPrice={result.gasPrice}
          value={result.value}
          transactionFee={parseInt(result.gasPrice, 16) * result.gasUsage}
          maxPriorityFeePerGas={result.maxPriorityFeePerGas}
          maxFeePerGas={result.maxFeePerGas}
          gasUsage={result.gasUsage}
          gasLimit={result.gasLimit}
          inputData={result.inputData}
        />
      ))}
    </div>
  )
}
