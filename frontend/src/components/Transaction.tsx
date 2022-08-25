import { Badge } from "@chakra-ui/react"

export type TransactionResultProp = {
  exeStatus: boolean
  from: string
  to: string
  gasPrice: string
  value: string
  transactionFee: number
  maxPriorityFeePerGas: number
  maxFeePerGas: number
  gasUsage: number
  gasLimit: number
  inputData: string
}
export default function Transaction({
  exeStatus,
  from,
  to,
  gasPrice,
  value,
  transactionFee,
  maxPriorityFeePerGas,
  maxFeePerGas,
  gasUsage,
  gasLimit,
  inputData
}: TransactionResultProp) {
  const status = exeStatus ? (
    <Badge colorScheme="green">Success</Badge>
  ) : (
    <Badge colorScheme="red">Failed</Badge>
  )
  return (
    <div
      className="Transaction bg-zinc-200 text-black font-semibold py-2 rounded-lg"
      style={{ paddingLeft: 20 }}
    >
      <p className="py-2"> Status: {status} </p>
      <p className="py-2"> From : {from} </p>
      <p className="py-2"> To : {to} </p>
      <p className="py-2"> Value : {value} </p>
      <p className="py-2"> Transacton Fee : {transactionFee} </p>
      <p className="py-2"> Gas Price : {gasPrice} </p>
      <p className="py-2"> Max Fee Per Gas : {maxFeePerGas} </p>
      <p className="py-2">
        {" "}
        Max Priority Fee Per Gas : {maxPriorityFeePerGas}{" "}
      </p>
      <p className="font-bold py-2"> Gas Usage : {gasUsage} </p>
      <p className="font-bold py-2"> Gas Limit : {gasLimit} </p>
      <p className="font-bold py-2"> Input Data : {inputData} </p>
    </div>
  )
}
