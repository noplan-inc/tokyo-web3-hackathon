import { Header } from "../components/Header";
import Link from "next/link";
import { Button, Box, Image, Divider, Heading, Text } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Footer } from "../components/Footer";

export default function Home() {
  // TODO: mock
  const itemList: {
    tokenId: string;
    subDomainSiteName: string;
    imageUrl: string;
    description: string;
  }[] = [
    {
      tokenId:
        "25904909721345378695781540710917280912424441640456853830352847664990490981234",
      subDomainSiteName: "111111111.webma.site",
      imageUrl: "",
      description: "descriptiondescriptiondescription",
    },
  ];

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

      <Heading as="h2" mt="24px">
        SITES YOU CAN SEE
        <br />
        WHEN YOU PAY
        <br />
        WITH LIGHITING⚡️
      </Heading>

      <Heading as="h3" mt="24px">
        Purchasable🙆‍♂️
      </Heading>

      {itemList.map((item) => {
        return (
          <Box
            key={item.tokenId}
            w="fit-content"
            border="2px solid #000"
            borderRadius="8px"
          >
            <Text fontSize="24px" mt="12px" fontWeight="extrabold">
              {item.subDomainSiteName}
            </Text>
            <Link href={`/detail/${item.tokenId}`}>
              <Image
                alt=""
                src={item.imageUrl}
                fallbackSrc="https://via.placeholder.com/352x220.png"
              />
            </Link>
            <Text fontSize="12px" mt="12px">
              Description
            </Text>
            <Text>{item.description}</Text>
          </Box>
        );
      })}
      <Footer />
    </Box>
  );
}
