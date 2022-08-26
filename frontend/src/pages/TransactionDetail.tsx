import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Code,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Trace } from "../components/";
import { Trace as TraceType } from "../types";

export default function TransactionDetail() {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [viewRaw, setViewRaw] = useState(false);
  const [trace, setTrace] = useState<TraceType>();
  const [error, setError] = useState<string>();

  async function getTrace(transactionId: string) {
    try {
      const response = await axios.get(
        process.env.REACT_APP_SERVER_URL + "/transactions/" + transactionId
      );
      setTrace(JSON.parse(response.data.results));
    } catch (e) {
      console.error(e);
      setError((e as any).toString());
    }
  }

  useEffect(() => {
    if (transactionId) {
      getTrace(transactionId);
    }
  }, [transactionId]);

  if (error) {
    return (
      <Center>
        <Box textAlign="center">
          <Heading fontSize="lg" mt={6}>
            Error
          </Heading>
          <Text color="red.500" mt={2}>
            {error}
          </Text>
          <Button colorScheme="blue" mt={8} onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </Box>
      </Center>
    );
  }

  if (!trace) {
    return (
      <Center>
        <Box textAlign="center">
          <Spinner />
          <Heading fontSize="lg" mt={6}>
            Tracing...
          </Heading>
          <Text color="gray.500" mt={2}>
            Getting transaction trace...
          </Text>
        </Box>
      </Center>
    );
  }

  return (
    <div>
      <Box mb={8}>
        <Trace trace={trace} showTableHeaders />
      </Box>
      <Button onClick={() => setViewRaw(!viewRaw)} colorScheme="blue">
        {viewRaw ? "Hide Raw Trace" : "View Raw Trace"}
      </Button>
      {viewRaw && (
        <Code display="block" whiteSpace="pre" overflowX="scroll" mt={4} p={4}>
          {JSON.stringify(trace, null, 2)}
        </Code>
      )}
    </div>
  );
}
