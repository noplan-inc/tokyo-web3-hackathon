import type { NextPage } from "next";
import { Heading } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

// _____________________________________________________________________________
//
const Page: NextPage = () => {
  return (
    <div>
      <Heading>Setting</Heading>
      <Button colorScheme="teal" size="lg">
        Connect
      </Button>
    </div>
  );
};
// _____________________________________________________________________________
//
export default Page;
