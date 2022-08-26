import { FaGithub, FaInfoCircle } from "react-icons/fa";
import { Route, Link as RouterLink, Routes } from "react-router-dom";
import { Box, Flex, HStack, Heading, Icon, Link, Text } from "@chakra-ui/react";
import { ConnectionBadge } from "./components";
import { About, Dashboard, NewTransaction, TransactionDetail } from "./pages";

export default function App() {
  return (
    <div className="text-black bg-[#FFFFFF] min-h-screen">
      <Box maxWidth={["100%", "80%"]} margin="0 auto" paddingY={[10, 15, 20]}>
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <Flex alignItems="center">
            <RouterLink to="/">
              <Heading className="text-black">Foundry Web Tracer</Heading>
            </RouterLink>
            <ConnectionBadge marginLeft={4} />
          </Flex>
          <HStack spacing={8}>
            <Link as={RouterLink} to="/about">
              <Icon as={FaInfoCircle} boxSize={8} />
            </Link>
            <Link href="https://github.com/nathanhleung/fip" target="_blank">
              <Icon as={FaGithub} boxSize={8} />
            </Link>
          </HStack>
        </Flex>
        <Text color="gray.500">Trace Ethereum transactions using Foundry</Text>

        <Box paddingY={[10, 15, 20]}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/transactions/new" element={<NewTransaction />} />
            <Route
              path="/transactions/:transactionId"
              element={<TransactionDetail />}
            />
          </Routes>
        </Box>
      </Box>
    </div>
  );
}
