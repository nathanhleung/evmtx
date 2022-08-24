import axios from "axios";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Link,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

type Transaction = {
  data: string;
  from: string;
  gasPrice: string;
  to: string;
  value: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  async function getTransactions() {
    const response = await axios.get(
      process.env.REACT_APP_SERVER_URL + "/transactions"
    );
    const transactions = Object.values(response.data);
    setTransactions(transactions as Transaction[]);
  }

  useEffect(() => {
    getTransactions();
  }, []);

  if (transactions.length === 0) {
    return (
      <Box textAlign="center">
        <Heading size="md" mb={2}>
          No Transactions Yet
        </Heading>
        <Text color="gray.500">View your traced transactions here</Text>
        <Box mt={10}>
          <Link as={RouterLink} color="green.500" to="/transactions/new">
            Trace New Transaction +
          </Link>
        </Box>
      </Box>
    );
  }

  const transactionComponents = transactions.map((tx, i) => (
    <Tr onClick={() => navigate(`/transactions/${i}`)} cursor="pointer">
      <Td>{i}</Td>
      <Td>{tx.from}</Td>
      <Td>{tx.to}</Td>
    </Tr>
  ));

  return (
    <Box>
      <Table>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>From</Th>
            <Th>To</Th>
          </Tr>
        </Thead>
        <Tbody>{transactionComponents}</Tbody>
      </Table>
      <Box mt={10} textAlign="center">
        <Link as={RouterLink} color="green.500" to="/transactions/new">
          Trace New Transaction +
        </Link>
      </Box>
    </Box>
  );
}
