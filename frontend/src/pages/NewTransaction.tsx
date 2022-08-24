import axios from "axios";
import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";

export default function NewTransaction() {
  const [transactionData, setTransactionData] = useState("");
  const [value, setValue] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [fromAddress, setFromAddress] = useState(
    "0x0000000000000000000000000000000000000000"
  );
  const [gasPrice, setGasPrice] = useState("");
  const [gasLimit, setGasLimit] = useState("");
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("to", toAddress);
    data.append("value", value);
    data.append("data", transactionData);
    data.append("from", fromAddress);
    data.append("gasPrice", gasPrice);
    data.append("gasLimit", gasLimit);
    try {
      const result = await axios.post(
        process.env.REACT_APP_SERVER_URL + "/sendTxn",
        data
      );
      console.log(result.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="Transaction bg-sky-900 text-white font-semibold py-2 rounded-lg"
      style={{ padding: 20 }}
    >
      <form onSubmit={handleSubmit}>
        <FormControl className="py-2">
          <FormLabel>To Address</FormLabel>
          <Input
            color="black"
            value={toAddress}
            placeholder="To address"
            onChange={(e) => setToAddress(e.target.value)}
            backgroundColor="white"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Value</FormLabel>
          <Input
            color="black"
            value={value}
            placeholder="Value (wei)"
            onChange={(e) => setValue(e.target.value)}
            type="number"
            style={{ width: "50%" }}
            backgroundColor="white"
          />
        </FormControl>
        <FormControl className="py-1">
          <FormLabel>Gas Price</FormLabel>
          <Input
            color="black"
            value={gasPrice}
            placeholder="GasPrice (wei)"
            onChange={(e) => setGasPrice(e.target.value)}
            type="number"
            style={{ width: "50%" }}
            backgroundColor="white"
          />
        </FormControl>
        <FormControl className="py-2">
          <FormLabel>Gas Limit</FormLabel>
          <Input
            color="black"
            value={gasLimit}
            placeholder="GasLimit (wei)"
            onChange={(e) => setGasLimit(e.target.value)}
            type="number"
            style={{ width: "50%" }}
            backgroundColor="white"
          />
        </FormControl>
        <FormControl className="py-2">
          <FormLabel>From Address</FormLabel>
          <Input
            color="black"
            value={fromAddress}
            placeholder="From Address"
            onChange={(e) => setFromAddress(e.target.value)}
            type="string"
            style={{ width: "50%" }}
            backgroundColor="white"
          />
        </FormControl>

        <div className="py-2">
          <textarea
            className="rounded-lg"
            color="black"
            placeholder="Transaction hex data"
            value={transactionData}
            onChange={(e) => setTransactionData(e.target.value)}
            style={{ width: "100%", fontSize: "1.5rem" }}
            rows={10}
          />
        </div>
        <Button type="submit" disabled={loading} colorScheme="blue">
          {loading ? "Tracing..." : "Trace"}
        </Button>
      </form>
    </div>
  );
}
