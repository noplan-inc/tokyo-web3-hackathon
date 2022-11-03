import type { NextPage } from "next";
import {
  Heading,
  Button,
  Flex,
  Box,
  Spacer,
  Select,
  Input,
  FormLabel,
  Switch,
  Image,
  Textarea,
} from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Header } from "../../components/Header";
import { ChangeEvent, useState } from "react";
import Link from "next/link";

// _____________________________________________________________________________
//
const Page: NextPage = () => {
  // TODO: styling
  return (
    <Box p="12">
      <Header />
      <Link href="/">
        <Button>
          <ChevronLeftIcon w={6} h={6} />
        </Button>
      </Link>
      {/* contents */}
      <Box></Box>
    </Box>
  );
};
// _____________________________________________________________________________
//
export default Page;
