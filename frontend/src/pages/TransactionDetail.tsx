import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { TraceBoard, Transaction } from "../components/";
import { TraceProps } from "../components/Trace";
import { TransactionResultProp } from "../components/Transaction";
import { collapseTextChangeRangesAcrossMultipleVersions, textChangeRangeIsUnchanged } from "typescript";

type Trace = {
  from: string;
  to: string;
  username: string;
  identation: number;
};

export default function TransactionDetail() {
  const { transactionId } = useParams();
  const [traces, setTraces] = useState<Trace[]>([] as Trace[]);
  const [transactionData, setTransactionData] = useState();

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/transactions/" + transactionId)
      .then((response) => {
        console.log(response.data);
        setTraces(response.data.traces);
        console.log(traces)
      });
  }, [transactionId]);
    const txnResults: TransactionResultProp[] = traces.map(trace => ( {
      exeStatus: true,
      from: trace.from,
      to: trace.to,
      gasPrice: 0,
      value: 0,
      maxPriorityFeePerGas: 0,
      maxFeePerGas: 0,
      gasLimit: 0,
      gasUsage: 0,
      inputData: "",
      transactionFee: 0,
    } as TransactionResultProp));

  return (
    <div>
      <TraceBoard traces={traces ?? []} />
      {txnResults.map(result => 
        <Transaction
          exeStatus={result.exeStatus}
          from={result.from}
          to={result.to}
          gasPrice={result.gasPrice}
          value={result.value}
          transactionFee={result.gasPrice * result.gasUsage}
          maxPriorityFeePerGas={result.maxPriorityFeePerGas}
          maxFeePerGas={result.maxFeePerGas}
          gasUsage={result.gasUsage}
          gasLimit={result.gasLimit}
          inputData={result.inputData}
        />
      )
      }
      <Box mt={4}>
        <pre>{JSON.stringify(traces, null, 2)}</pre>
      </Box>
    </div>
  );
}
