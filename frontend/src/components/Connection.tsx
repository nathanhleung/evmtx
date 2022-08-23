import axios from "axios";
import { useEffect, useState } from "react";

/**
 * Component which displays the server's web3 connection status
 */
export default function Connection() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await axios.get("http://127.0.0.1:9000//connected");
      const data = result.data.result;
      setConnected(data === "true");
    }, 1000);
    return () => clearInterval(interval);
  }, [connected]);

  return <div>{connected ? "Connected" : "Not Connected"}</div>;
}
