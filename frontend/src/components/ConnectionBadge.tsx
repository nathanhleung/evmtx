import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, BadgeProps } from "@chakra-ui/react";

type ConnectionBadgeProps = Omit<BadgeProps, "colorScheme">;

/**
 * Component which displays the server's web3 connection status
 */
export default function ConnectionBadge(props: ConnectionBadgeProps) {
  const [localConnection, setLocalConnection] = useState(false);
  const [remoteConnection, setRemoteConnection] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await axios.get(
        process.env.REACT_APP_SERVER_URL + "/connection/local"
      );
      const data = result.data;
      setLocalConnection(data || data === "true");
    }, 1000);
    return () => clearInterval(interval);
  }, [localConnection]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await axios.get(
        process.env.REACT_APP_SERVER_URL + "/connection/remote"
      );
      const data = result.data;
      setRemoteConnection(data || data === "true");
    }, 1000);
    return () => clearInterval(interval);
  }, [remoteConnection]);

  return (
    <>
      <Link to="/about">
        <Badge colorScheme={localConnection ? "green" : "red"} {...props}>
          {localConnection
            ? "Connected to Forked Web3"
            : "Not Connected to Forked Web3"}
        </Badge>
      </Link>
      <Link to="/about">
        <Badge colorScheme={localConnection ? "green" : "red"} {...props}>
          {localConnection
            ? "Connected to Full Web3"
            : "Not Connected to Full Web3"}
        </Badge>
      </Link>
    </>
  );
}
