import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { Transaction } from "../components/";
import { TransactionResultProp } from "../components/Transaction";

type Trace = {
  from: string;
  to: string;
  username: string;
  identation: number;
};

type Txn = {
  data: string;
  gasPrice: string;
  value: string;
};

export default function TransactionDetail() {
  const { transactionId } = useParams();
  const [traces, setTraces] = useState<Trace[]>([] as Trace[]);
  const [traceResult, setTraceResult] = useState<any>();
  const [txn, setTxn] = useState<Txn>({} as Txn);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/transactions/" + transactionId)
      .then((response) => {
        const data = response.data;
        const traces = data.traces;
        setTraces([traces]);
        setTxn(traces.transactionData);
        setTraceResult(JSON.parse(traces.traceResults));
      });
  }, [transactionId]);

  return (
    <div>
      <pre style={{ whiteSpace: "normal" }}>
        {JSON.stringify(traceResult, null, 4)}
      </pre>
    </div>
  );
}
