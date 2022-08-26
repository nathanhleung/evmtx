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
import { useEffect, useState } from 'react'
import axios from 'axios'
import { isGeneratorFunction } from "util/types";

export type ContractFuncProps = {
    addr: string
}

export default function ContractFuncts({
  addr
}: ContractFuncProps) {
    const [abi, setAbi] = useState([])
    const [functions, setFunctions] = useState([])
    // make call to the get contract abi endpoint
    useEffect(() => {
        const interval = setInterval(async () => {
          const result = await axios.get(
            process.env.REACT_APP_SERVER_URL + "/contracts/" + addr
          );
          const data = result.data;
          console.log(data)
          setAbi(data);
          console.log(data[5].type)
          const funcs = data.filter(function(e: any){return e.type  == "function"})
          setFunctions(funcs)
          console.log(functions)
        }, 1000);
        return () => clearInterval(interval);
      }, [abi]);

  return (
    <div>
        {
            functions.map((f: any) => 
            <FormControl mt={4}>
                <FormLabel>{f.name}</FormLabel>
                {
                    f.inputs.filter(function(e:any) { return e.name !== ''}).map((i : any) => 
                        <Input placeholder={i.name}/>
                    )
                }               
            </FormControl>)
        }
    </div>
  )
}
