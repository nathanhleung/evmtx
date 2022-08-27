import axios from "axios";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Code,
  HStack,
  Heading,
  Link,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Trace } from "../components/";
import { SERVER_URL } from "../config";
import { Trace as TraceType } from "../types";

const EXAMPLE_TRACE: TraceType = {
  from: "0x4a8631e84dd2e5e31100bf4502fea598626906ee",
  to: "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",
  status: false,
  functionName: "multicall",
  functionArgs: [
    "1651826015",
    "[b'\\x04\\xe4Z\\xaf\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\xb4\\xfb\\xf2q\\x14?O\\xbf{\\x91\\xa5\\xde\\xd3\\x18\\x05\\xe4+\"\\x08\\xd6\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x92%\\xae\\xe0R: ,\\t\\xa7m\\x98\\x7f\\x9dW\\xc4:\\xfd\\x12\\xb7\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x0b\\xb8\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\xe4gW\\xa6\\xb1$\\xd3Q\\xc8,\\xd8\\x87;B\\xed\\xa5\\xef\\xad\\x16\\xbe\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x01cEx]\\x8a\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00#\\xdb\\xa3jX\\xb5\\x8d\\xf9\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00']",
  ],
  calldata:
    "0x5ae401dc000000000000000000000000000000000000000000000000000000006274dd5f00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e404e45aaf000000000000000000000000b4fbf271143f4fbf7b91a5ded31805e42b2208d60000000000000000000000009225aee0523a202c09a76d987f9d57c43afd12b70000000000000000000000000000000000000000000000000000000000000bb8000000000000000000000000e46757a6b124d351c82cd8873b42eda5efad16be000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000023dba36a58b58df9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  subcalls: [
    {
      from: "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",
      to: "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",
      status: false,
      functionName: "exactInputSingle",
      functionArgs: [
        "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
        "0x9225AeE0523A202c09A76D987F9D57C43Afd12B7",
        "3000",
        "0xe46757a6B124d351c82Cd8873B42eda5EFAd16Be",
        "100000000000000000",
        "2583838488377265657",
        "0",
      ],
      calldata:
        "0x04e45aaf000000000000000000000000b4fbf271143f4fbf7b91a5ded31805e42b2208d60000000000000000000000009225aee0523a202c09a76d987f9d57c43afd12b70000000000000000000000000000000000000000000000000000000000000bb8000000000000000000000000e46757a6b124d351c82cd8873b42eda5efad16be000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000023dba36a58b58df90000000000000000000000000000000000000000000000000000000000000000",
    },
  ],
};

export default function TransactionDetail() {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [viewRaw, setViewRaw] = useState(false);
  const [trace, setTrace] = useState<TraceType>();
  const [error, setError] = useState<string>();

  async function getTrace(transactionId: string) {
    try {
      const response = await axios.get(
        SERVER_URL + "/transactions/" + transactionId
      );
      setTrace(JSON.parse(response.data.results));
    } catch (e) {
      console.error(e);
      setError((e as any).toString());
    }
  }

  useEffect(() => {
    if (transactionId) {
      if (transactionId !== "example") {
        getTrace(transactionId);
      } else {
        setTrace(EXAMPLE_TRACE);
      }
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
          <Text color="gray.600" mt={2}>
            Getting transaction trace...
          </Text>
        </Box>
      </Center>
    );
  }

  return (
    <div>
      <Box mb={8}>
        {transactionId === "example" && (
          <Text mb={8} color="gray.600">
            This example transaction trace shows the calls that are involved in
            a Uniswap swap.{" "}
            <Link to="/transactions/new" as={RouterLink} color="blue.500">
              Trace Your Own +
            </Link>
          </Text>
        )}
        <Trace trace={trace} showTableHeaders />
      </Box>
      <HStack>
        <Button onClick={() => setViewRaw(!viewRaw)} colorScheme="blue">
          {viewRaw ? "Hide Raw Trace" : "View Raw Trace"}
        </Button>
        {viewRaw && (
          <Button
            colorScheme="gray"
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(trace, null, 2));
              toast({
                title: "Copied!",
                description: "Raw trace copied to clipboard",
                status: "success",
                isClosable: true,
              });
            }}
          >
            Copy Raw Trace
          </Button>
        )}
      </HStack>
      {viewRaw && (
        <Code display="block" whiteSpace="pre" overflowX="scroll" mt={4} p={4}>
          {JSON.stringify(trace, null, 2)}
        </Code>
      )}
    </div>
  );
}
