import type { NextPage } from "next";
import { Heading, Button, Box, Image, Text, Divider } from "@chakra-ui/react";
import { ArrowRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { Header } from "../../components/Header";
import Link from "next/link";
import { Footer } from "../../components/Footer";
import { useRouter } from "next/router";

// _____________________________________________________________________________
//
const Page: NextPage = () => {
  const router = useRouter();
  const tokenId = router?.query.tokenId;

  const handleLocation = (path: string) => {
    window.open(`https://${path}`, "_blank");
  };

  // mock
  const imageUrl = "/img/mockImage.png";
  // TODO: descriptionを正しくする。
  const description =
    "mock description mock description mock description mock description mock description mock description mock description mock description mock description mock description mock description mock description";
  // TODO: subDomainSiteNameを正しくする。
  const subDomainSite = "2an.co";
  const ownerAddress = "0x90D9306105aB6b58a8eccCc65ef38F725770B7c5";
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
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        onClick={() => handleLocation(subDomainSite)}
      >
        <Text>See Site</Text>
        <Button>
          <ArrowRightIcon w={3} h={3} />
        </Button>
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
          {subDomainSite}
        </Text>
        <Text color="#878787">Owner by {ownerAddress}</Text>
      </Box>
      <Text>Token Id</Text>
      <Box color="#878787">{tokenId}</Box>
      <Text>Current price</Text>
      <Box color="#878787">{price} ETH</Box>
      <Box color="#878787">${dollarPrice}</Box>

      <Button mt="24px" colorScheme="teal" size="lg" onClick={handleMakeOffer}>
        Make Offer
      </Button>
      <Footer />
    </Box>
  );
};
// _____________________________________________________________________________
//
export default Page;
