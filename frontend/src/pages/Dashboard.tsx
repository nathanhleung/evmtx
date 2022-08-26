import axios from "axios";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  HStack,
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

  let content;
  if (transactions.length === 0) {
    content = (
      <Box textAlign="center">
        <Heading size="md" mb={2}>
          No Transactions Yet
        </Heading>
        <Text color="gray.500">
          After creating a trace, view your traced transactions here
        </Text>
        <Box mt={10}>
          <Link as={RouterLink} color="gray.500" to="/transactions/new">
            Trace New Transaction +
          </Link>
        </Box>
      </Box>
    );
  } else {
    const transactionComponents = transactions.map((tx, i) => (
      <Tr onClick={() => navigate(`/transactions/${i}`)} cursor="pointer">
        <Td>{i}</Td>
        <Td>{tx.from}</Td>
        <Td>{tx.to}</Td>
      </Tr>
    ));

    content = (
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
          <Link as={RouterLink} color="gray.500" to="/transactions/new">
            Trace New Transaction +
          </Link>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Center flexDirection="column">
        <Heading size="lg">Debug Ethereum Transactions in Your Browser</Heading>
        <Text color="gray.500" mt={2}>
          Input arbitrary transaction parameters and get a trace back
        </Text>
        <HStack mt={8}>
          <Button onClick={() => navigate("/transactions/example")}>
            View an Example
          </Button>
          <Button
            colorScheme="green"
            onClick={() => navigate("/transactions/new")}
          >
            Try Now
          </Button>
        </HStack>
      </Center>
      <Box mt={24} borderRadius="lg" backgroundColor="gray.100" padding={16}>
        <Heading size="lg" textAlign="center" mb={12}>
          All Traced Transactions
        </Heading>
        {content}
      </Box>
    </Box>
  );
}
