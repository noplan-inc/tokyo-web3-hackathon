import React from "react";
import { Heading, Button, Flex, Box, Spacer } from "@chakra-ui/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

type Props = {};

export const Header: React.FC<Props> = () => {
  function Profile() {
    const { address, isConnected } = useAccount();
    const { connect } = useConnect({
      connector: new InjectedConnector(),
    });
    const { disconnect } = useDisconnect();

    if (isConnected)
      return (
        <div>
          <Button colorScheme="teal" size="lg" onClick={() => disconnect()}>
            Disconnect
          </Button>
        </div>
      );
    return (
      <Button colorScheme="teal" size="lg" onClick={() => connect()}>
        Connect
      </Button>
    );
  }

  return (
    <Flex minWidth="max-content" alignItems="center" gap="2">
      <Box p="2">
        <Heading as="h1" size="2xl">
          webma ⚡️
        </Heading>
      </Box>
      <Spacer />
      {Profile()}
    </Flex>
  );
};
