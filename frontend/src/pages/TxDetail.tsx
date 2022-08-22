import Transaction from "../components/Transaction"
import TraceBoard from "../components/TraceBoard"
import {TransactionResultProp} from "../components/Transaction"
import {TraceProps} from "../components/Trace"
type TxDetailProps =  {
  txnResult : TransactionResultProp;
  traces: TraceProps[]
}

export default function TxDetail( {txnResult, traces}: TxDetailProps){
  return (
    <div>
      <TraceBoard traces={traces} />
      <Transaction
        exeStatus={txnResult.exeStatus}
        from={txnResult.from}
        to={txnResult.to}
        gasPrice={txnResult.gasPrice}
        value={txnResult.value}
        transactionFee={txnResult.gasPrice * txnResult.gasUsage}
        maxPriorityFeePerGas={txnResult.maxPriorityFeePerGas}
        maxFeePerGas={txnResult.maxFeePerGas}
        gasUsage={txnResult.gasUsage}
        gasLimit={txnResult.gasLimit}
        inputData={txnResult.inputData}
      />
    </div>
  )
}
