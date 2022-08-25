import { FaCopy } from "react-icons/fa";
import { Box, Heading, useToast } from "@chakra-ui/react";
import { Icon, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

export type TraceProps = {
  trace: {
    from: string;
    to: string;
    calldata: string;
    subcalls: any[];
  };
  showTableHeaders?: boolean;
};

export default function Trace({ trace, showTableHeaders = false }: TraceProps) {
  const toast = useToast();

  console.log(trace);

  return (
    <Box>
      <Table width="100%">
        {showTableHeaders && (
          <Thead>
            <Tr>
              <Th>From</Th>
              <Th>To</Th>
              <Th>Calldata</Th>
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
                  description: "Calldata copied to clipboard",
                  status: "success",
                  isClosable: true,
                });
              }}
            >
              {trace.from} <Icon as={FaCopy} boxSize={3} ml={1} mb={1} />
            </Td>
            <Td
              cursor="pointer"
              onClick={() => {
                navigator.clipboard.writeText(trace.to);
                toast({
                  title: "Copied!",
                  description: "Calldata copied to clipboard",
                  status: "success",
                  isClosable: true,
                });
              }}
            >
              {trace.to} <Icon as={FaCopy} boxSize={3} ml={1} mb={1} />
            </Td>
            <Td
              cursor="pointer"
              onClick={() => {
                navigator.clipboard.writeText(trace.calldata);
                toast({
                  title: "Copied!",
                  description: "Calldata copied to clipboard",
                  status: "success",
                  isClosable: true,
                });
              }}
            >
              {trace.calldata.slice(0, 10)}...
              <Icon as={FaCopy} boxSize={3} ml={1} mb={1} />
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
