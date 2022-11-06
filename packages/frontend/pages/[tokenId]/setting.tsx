import type { NextPage } from "next";
import {
  Heading,
  Button,
  Box,
  Select,
  Input,
  FormLabel,
  Switch,
  Image,
  Textarea,
  Divider,
} from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Header } from "../../components/Header";
import { ChangeEvent, useState } from "react";
import Link from "next/link";
import { useApproveWebmaToken, useOpen } from "../../hooks/useContract";
import { utils } from "ethers";
import React, { useCallback } from "react";

// _____________________________________________________________________________
//
const Page: NextPage = () => {
  // TODO: mock
  const imageUrl = "/img/mockImage.png";

  const [value, setValue] = useState("");

  const [OpenWrite, setOpenWrite] = useState();

  const { write: webmaTokenWrite, isSuccess } = useApproveWebmaToken(
    "0x651c063F89CE15756F75903b083df30A60FC56c1",
    0
  );

  const { write: openWrite } = useOpen(
    0,
    "0x651c063F89CE15756F75903b083df30A60FC56c1",
    utils.parseUnits("100")
  );

  console.log("aaaaaaaaaaaaaaaaaa");
  console.log(isSuccess);

  // const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
  //   const inputValue = e.target.value;
  //   setValue(inputValue);
  // };

  const handleApproveNFT = () => {
    webmaTokenWrite?.();
  };

  const handleCompleted = () => {
    console.log(openWrite)
    openWrite?.();
  };

  // TODO: styling
  // TODO: react-hook-form 入れる
  return (
    <Box p="12">
      <Header />
      <Divider />
      <Link href="/">
        <Button>
          <ChevronLeftIcon w={6} h={6} />
        </Button>
      </Link>
      <Divider />

      <Heading as="h2" size="xl" mt="24px">
        item for sale
      </Heading>
      {/* contents */}
      <form>
        <Box>
          <Heading as="h3" size="md" mt="12px">
            Whether or not to sell
          </Heading>
          <FormLabel htmlFor="isChecked">Publish:</FormLabel>
          <Switch id="isChecked" />
        </Box>

        <Button
          colorScheme="teal"
          size="lg"
          mt="24px"
          onClick={() => handleApproveNFT()}
        >
          Approve NFT
        </Button>

        <Button
          colorScheme="teal"
          size="lg"
          mt="24px"
          disabled={!isSuccess}
          onClick={() => handleCompleted()}
        >
          Completed
        </Button>
      </form>
      <Divider mt="24px" />
      <footer>Copyright © 2022 LSAT App. All right reserved.</footer>
    </Box>
  );
};
// _____________________________________________________________________________
//
export default Page;
