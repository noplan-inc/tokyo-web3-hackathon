import { Header } from "../components/Header";
import Link from "next/link";
import { Box, Image, Divider, Heading, Text } from "@chakra-ui/react";
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
    <Box p="16px" minHeight="100vh" position="relative">
      <Header />
      <Divider />

      <Heading as="h2" mt="24px" textAlign="center">
        SITES YOU CAN SEE
        <br />
        WHEN YOU PAY
        <br />
        WITH LIGHITING⚡️
      </Heading>

      <Heading
        as="h3"
        size="lg"
        fontWeight="extrabold"
        mt="24px"
        textAlign="center"
      >
        Purchasable🙆‍♂️
      </Heading>

      {itemList.map((item) => {
        return (
          <Box
            key={item.tokenId}
            w="fit-content"
            border="2px solid #000"
            borderRadius="8px"
            margin="24px auto"
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
