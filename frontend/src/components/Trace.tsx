import { FaCopy } from "react-icons/fa";
import stripIndent from "strip-indent";
import {
  Box,
  Code,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useToast,
} from "@chakra-ui/react";
import { Icon, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { Trace as TraceType } from "../types";

export type TraceProps = {
  trace: TraceType;
  showTableHeaders?: boolean;
};

export default function Trace({ trace, showTableHeaders = false }: TraceProps) {
  const toast = useToast();

  const calldataOrFunction = trace.functionName
    ? stripIndent(`
      ${trace.functionName}(
          ${trace.functionArgs?.join(",\n          ")}
      )
    `).trim()
    : trace.calldata;

  return (
    <Box>
      <Table width="100%">
        {showTableHeaders && (
          <Thead>
            <Tr>
              <Th>From</Th>
              <Th>To</Th>
              <Th>Calldata/Function</Th>
            </Tr>
          </Thead>
        )}
        <Tbody>
          <Tr>
            <Td
              cursor="pointer"
              onClick={() => {
                navigator.clipboard.writeText(trace.from);
                toast({
                  title: "Copied!",
                  description: "From address copied to clipboard",
                  status: "success",
                  isClosable: true,
                });
              }}
            >
              {trace.from.slice(0, 10)}...{" "}
              <Icon as={FaCopy} boxSize={3} ml={1} mb={1} />
            </Td>
            <Td
              cursor="pointer"
              onClick={() => {
                navigator.clipboard.writeText(trace.to);
                toast({
                  title: "Copied!",
                  description: "To address copied to clipboard",
                  status: "success",
                  isClosable: true,
                });
              }}
            >
              {trace.to.slice(0, 10)}...{" "}
              <Icon as={FaCopy} boxSize={3} ml={1} mb={1} />
            </Td>
            <Td>
              <Flex alignItems="center">
                <Popover>
                  <PopoverTrigger>
                    <Box cursor="pointer">
                      <Code>
                        {/* Collapse whitespace */}
                        {calldataOrFunction.replace(/\s/g, "").slice(0, 40)}
                      </Code>
                      ...
                    </Box>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Calldata/Function</PopoverHeader>
                    <PopoverBody p={4}>
                      <Code
                        display="block"
                        whiteSpace="pre"
                        overflowX="scroll"
                        p={4}
                        cursor="pointer"
                        onClick={() => {
                          navigator.clipboard.writeText(calldataOrFunction);
                          toast({
                            title: "Copied!",
                            description: "Calldata copied to clipboard",
                            status: "success",
                            isClosable: true,
                          });
                        }}
                      >
                        {calldataOrFunction}
                      </Code>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
                <Icon
                  cursor="pointer"
                  as={FaCopy}
                  boxSize={3}
                  ml={1}
                  mb={1}
                  onClick={() => {
                    navigator.clipboard.writeText(calldataOrFunction);
                    toast({
                      title: "Copied!",
                      description: "Calldata copied to clipboard",
                      status: "success",
                      isClosable: true,
                    });
                  }}
                />
              </Flex>
            </Td>
          </Tr>
        </Tbody>
      </Table>
      {(trace.subcalls ?? []).length > 0 && (
        <Box ml={16} mt={4}>
          <Table>
            <Thead>
              <Tr>
                <Th>Subcalls</Th>
              </Tr>
            </Thead>
          </Table>
          {(trace.subcalls ?? []).map((subcall) => (
            <Trace trace={subcall} />
          ))}
        </Box>
      )}
    </Box>
  );
}
