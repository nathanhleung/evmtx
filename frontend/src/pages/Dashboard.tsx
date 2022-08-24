import { Link as RouterLink } from "react-router-dom"
import {
  Box,
  Center,
  Heading,
  Link,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react"
import { TxOverview } from "../components/"
import { TxOverviewProps } from "../components/TxOverview"

export default function Dashboard() {
  const txOverview: TxOverviewProps[] = []

  if (txOverview.length === 0) {
    return (
      <Box textAlign="center">
        <Heading size="md" mb={2}>
          No Transactions Yet
        </Heading>
        <Text color="gray.500">View your traced transactions here</Text>
        <Box mt={10}>
          <Link as={RouterLink} color="green.500" to="/transaction/new">
            Trace New Transaction +
          </Link>
        </Box>
      </Box>
    )
  }

  const txOverviews = txOverview.map((tx) => (
    <tr>
      <td>
        <div>
          <TxOverview
            from={tx.from}
            to={tx.to}
            txIndex={tx.txIndex}
          ></TxOverview>
        </div>
      </td>
    </tr>
  ))

  return (
    <Box>
      <Table>
        <Thead>
          <Tr>
            <Th>Transaction ID</Th>
            <Th>From</Th>
            <Th>To</Th>
          </Tr>
        </Thead>
        <Tbody>{txOverviews}</Tbody>
      </Table>
    </Box>
  )
}
