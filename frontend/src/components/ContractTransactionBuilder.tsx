import axios from "axios";
import { ethers } from "ethers";
import { useState } from "react";
import {
  Box,
  BoxProps,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Text,
} from "@chakra-ui/react";
import { SERVER_URL } from "../config";

export type ContractFuncProps = BoxProps & {
  setTransactionData(newTransactionData: string): void;
};

export default function ContractFuncts({
  setTransactionData,
  ...restProps
}: ContractFuncProps) {
  const [contractAddress, setContractAddress] = useState("");
  const [selectedContractFunctionIndex, setSelectedContractFunctionIndex] =
    useState<number>(0);
  const [abi, setAbi] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [contractFunctionParams, setContractFunctionParams] = useState<
    string[]
  >([]);

  const contractFunctions = abi.filter(function (e: any) {
    return e.type === "function";
  });

  // make call to the get contract abi endpoint
  async function getContractAbi() {
    setError("");
    setLoading(true);
    try {
      const result = await axios.get(
        SERVER_URL + "/contracts/" + contractAddress
      );
      if (Array.isArray(result.data)) {
        setAbi(result.data);
      } else {
        setError(result.data);
      }
    } catch (e) {
      console.log(e);
      setError((e as any).toString());
    } finally {
      setLoading(false);
    }
  }

  function generateCalldata() {
    if (selectedContractFunctionIndex !== undefined) {
      const selectedFunction = contractFunctions[selectedContractFunctionIndex];
      const signature = `${selectedFunction.name}(${selectedFunction.inputs
        .map((i: any) => i.type)
        .join(",")})`;
      console.log(signature);
      console.log(selectedFunction);
      const functionSelector = ethers.utils
        .keccak256(ethers.utils.toUtf8Bytes(signature))
        .slice(0, 10);
      setTransactionData(`Function signature: ${functionSelector}`);
    }
  }

  return (
    <Box {...restProps}>
      <FormControl mt={4}>
        <FormLabel>Contract Address</FormLabel>
        <InputGroup>
          <Input
            background="white"
            color="black"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            type="string"
            placeholder="0x"
          />
          <InputRightElement width="10rem">
            <Button
              size="sm"
              h="1.75rem"
              disabled={contractAddress === "" || loading}
              onClick={getContractAbi}
            >
              {loading ? "Importing... " : "Import ABI"}
            </Button>
          </InputRightElement>
        </InputGroup>
        {error && (
          <Text color="red.500" mt={2}>
            {error}
          </Text>
        )}
      </FormControl>
      {abi && abi.length !== 0 && (
        <Box>
          <FormControl mt={4}>
            <FormLabel>Select Contract Function</FormLabel>
            <Select
              background="white"
              value={selectedContractFunctionIndex}
              onChange={(e) =>
                setSelectedContractFunctionIndex(parseInt(e.target.value, 10))
              }
            >
              {contractFunctions.map((f: any, i) => (
                <option
                  value={i}
                  key={`${f.name}(${f.inputs
                    .map((i: any) => i.type)
                    .join(",")})`}
                >
                  {f.name}
                </option>
              ))}
            </Select>
          </FormControl>
          {selectedContractFunctionIndex !== undefined && (
            <Box>
              {contractFunctions[selectedContractFunctionIndex].inputs
                .filter(function (e: any) {
                  return e.name !== "";
                })
                .map((i: any) => (
                  <FormControl mt={4} key={i.name}>
                    <FormLabel>{i.name}</FormLabel>
                    <Input placeholder={i.name} background="white" />
                  </FormControl>
                ))}
              <Button
                colorScheme="blue"
                size="sm"
                onClick={generateCalldata}
                mt={4}
              >
                Generate Calldata
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
