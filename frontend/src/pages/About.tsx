import {
  Box,
  Code,
  Heading,
  Image,
  Link,
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
          to maintain a local fork of the blockchain on our server (reflected in
          the "Forked Web3" connection status). When you send a transaction to
          our backend, we forward it to Anvil, which computes state changes on
          as a result of the transaction our fork. Then, with the state changes
          reflected in a{" "}
          <Link
            color="blue.500"
            href="https://geth.ethereum.org/docs/rpc/ns-eth#3-object---state-override-set"
          >
            state override set
          </Link>
          , we call <Code>debug_traceCall</Code> on our full hosted node
          (reflected in the "Full Web3 Connection Status") to get full traces.
        </Text>
        <Image src="/architecture.png" mt={8} width={["100%", "50%"]} />
      </Box>
    </VStack>
  );
}
