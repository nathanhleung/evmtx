import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, BadgeProps, Tooltip } from "@chakra-ui/react";
import { SERVER_URL } from "../config";

type ConnectionBadgeProps = Omit<BadgeProps, "colorScheme">;

/**
 * Component which displays the server's web3 connection status
 */
export default function ConnectionBadge(props: ConnectionBadgeProps) {
  const [localConnection, setLocalConnection] = useState(false);
  const [remoteConnection, setRemoteConnection] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const result = await axios.get(SERVER_URL + "/connection/local");
        const data = result.data;
        setLocalConnection(
          data && (data.result === true || data.result === "true")
        );
      } catch (e) {
        console.log(e);
        setLocalConnection(false);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const result = await axios.get(SERVER_URL + "/connection/remote");
        const data = result.data;
        setRemoteConnection(
          data && (data.result === true || data.result === "true")
        );
      } catch (e) {
        console.log(e);
        setRemoteConnection(false);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Tooltip label="Anvil Blockchain Fork Connection Status">
        <Link to="/about">
          <Badge colorScheme={localConnection ? "green" : "red"} {...props}>
            {localConnection
              ? "Connected to Forked Web3"
              : "Not Connected to Forked Web3"}
          </Badge>
        </Link>
      </Tooltip>
      <Tooltip label="Full Blockchain Debug Node Connection Status">
        <Link to="/about">
          <Badge colorScheme={remoteConnection ? "green" : "red"} {...props}>
            {remoteConnection
              ? "Connected to Full Web3"
              : "Not Connected to Full Web3"}
          </Badge>
        </Link>
      </Tooltip>
    </>
  );
}
