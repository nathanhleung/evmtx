import axios from "axios";
import { useEffect, useState } from "react";
import {
  Box,
  BoxProps,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";

export type ContractFuncProps = BoxProps & {
  addr: string;
};

export default function ContractFuncts({
  addr,
  ...restProps
}: ContractFuncProps) {
  const [abi, setAbi] = useState([]);
  const [functions, setFunctions] = useState([]);
  // make call to the get contract abi endpoint
  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await axios.get(
        process.env.REACT_APP_SERVER_URL + "/contracts/" + addr
      );
      const data = result.data;
      console.log(data);
      setAbi(data);
      console.log(data[5].type);
      const funcs = data.filter(function (e: any) {
        return e.type == "function";
      });
      setFunctions(funcs);
      console.log(functions);
    }, 1000);
    return () => clearInterval(interval);
  }, [abi]);

  return (
    <Box {...restProps}>
      <FormControl>
        <FormLabel>Select Contract Function</FormLabel>
        <Select background="white">
          {functions.map((f: any) => (
            <option value={f.name}>{f.name}</option>
          ))}
        </Select>
      </FormControl>
      <div>
        {functions.map((f: any) => {
          console.log(f);

          return (
            <FormControl mt={4}>
              <FormLabel>{f.name}</FormLabel>
              {f.inputs
                .filter(function (e: any) {
                  return e.name !== "";
                })
                .map((i: any) => (
                  <Input placeholder={i.name} />
                ))}
            </FormControl>
          );
        })}
      </div>
    </Box>
  );
}
