import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { TraceBoard, Transaction } from "../components/";
import { TraceProps } from "../components/Trace";
import { TransactionResultProp } from "../components/Transaction";

export default function TransactionDetail() {
  const { transactionId } = useParams();
  const [traces, setTraces] = useState();
  const [transactionData, setTransactionData] = useState();

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/transactions/" + transactionId)
      .then((response) => {
        console.log(response.data);
        setTrace(response.data.traces);
      });
  }, [transactionId]);
  const txnResult: TransactionResultProp = {
    exeStatus: true,
    from: "0xCB2975c5109212fbdCb169a79Eb6eCc84F5D64e3",
    to: "0xCB2975c5109212fbdCb169a79Eb6eCc84F5D64e3",
    gasPrice: 0,
    value: 0,
    maxPriorityFeePerGas: 0,
    maxFeePerGas: 0,
    gasLimit: 0,
    gasUsage: 0,
    inputData: "",
    transactionFee: 0,
  };
  const traces: TraceProps[] = [];

  return (
    <div>
      <TraceBoard traces={traces} />
      <Transaction
        exeStatus={txnResult.exeStatus}
        from={txnResult.from}
        to={txnResult.to}
        gasPrice={txnResult.gasPrice}
        value={txnResult.value}
        transactionFee={txnResult.gasPrice * txnResult.gasUsage}
        maxPriorityFeePerGas={txnResult.maxPriorityFeePerGas}
        maxFeePerGas={txnResult.maxFeePerGas}
        gasUsage={txnResult.gasUsage}
        gasLimit={txnResult.gasLimit}
        inputData={txnResult.inputData}
      />
      <Box mt={4}>
        <pre>{JSON.stringify(trace, null, 2)}</pre>
      </Box>
    </div>
  );
}
