import { FaGithub, FaHome, FaInfoCircle, FaPlusCircle } from "react-icons/fa";
import { Route, Link as RouterLink, Routes } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  Icon,
  Image,
  Link,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { ConnectionBadge } from "./components";
import { About, Dashboard, NewTransaction, TransactionDetail } from "./pages";

export default function App() {
  return (
    <div className="text-black bg-[#FFFFFF] min-h-screen">
      <Box width="100%" height={4} background="blue.500" />
      <Box maxWidth={["100%", "80%"]} margin="0 auto" paddingY={[10, 15, 20]}>
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
          <Flex alignItems="center">
            <RouterLink to="/">
              <Image src="/icon.png" boxSize="80px" />
            </RouterLink>
          </Flex>
          <HStack spacing={8}>
            <ConnectionBadge />
            <Tooltip label="Home">
              <Link as={RouterLink} to="/" _hover={{ opacity: 0.5 }}>
                <Icon as={FaHome} boxSize={8} />
              </Link>
            </Tooltip>
            <Tooltip label="New Trace">
              <Link
                as={RouterLink}
                to="/transactions/new"
                _hover={{ opacity: 0.5 }}
              >
                <Icon as={FaPlusCircle} boxSize={8} />
              </Link>
            </Tooltip>
            <Tooltip label="About">
              <Link as={RouterLink} to="/about" _hover={{ opacity: 0.5 }}>
                <Icon as={FaInfoCircle} boxSize={8} />
              </Link>
            </Tooltip>
            <Tooltip label="GitHub">
              <Link
                href="https://github.com/nathanhleung/evmtx"
                target="_blank"
                _hover={{ opacity: 0.5 }}
              >
                <Icon as={FaGithub} boxSize={8} />
              </Link>
            </Tooltip>
          </HStack>
        </Flex>

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
