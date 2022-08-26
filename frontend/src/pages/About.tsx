import {
  Box,
  Code,
  Heading,
  Image,
  Link,
  ListItem,
  OrderedList,
  Text,
  VStack,
} from "@chakra-ui/react";

export default function About() {
  return (
    <VStack spacing={12} alignItems="flex-start">
      <Box>
        <Heading size="lg" mb={2}>
          About
        </Heading>
        <Text>
          FIP is a project which allows you to trace Ethereum transactions,
          using{" "}
          <Link href="https://github.com/foundry-rs/foundry/" color="blue.500">
            Foundry
          </Link>
          's <Code>anvil</Code> as a backend.
        </Text>
      </Box>
      <Box>
        <Heading size="lg" mb={2}>
          Contact
        </Heading>
        <Text>
          Contact us to get set up on an Enterprise plan and get access to an
          isolated instance.
        </Text>
      </Box>
      <Box>
        <Heading size="lg" mb={2}>
          Architecture
        </Heading>
        <Text mb={2}>
          We use{" "}
          <Link
            color="blue.500"
            href="https://github.com/foundry-rs/foundry/tree/master/anvil"
          >
            Anvil
          </Link>{" "}
          to maintain a local fork of the blockchain on our server (connection
          status reflected in the "Forked Web3" connection status). Anvil does
          not support <Code>debug_traceCall</Code> (the nonstandard RPC method
          we rely on to get traces), so we also run a full node which has that
          RPC method enabled (connection status reflected in the "Full Web3
          Connection Status"). When you send a transaction to our backend:
        </Text>
        <OrderedList>
          <ListItem>
            First, we forward it to our full hosted node in a{" "}
            <Code>debug_traceCall</Code> RPC call. This method returns a trace
            which we display on the frontend. However, this does not actually
            execute the transaction on-chain.
          </ListItem>
          <ListItem>
            Second, we call Anvil's <Code>eth_sendUnsignedTransaction</Code>{" "}
            with the same transaction data, so our blockchain fork reflects the
            state of the blockchain as if the transaction was actually executed.
          </ListItem>
          <ListItem>
            For subsequent transactions, we first dump our modified blockchain
            state (from previously traced transactions) from our Anvil fork and
            send that modified state to the full hosted node as a{" "}
            <Link
              color="blue.500"
              href="https://geth.ethereum.org/docs/rpc/ns-eth#3-object---state-override-set"
            >
              state override set
            </Link>
            . Then, we call <Code>debug_traceCall</Code>. This allows users to
            get traces of subsequent transactions as if their previous
            transactions had actually run. This is not currently possible with{" "}
            <Code>forge test</Code>, since those tests are stateless.
          </ListItem>
        </OrderedList>
        <Heading size="md" mb={2} mt={4}>
          Function Signatures
        </Heading>
        <Text mb={2}>
          Since we only have raw calldata, we determine function signatures by
          querying an API,{" "}
          <Link href="https://www.4byte.directory/" color="blue.500">
            4byte.directory
          </Link>
          , which indexes function selectors and can return the corresponding
          function signature. In the case of collisions, we choose the first
          signautre seen (so function signatures are not necessarily completely
          accurate).
        </Text>
        <Heading size="md" mb={2} mt={4}>
          Diagram
        </Heading>
        <Text mb={2}>Created in FigJam.</Text>
        <Image src="/architecture.png" mt={8} width={["100%", "50%"]} />
      </Box>
    </VStack>
  );
}
