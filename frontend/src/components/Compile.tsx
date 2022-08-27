import axios from "axios";
import { ethers } from "ethers";
import { useState } from "react";
import { get, set } from "lodash";
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
    Heading,
    Textarea
} from "@chakra-ui/react";
import { SERVER_URL } from "../config";
import ContractTransactionBuilder from "./ContractTransactionBuilder";

export default function Compile({
}) {

    const [contract, setContract] = useState("")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [compiler, setCompiler] = useState("");
    const [contractName, setContractName] = useState("")
    const [compiled, setCompiled] = useState(false)
    const [bytecode, setBytecode] = useState("")
    const [abi, setAbi] = useState([]);
    const [constructorInputs, setConstructorInputs] = useState([])
    const [contractFunctionParams, setContractFunctionParams] = useState<any[]>(
        []
    );
    const [from, setFrom] = useState("")
    const [gasPrice, setGasPrice] = useState("")

    async function compileContract() {
        console.log("HI IM COMPILING THIS SHIT")
        setError("");
        setLoading(true);
        const data = new FormData();
        data.append("source_code", contract)
        data.append("compiler_version", compiler)
        data.append("contract_name", contractName)
        try {
            const result = await axios.post(
                SERVER_URL + "/compileContract",
                data
            );
            console.log(result)
            console.log(result.data)
            if (result.data.status == true) {
                setCompiled(true)
                setAbi(result.data.ABI) // useless
                setBytecode(result.data.deployBytecode)
                const inputs = result.data.ABI
                if (inputs !== []) {
                    setConstructorInputs(inputs)
                }
            }
        } catch (e) {
            console.log(e);
            setError((e as any).toString());
        } finally {
            setLoading(false);
        }
    }

    async function deployContract() {
        setError("");
        setLoading(true);
        const data = new FormData();
        data.append("deployBytecode", bytecode)
        data.append("from", from)
        data.append("gasPrice", gasPrice)
        try {
            const result = await axios.post(
                SERVER_URL + "/deployContracts",
                data
            );

            console.log(result)

            // if (result.data == true) {
            //     setCompiled(true)
            // }
        } catch (e) {
            console.log(e);
            setError((e as any).toString());
        } finally {
            setLoading(false);
        }
    }

    // we have something that maps to this

    function constructorFormControl(input: any, index: number[]) {
        // if the constructor arg is a struct
        if (input.type === "tuple") {
            return input.components.map((component: any, i: number) => {
                return constructorFormControl(component, [...index, i]);
            });
        }
        const isArrayType = input.type.includes("[");
        return (
            // return constructor inputs
            <FormControl mt={4} key={input.name}>
                <FormLabel color="gray.500">
                    {input.type} {input.name}
                </FormLabel>
                <Input value={get(contractFunctionParams, index, "").value}
                    onChange={(e) => {
                        const value = e.target.value
                        const newContractFunctionParams = set(
                            [...contractFunctionParams],
                            index,
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
                    disabled={isArrayType} />
            </FormControl>
        )
    }


    return (
        <Box>
            <div>
                <Heading size="sm" mb={2}>
                    Contract Code
                </Heading>
                <Text color="gray.500">Manually input your contract code to compile and deploy.</Text>
                <FormControl mt={4}>
                    <Input value={contractName} onChange={(e) => setContractName(e.target.value)} placeholder="Contract Name" background="white" mb={4}/>
                    <Textarea
                        background="white"
                        color="black"
                        className="rounded-lg"
                        placeholder="Transaction Hex Data"
                        value={contract}
                        onChange={(e) => setContract(e.target.value)}
                        style={{ width: "100%" }}
                        rows={10}
                        mb={4}
                    />
                    <Input value={compiler} onChange={(e) => setCompiler(e.target.value)} placeholder="Compiler Version" background="white" />
                </FormControl>
                <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={compileContract}
                    mt={4}
                    mb={4}
                >
                    Compile
                </Button>
                <Box>
                    <Heading size="sm" mb={2}>
                        Constructor Arguments
                    </Heading>
                    {
                        // return constructor inputs
                        constructorInputs === [] ? <div></div> :
                            constructorInputs.map((input: any, index: number) => { return constructorFormControl(input, [index]) }
                            )
                    }
                </Box>
                <Box>
                    <Input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="From Address" background="white" mb={4} mt={4}/>
                    <Input value={gasPrice} onChange={(e) => setGasPrice(e.target.value)} placeholder="Gas Price" background="white" />
                </Box>
                <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={deployContract}
                    mt={4}
                    disabled={!compiled}
                >
                    Deploy
                </Button>
            </div>
        </Box>
    );
}
