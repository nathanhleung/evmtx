import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Transaction } from "../components/"
import Logs from "../components/Logs"
import { TransactionResultProp } from "../components/Transaction"
import { LogResultProp } from "../components/Logs"
import { ReactNode } from "react"
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack
} from "@chakra-ui/react"
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons"
import { Route, Routes } from "react-router"

type Trace = {
  from: string
  to: string
  username: string
  identation: number
}

type Txn = {
  data: string
  gasPrice: string
  value: string
}

const Links = ["Overview", "Logs"]

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700")
    }}
    href={children ? "#" + children : "#"}
  >
    {children}
  </Link>
)

export default function TransactionDetail() {
  const { transactionId } = useParams()
  const [traces, setTraces] = useState<Trace[]>([] as Trace[])
  const [txn, setTxn] = useState<Txn>({} as Txn)
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_SERVER_URL +
          "/transactions/" +
          transactionId +
          "#Overview"
      )
      .then((response) => {
        console.log(response.data)
        setTraces(response.data.traces)
        setTxn(response.data.transactionData)
        console.log(traces)
        // use txn data stuff
      })
  }, [transactionId])
  const txnResults: TransactionResultProp[] = traces.map(
    (trace) =>
      ({
        exeStatus: true,
        from: trace.from,
        to: trace.to,
        gasPrice: txn.gasPrice,
        value: txn.value,
        maxPriorityFeePerGas: 0,
        maxFeePerGas: 0,
        gasLimit: 0,
        gasUsage: 0,
        inputData: txn.data,
        transactionFee: 0
      } as TransactionResultProp)
  )
  const logResults: LogResultProp[] = traces.map(
    (trace) =>
      ({
        exeStatus: true,
        from: trace.from,
        to: trace.to,
        inputData: txn.data
      } as LogResultProp)
  )

  return (
    <div>
      <div>
        <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <IconButton
              size={"md"}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={"Open Menu"}
              display={{ md: "none" }}
              onClick={isOpen ? onClose : onOpen}
            />
            <HStack spacing={8} alignItems={"center"}>
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
              >
                {Links.map((link) => (
                  <NavLink key={link}>{link}</NavLink>
                ))}
              </HStack>
            </HStack>
            <Flex alignItems={"center"}>
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                ></MenuButton>
                <MenuList>
                  <MenuItem>Link 1</MenuItem>
                  <MenuItem>Link 2</MenuItem>
                  <MenuDivider />
                  <MenuItem>Link 3</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>

          {isOpen ? (
            <Box pb={4} display={{ md: "none" }}>
              <Stack as={"nav"} spacing={4}>
                {Links.map((link) => (
                  <NavLink key={link}>{link}</NavLink>
                ))}
              </Stack>
            </Box>
          ) : null}
        </Box>
      </div>
      <div>
        <Routes>
          <Route
            path={
              process.env.REACT_APP_SERVER_URL +
              "/transactions" +
              transactionId +
              "#Overview"
            }
            element={txnResults.map((result) => (
              <Transaction
                exeStatus={result.exeStatus}
                from={result.from}
                to={result.to}
                gasPrice={result.gasPrice}
                value={result.value}
                transactionFee={parseInt(result.gasPrice, 16) * result.gasUsage}
                maxPriorityFeePerGas={result.maxPriorityFeePerGas}
                maxFeePerGas={result.maxFeePerGas}
                gasUsage={result.gasUsage}
                gasLimit={result.gasLimit}
                inputData={result.inputData}
              />
            ))}
          ></Route>
          <Route
            path={
              process.env.REACT_APP_SERVER_URL +
              "/transactions" +
              transactionId +
              "#Logs"
            }
            element={logResults.map((result) => (
              <Logs
                exeStatus={result.exeStatus}
                from={result.from}
                to={result.to}
                inputData={result.inputData}
              />
            ))}
          ></Route>
        </Routes>
      </div>
    </div>
  )
}
