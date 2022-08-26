import { Box, Code, Heading, Image, Link, Text } from "@chakra-ui/react";

export default function About() {
  return (
    <Box>
      <Heading size="lg" mb={2}>
        About
      </Heading>
      <Text>
        FIP is a project which allows you to trace Ethereum transactions, using{" "}
        <Link href="https://github.com/foundry-rs/foundry/" color="blue.500">
          Foundry
        </Link>
        's <Code>anvil</Code> as a backend.
      </Text>
      <Heading size="md" mb={2} mt={8}>
        Architecture
      </Heading>
      <Image src="/architecture.png" mt={8} width={["100%", "50%"]} />
    </Box>
  );
}
