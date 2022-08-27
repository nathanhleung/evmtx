import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { ContractTransactionBuilder } from "../components";
import Compile  from "../components/Compile";
import { SERVER_URL } from "../config";

export default function NewTransaction() {
  const [transactionHash, setTransactionHash] = useState("");
  const [importing, setImporting] = useState(false);
  const [importTransactionError, setImportTransactionError] = useState("");

  const [transactionData, setTransactionData] = useState("0x");
  const [value, setValue] = useState("");
  const [toAddress, setToAddress] = useState(
    "0x0000000000000000000000000000000000000000"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fromAddress, setFromAddress] = useState(
    "0x0000000000000000000000000000000000000000"
  );
  const [gasPrice, setGasPrice] = useState("");
  const [gasLimit, setGasLimit] = useState("");
  const navigate = useNavigate();

  async function getGasPrice() {
    const response = await axios.get(SERVER_URL + "/gas-price");
    setGasPrice(response.data.gasPrice);
  }

  useEffect(() => {
    getGasPrice();
  }, []);

  const importTransaction = async (optionalTransactionHash?: string) => {
    try {
      setImporting(true);
      setImportTransactionError("");

      const result = await axios.get(
        SERVER_URL +
          "/raw-transactions/" +
          (optionalTransactionHash ?? transactionHash)
      );
      const data = result.data;
      setTransactionData(data.input);
      setValue(data.value);
      setToAddress(data.to);
      setFromAddress(data.from);
      setGasPrice((parseInt(data.gasPrice, 10) / 10e9).toString());
      setGasLimit(data.gas);
    } catch (e) {
      console.log((e as any)?.response.data);
      if ((e as any)?.response.status === 404) {
        setImportTransactionError(
          "Couldn't find that transaction. Try another?"
        );
      } else {
        setImportTransactionError((e as any)?.response?.data);
      }
    } finally {
      setImporting(false);
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = new FormData();
    data.append("to", toAddress);
    data.append("value", value);
    data.append("data", transactionData);
    data.append("from", fromAddress);
    data.append("gasPrice", gasPrice);
    data.append("gasLimit", gasLimit);
    try {
      const result = await axios.post(SERVER_URL + "/transactions/new", data);
      console.log(result.data);
      console.log(JSON.stringify(result.data));
      navigate(`/transactions/${result.data.txIndex}`);
    } catch (e) {
      console.error(e);
      setError((e as any)?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="Transaction" borderRadius="lg" p={16} background="gray.100">
      <form onSubmit={handleSubmit}>
        <VStack align="left" spacing={12}>
          <Box>
            <Heading size="md" mb={2}>
              Transaction Info
            </Heading>
            <Text color="gray.500">
              Import data from an existing transaction, or manually fill your
              own transaction data.
            </Text>
            <Box mt={8}>
              <FormControl>
                <FormLabel>Transaction Hash</FormLabel>
                <Input
                  type="string"
                  background="white"
                  color="black"
                  placeholder="0x..."
                  value={transactionHash}
                  onChange={(e) => setTransactionHash(e.target.value)}
                />
              </FormControl>
              <HStack alignItems="center" mt={4} spacing={2}>
                <Button
                  colorScheme="blue"
                  disabled={importing}
                  onClick={() => importTransaction()}
                >
                  {importing ? "Importing..." : "Import Transaction"}
                </Button>
                <Button
                  onClick={() => {
                    setTransactionHash(
                      "0x0e31661d655d450143e59aaefe8b253ba5ab228d686a2dd2d214524d46019087"
                    );
                    importTransaction(
                      "0x0e31661d655d450143e59aaefe8b253ba5ab228d686a2dd2d214524d46019087"
                    );
                  }}
                >
                  Try an Example
                </Button>
              </HStack>
              <Text color="red.500" mt={4}>
                {importTransactionError}
              </Text>
            </Box>
          </Box>
          <Box>
            <Heading size="md" mb={2}>
              Raw Transaction Fields
            </Heading>
            <Text color="gray.500">Manually edit transaction data.</Text>
            <HStack spacing={4} mt={4}>
              <FormControl className="py-2">
                <FormLabel>From Address</FormLabel>
                <Input
                  background="white"
                  color="black"
                  value={fromAddress}
                  placeholder="From Address"
                  onChange={(e) => setFromAddress(e.target.value)}
                  type="string"
                />
              </FormControl>
              <FormControl className="py-2">
                <FormLabel>To Address</FormLabel>
                <Input
                  background="white"
                  color="black"
                  value={toAddress}
                  placeholder="To address"
                  onChange={(e) => setToAddress(e.target.value)}
                />
              </FormControl>
            </HStack>
            <FormControl flex={1}>
              <FormLabel>Value</FormLabel>
              <Input
                background="white"
                color="black"
                value={value}
                placeholder="Value (wei)"
                onChange={(e) => setValue(e.target.value)}
                type="number"
              />
            </FormControl>
          </Box>
          <Box>
            <Heading size="md" mb={2}>
              Build Transaction Data
            </Heading>
            <Text color="gray.500">
              Manually input hex data, or construct a transaction from a
              contract address
            </Text>
            <ContractTransactionBuilder
              setTransactionData={setTransactionData}
              mt={4}
              mb={8}
            />
            <Heading size="sm" mb={2}>
              Transaction Hex Data
            </Heading>
            <Text color="gray.500">Manually input, or generate above.</Text>
            <FormControl mt={4}>
              <Textarea
                background="white"
                color="black"
                className="rounded-lg"
                placeholder="Transaction Hex Data"
                value={transactionData}
                onChange={(e) => setTransactionData(e.target.value)}
                style={{ width: "100%" }}
                rows={10}
              />
            </FormControl>
          </Box>
        </VStack>
        <Button type="submit" disabled={loading} colorScheme="blue" mt={4}>
          {loading ? "Tracing..." : "Trace"}
        </Button>
        <Text color="red.500" mt={4}>
          {error}
        </Text>
        <Compile />
      </form>
    </Box>
  );
}
