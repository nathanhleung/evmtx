import axios from "axios";
import { BigNumber } from "ethers";
import { FunctionFragment, Interface } from "ethers/lib/utils";
import { get, set } from "lodash";
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

export default function ContractTransactionBuilder({
  setTransactionData,
  ...restProps
}: ContractFuncProps) {
  const [contractAddress, setContractAddress] = useState("");
  const [selectedContractFunctionIndex, setSelectedContractFunctionIndex] =
    useState<number>(0);
  const [abi, setAbi] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [contractFunctionParams, setContractFunctionParams] = useState<any[]>(
    []
  );
  const [encodingError, setEncodingError] = useState("");

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
        setAbi([]);
        setSelectedContractFunctionIndex(0);
        setError(result.data);
      }
    } catch (e) {
      setAbi([]);
      setSelectedContractFunctionIndex(0);
      console.log(e);
      setError((e as any).toString());
    } finally {
      setLoading(false);
    }
  }

  // `nestedIndexPath` handles struct parameters
  function getInputFormControl(input: any, nestedIndexPath: number[]) {
    if (input.type === "tuple") {
      return input.components.map((component: any, i: number) => {
        return getInputFormControl(component, [...nestedIndexPath, i]);
      });
    }

    const isArrayType = input.type.includes("[");

    return (
      <FormControl mt={4} key={input.name}>
        <FormLabel color="gray.600">
          {input.type} {input.name}
        </FormLabel>
        <Input
          value={get(contractFunctionParams, nestedIndexPath, "").value}
          onChange={(e) => {
            const value = e.target.value;
            const newContractFunctionParams = set(
              [...contractFunctionParams],
              nestedIndexPath,
              { type: input.type, value }
            );
            setContractFunctionParams(newContractFunctionParams);
          }}
          placeholder={
            isArrayType
              ? "Unsupported Parameter Type"
              : `${input.type} ${input.name}`
          }
          background="white"
          disabled={isArrayType}
        />
      </FormControl>
    );
  }

  // Convert JS types to types that the encoder accepts
  // (e.g. number => bignumber)
  function processFunctionParam(param: { value: string; type: string }): any {
    if (Array.isArray(param)) {
      return param.map(processFunctionParam);
    }
    if (param.type?.includes("int")) {
      return BigNumber.from(param.value);
    }
    return param.value;
  }

  function generateCalldata() {
    if (selectedContractFunctionIndex !== undefined) {
      const contractInterface = new Interface(abi);

      const functionFragment = FunctionFragment.fromObject(
        contractFunctions[selectedContractFunctionIndex]
      );

      try {
        setEncodingError("");

        const processedContractFunctionParams =
          contractFunctionParams.map(processFunctionParam);

        const calldata = contractInterface.encodeFunctionData(
          functionFragment,
          processedContractFunctionParams
        );
        setTransactionData(calldata);
      } catch (e) {
        console.log(e);
        if ((e as any).reason === "types/values length mismatch") {
          setEncodingError("Please fill in all fields.");
        } else {
          setEncodingError((e as any).toString());
        }
      }
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
              onChange={(e) => {
                setSelectedContractFunctionIndex(parseInt(e.target.value, 10));
                setContractFunctionParams([]);
                setEncodingError("");
              }}
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
              <Box>
                {contractFunctions[selectedContractFunctionIndex].inputs
                  .filter(function (e: any) {
                    return e.name !== "";
                  })
                  .map((input: any, index: number) => {
                    return getInputFormControl(input, [index]);
                  })}
              </Box>
              <Button
                colorScheme="blue"
                size="sm"
                onClick={generateCalldata}
                mt={4}
              >
                Generate Calldata
              </Button>
              {encodingError && (
                <Text color="red.500" mt={2}>
                  {encodingError}
                </Text>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
