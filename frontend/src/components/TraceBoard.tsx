import {TraceProps} from "./Trace";
import Trace from "./Trace"

type TraceBoardProp = {
    traces: TraceProps[];
}


export default function TraceBoard(props: TraceBoardProp) {
    const traces = props.traces.map((prop) =>
    <Trace from= {prop.from} to = {prop.to} identation={prop.identation} ></Trace>
    );
    return (
      <div className="TraceBoard">
        {traces}
      </div>
    )
  }