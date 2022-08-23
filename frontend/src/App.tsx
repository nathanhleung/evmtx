import { Link, Route, Routes, useNavigate } from "react-router-dom"
import { Box, Button, Flex, Heading } from "@chakra-ui/react"
import { ConnectionBadge } from "./components"
import { Dashboard, NewTransaction, TransactionDetail } from "./pages"

export default function App() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        backgroundColor: "#0E1B2D"
      }}
    >
      <Box
        maxWidth={["100%", "80%", "60%"]}
        margin="0 auto"
        paddingY={[10, 15, 20]}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Link to="/">
            <Flex alignItems="center">
              <Heading className="text-white">Foundry Web Tracer</Heading>
              <ConnectionBadge marginLeft={4} />
            </Flex>
          </Link>
          <Button
            colorScheme="blue"
            onClick={() => navigate("/transaction/new")}
          >
            Trace New Transaction
          </Button>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Box paddingY={[10, 15, 20]} width="1000px">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transaction/new" element={<NewTransaction />} />
              <Route
                path="/transaction/:transactionId"
                element={<TransactionDetail />}
              />
            </Routes>
          </Box>
        </Flex>
      </Box>
    </div>
  )
}
