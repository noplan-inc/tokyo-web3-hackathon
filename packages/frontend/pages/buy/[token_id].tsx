import type { NextPage } from "next";
import { Heading, Button, Box, Image, Text, Divider } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Header } from "../../components/Header";
import Link from "next/link";

// _____________________________________________________________________________
//
const Page: NextPage = () => {
  // TODO: mock.あとで消す.
  const imageUrl = "/img/mockImage.png";
  const description =
    "mock description mock description mock description mock description mock description mock description mock description mock description mock description mock description mock description mock description";
  const subDomainSiteName = "jhcoder.webma.site";
  const ownerAddress = "0x90D9306105aB6b58a8eccCc65ef38F725770B7c5";
  const lastDateForSell = "Mon Nov 31 2022 18:15:50";
  const price = "8.88";
  const dollarPrice = "11,628";

  // TODO
  const handleMakeOffer = () => {
    console.log("make offer");
  };

  // TODO: styling
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

      {/* contents */}
      <Box>
        <Heading as="h3" size="md" mt="12px">
          Preview
        </Heading>
        <Box w="fit-content" border="2px solid #000" borderRadius="8px">
          <Image
            src={imageUrl}
            fallbackSrc="https://via.placeholder.com/352x220.png"
          />
        </Box>
      </Box>

      <Box>
        <Heading as="h3" size="md" mt="12px">
          Description
        </Heading>
        <Text>{description}</Text>
      </Box>

      <Box>
        <Heading as="h3" size="md" mt="12px">
          Buy this Web on Ethereum
        </Heading>
        <Text fontSize="24px" mt="12px" fontWeight="extrabold">
          {subDomainSiteName}
        </Text>
        <Text color="#878787">Owner by {ownerAddress}</Text>
      </Box>
      <Box>Sale ends {lastDateForSell}</Box>
      <Text>Current price</Text>
      <Box>{price} ETH</Box>
      <Box>${dollarPrice}</Box>

      {/* TODO: 最終確認Modal入れる */}
      <Button mt="24px" colorScheme="teal" size="lg" onClick={handleMakeOffer}>
        Make Offer
      </Button>
    </Box>
  );
};
// _____________________________________________________________________________
//
export default Page;
