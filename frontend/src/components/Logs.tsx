import { Badge } from "@chakra-ui/react"

export type LogResultProp = {
  exeStatus: boolean
  from: string
  to: string
  inputData: any
}

export default function Logs({
  exeStatus,
  from,
  to,
  inputData
}: LogResultProp) {
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
      <p className="py-2">Show Event logs </p>
    </div>
  )
}
