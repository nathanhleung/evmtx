export type TraceProps = {
  from: string;
  to: string;
  identation: number;
};

export default function Trace(props: TraceProps) {
  return (
    <div className="Trace" style={{ paddingLeft: props.identation * 100 }}>
      <p>
        {props.from} - {props.to}
      </p>
    </div>
  );
}
