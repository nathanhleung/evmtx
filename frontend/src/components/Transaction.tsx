type TransactionProp = {
    exeStatus: boolean;
    from: string;
    to:string;
    gasPrice: number;
    value: number;
    transactionFee: number;
    maxPriorityFeePerGas: number;
    maxFeePerGas: number;
    gasUsage: number;
    gasLimit: number;
    inputData: string;

}
export default function Transaction(props: TransactionProp) {
    const msg = props.exeStatus ? "Succeeded" : "Failed";
    return (
      <div className="Transaction" style={{paddingLeft: 20}} >
        <p> status: {msg} </p>
        <p> From : {props.from} </p>
        <p> To : {props.to} </p>
        <p> Value : {props.value} </p>
        <p> Transacton Fee : {props.transactionFee} </p>
        <p> Gas Price : {props.gasPrice} </p>
        <p> Max Fee Per Gas : {props.maxFeePerGas} </p>
        <p> Max Priority Fee Per Gas : {props.maxPriorityFeePerGas} </p>
        <p> Gas Usage : {props.gasUsage} </p>
        <p> Gas Limit : {props.gasLimit} </p>
        <p> Input Data : {props.inputData} </p>
      </div>
    )
  }