import type { NextPage } from "next";
import {
  Heading,
  Button,
  Box,
  Image,
  Text,
  Divider,
  Input,
} from "@chakra-ui/react";
import { ArrowRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { Header } from "../../components/Header";
import Link from "next/link";
import { Footer } from "../../components/Footer";
import { useRouter } from "next/router";
import { ethers, utils } from "ethers";
import { useEffect, useState } from "react";
import {
  useFulfill,
  useGetSwap,
  useApproveERC20,
} from "../../hooks/useContract";
import { useAccount } from "wagmi";

// _____________________________________________________________________________
//
const Page: NextPage = () => {
  const router = useRouter();
  const tokenId = router?.query.tokenId;
  const [price, setPrice] = useState<string>("");
  const { address } = useAccount();
  const { data } = useGetSwap(0);

  useEffect(() => {
    if (data) {
      const result = utils.parseUnits(data[0].price.toString());
      const formated = utils.formatUnits(result);
      setPrice(formated.toString());
    }
  }, [data]);

  const { write: erc20Write, isSuccess } = useApproveERC20(
    address,
    data?.[0]?.erc20,
    data?.[0]?.price
  );

  const { write: fulfillWrite } = useFulfill(0, isSuccess);

  const handleLocation = (path: string) => {
    window.open(`https://${path}`, "_blank");
  };

  // mock
  const imageUrl = "/img/mockImage.png";
  // TODO: descriptionを正しくする。
  const description = `
  LN(Lightning Network)を利用した新しい収益モデルによるブログ運営を可能にするアプリ
  広告によって収益を生み出している従来のようなブログサイトではなく、
  読者がブログページへ訪れるためには支払いが必要になるような仕組みが構築されたブログ運営アプリ。
  また、ブログ運営者は上記のLNによる収益に加えて、運営権をNFTにして売却・購入することも可能。`;
  // TODO: subDomainSiteNameを正しくする。
  const subDomainSite = "blog.2an.co/";
  const ownerAddress = "0x90D9306105aB6b58a8eccCc65ef38F725770B7c5";

  const handleApproveERC20 = () => {
    console.log(data?.[0].owner);
    console.log(data?.[0].erc20);
    console.log(data?.[0].price.toString());
    if (!erc20Write) return;
    erc20Write();
    console.log("approve erc20");
  };

  // TODO
  const handleMakeOffer = () => {
    if (!fulfillWrite) return;
    fulfillWrite(0 as any);
    console.log("make offer");
  };

  // TODO: styling
  return (
    <Box p="16px" minHeight="100vh" position="relative">
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
        <Heading as="h3" size="lg" fontWeight="extrabold" mt="12px">
          Preview
        </Heading>
        <Box
          mt="12px"
          w="fit-content"
          border="2px solid #000"
          borderRadius="8px"
        >
          <Image
            alt=""
            src={imageUrl}
            fallbackSrc="https://via.placeholder.com/352x220.png"
          />
        </Box>
      </Box>
      <Button mt="12px">
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          onClick={() => handleLocation(subDomainSite)}
        >
          <Text>　See Site　</Text>
          <ArrowRightIcon w={3} h={3} />
        </Box>
      </Button>

      <Box>
        <Heading as="h3" size="lg" fontWeight="extrabold" mt="12px">
          Description
        </Heading>
        <Text>ブログ運営・売買アプリ:　</Text>
        <Text>{description}</Text>
      </Box>

      <Box mt="12px">
        <Heading as="h3" size="lg" fontWeight="extrabold" mt="12px">
          Buy this Web on Ethereum
        </Heading>
        <Text fontSize="24px" mt="12px" fontWeight="extrabold">
          Web: {subDomainSite}
        </Text>
        <Text color="#878787">Owner by {ownerAddress}</Text>
      </Box>
      <Text>Token Id</Text>
      <Box color="#878787">{tokenId}</Box>
      <Text>Current price</Text>
      <Box color="#878787">{price}</Box>

      <Button
        mt="24px"
        colorScheme="teal"
        size="lg"
        onClick={handleApproveERC20}
      >
        Approve ERC20
      </Button>

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
