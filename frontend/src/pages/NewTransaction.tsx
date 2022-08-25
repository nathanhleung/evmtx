import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";

export default function NewTransaction() {
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
    const response = await axios.get(
      process.env.REACT_APP_SERVER_URL + "/gas-price"
    );
    setGasPrice(response.data.gasPrice);
  }

  useEffect(() => {
    getGasPrice();
  }, []);

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
      const result = await axios.post(
        process.env.REACT_APP_SERVER_URL + "/transactions/new",
        data
      );
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
    <div
      className="Transaction bg-zinc-200 text-black font-semibold py-2 rounded-lg"
      style={{ padding: 20 }}
    >
      <form onSubmit={handleSubmit}>
        <VStack align="left">
          <HStack spacing={4}>
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
          {/* <FormControl className="py-1" flex={1}>
            <FormLabel>Gas Price (gwei)</FormLabel>
            <Input
              background="white"
              color="black"
              value={gasPrice}
              placeholder="GasPrice (gwei)"
              onChange={(e) => setGasPrice(e.target.value)}
              type="number"
            />
          </FormControl>
          <FormControl className="py-2" flex={1}>
            <FormLabel>Gas Limit (gwei)</FormLabel>
            <Input
              background="white"
              color="black"
              value={gasLimit}
              placeholder="Gas Limit (gwei)"
              onChange={(e) => setGasLimit(e.target.value)}
              type="number"
            />
          </FormControl> */}
          <FormControl>
            <FormLabel>Transaction Hex Data</FormLabel>
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
        </VStack>
        <Button type="submit" disabled={loading} colorScheme="green" mt={4}>
          {loading ? "Tracing..." : "Trace"}
        </Button>
        <Text color="red" mt={4}>
          {error}
        </Text>
      </form>
    </div>
  );
}
