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
import { useApproveWebmaToken, useOpen, useGetSwap } from "../../hooks/useContract";
import { utils } from "ethers";
import React from "react";

// _____________________________________________________________________________
//
const Page: NextPage = () => {
  // TODO: mock
  const imageUrl = "/img/mockImage.png";

  const [address, setAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("0");

  const { write: webmaTokenWrite, isSuccess } = useApproveWebmaToken(
    process.env.NEXT_PUBLIC_WEBMA_SWAP_ADDRESS,
    tokenId
  );

  const { write: openWrite } = useOpen(
    tokenId,
    address,
    utils.parseUnits(price),
    isSuccess
  );

  const handleChangeAddress = (e: any) => {
    const inputValue = e.target.value;
    setAddress(inputValue);
  };

  const handleChangeTokenId = (e: any) => {
    const inputValue = e.target.value;
    setTokenId(inputValue);
  };

  const handleChangePrice = (e: any) => {
    const inputValue = e.target.value;
    setPrice(inputValue);
  };

  const handleApproveNFT = () => {
    webmaTokenWrite?.();
  };

  const handleCompleted = () => {
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

        <Input placeholder='address' onChange={handleChangeAddress} />
        <Input placeholder='token id' onChange={handleChangeTokenId} />
        <Input placeholder='price' onChange={handleChangePrice} />

        <Button
          colorScheme="teal"
          size="lg"
          mt="24px"
          disabled={!webmaTokenWrite}
          onClick={() => handleApproveNFT()}
        >
          Approve NFT
        </Button>

        <Button
          colorScheme="teal"
          size="lg"
          mt="24px"
          disabled={!openWrite}
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
