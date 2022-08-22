type TransactionResultProp = {
    exeStatus: boolean;
    from: string;
    to: string;
    gasPrice: number;
    value: number;
    transactionFee: number;
    maxPriorityFeePerGas: number;
    maxFeePerGas: number;
    gasUsage: number;
    gasLimit: number;
    inputData: string;

}
export default function Transaction({ exeStatus,
    from, to, gasPrice, value, transactionFee, maxPriorityFeePerGas, maxFeePerGas,
    gasUsage, gasLimit, inputData}: TransactionResultProp) {
    const msg = exeStatus ? "Succeeded" : "Failed";
    return (
        <div className="Transaction" style={{ paddingLeft: 20 }} >
            <p> status: {msg} </p>
            <p> From : {from} </p>
            <p> To : {to} </p>
            <p> Value : {value} </p>
            <p> Transacton Fee : {transactionFee} </p>
            <p> Gas Price : {gasPrice} </p>
            <p> Max Fee Per Gas : {maxFeePerGas} </p>
            <p> Max Priority Fee Per Gas : {maxPriorityFeePerGas} </p>
            <p> Gas Usage : {gasUsage} </p>
            <p> Gas Limit : {gasLimit} </p>
            <p> Input Data : {inputData} </p>
        </div>
    )
}