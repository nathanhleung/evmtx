type Trace = {
  calldata: string;
  from: string;
  to: string;
  functionArgs?: string[];
  functionName?: string;
  status: boolean;
  subcalls: Trace[];
};

export type { Trace };
