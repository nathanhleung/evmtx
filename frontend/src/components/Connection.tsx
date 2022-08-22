import axios from "axios";
import { useEffect, useState } from "react";

/**
 * Component which displays the server's web3 connection status
 */
export default function Connection() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await axios.get("/connected");
      const data = result.data;
      setConnected(data === "true");
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <div>{connected ? "Connected" : "Not Connected"}</div>;
}