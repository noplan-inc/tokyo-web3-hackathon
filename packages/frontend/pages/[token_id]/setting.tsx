import type { NextPage } from "next";
import { Heading, Button, Flex, Box, Spacer } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Header } from "../../components/Header";

// _____________________________________________________________________________
//
const Page: NextPage = () => {
  return (
    <Box p="12">
      <Header />
      <Button>
        <ChevronLeftIcon w={6} h={6} />
      </Button>

      <Heading as="h2" size="xl" mt="24px">
        item for sale
      </Heading>
      {/* contents */}
      <Box>
        <Heading as="h3" size="md" mt="12px">
          Type
        </Heading>
        <Box>Fixed Price💰</Box>
      </Box>

      <Box>
        <Heading as="h3" size="md" mt="12px">
          Type
        </Heading>
        <Box>Fixed Price💰</Box>
      </Box>

      <Box>
        <Heading as="h3" size="md" mt="12px">
          Price
        </Heading>
        <Box>input</Box>
      </Box>

      <Box>
        <Heading as="h3" size="md" mt="12px">
          Whether or not to sell
        </Heading>
        <Box>toggle</Box>
      </Box>

      <Box>
        <Heading as="h3" size="md" mt="12px">
          Preview
        </Heading>
        <Box>画像</Box>
      </Box>

      <Box>
        <Heading as="h3" size="md" mt="12px">
          Description
        </Heading>
        <Box>text area</Box>
      </Box>
      <Button colorScheme="teal" size="lg">
        Completed
      </Button>
    </Box>
  );
};
// _____________________________________________________________________________
//
export default Page;
