import { Box, Table, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import { TxOverview } from "../components/";
import { TxOverviewProps } from "../components/TxOverview";

export default function Dashboard() {
  const txOverview: TxOverviewProps[] = [];
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
  ));

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
  );
}
