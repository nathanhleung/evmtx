import axios from "axios";
import { useEffect, useState } from "react";
import { Badge, BadgeProps } from "@chakra-ui/react";

type ConnectionBadgeProps = Omit<BadgeProps, "colorScheme">;

/**
 * Component which displays the server's web3 connection status
 */
export default function ConnectionBadge(props: ConnectionBadgeProps) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await axios.get(
        process.env.REACT_APP_SERVER_URL + "/connected"
      );
      const data = result.data;
      setConnected(data || data === "true");
    }, 1000);
    return () => clearInterval(interval);
  }, [connected]);

  return (
    <Badge colorScheme={connected ? "green" : "red"} {...props}>
      {connected ? "Connected to Web3" : "Not Connected to Web3"}
    </Badge>
  );
}
