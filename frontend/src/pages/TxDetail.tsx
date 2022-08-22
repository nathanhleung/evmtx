import SubmitTx from "../components/SubmitTx"
import Transaction from "../components/Transaction"
import TraceBoard from "../components/TraceBoard"

const TxDetail = () => {
  return (
    <div>
      <TraceBoard traces={} />
      <Transaction
        exeStatus={}
        from={}
        to={}
        gasPrice={}
        value={}
        transactionFee={}
        maxPriorityFeePerGas={}
        maxFeePerGas={}
        gasUsage={}
        gasLimit={}
        inputData={}
      />
    </div>
  )
}
