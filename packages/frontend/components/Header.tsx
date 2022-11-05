import React from "react";
import { Heading, Button, Flex, Box, Spacer } from "@chakra-ui/react";

type Props = {};

export const Header: React.FC<Props> = () => {
  return (
    <Flex minWidth="max-content" alignItems="center" gap="2">
      <Box p="2">
        <Heading as="h1" size="2xl">
          webma ⚡️
        </Heading>
      </Box>
      <Spacer />
      <Button colorScheme="teal" size="lg">
        Connect
      </Button>
    </Flex>
  );
};
