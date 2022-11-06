import { Header } from "../components/Header";
import Link from "next/link";
import { Box, Image, Divider, Heading, Text } from "@chakra-ui/react";
import { Footer } from "../components/Footer";

export default function Home() {
  const itemList: {
    tokenId: string;
    subDomainSiteName: string;
    imageUrl: string;
    description: string;
  }[] = [
    {
      tokenId: "1",
      subDomainSiteName: "blog.2an.co/",
      imageUrl: "",
      description: `LN(Lightning Network)を利用した新しい収益モデルによるブログ運営を可能にするアプリ
      広告によって収益を生み出している従来のようなブログサイトではなく、
      読者がブログページへ訪れるためには支払いが必要になるような仕組みが構築されたブログ運営アプリ。
      また、ブログ運営者は上記のLNによる収益に加えて、運営権をNFTにして売却・購入することも可能。`,
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

      {itemList.map((item, i) => {
        return (
          <Box
            key={item.tokenId}
            display="flex"
            flexDirection="column"
            w="fit-content"
            margin="24px auto"
          >
            <Text
              fontSize="24px"
              mt="12px"
              fontWeight="extrabold"
              textAlign="center"
            >
              {item.subDomainSiteName}
            </Text>
            <Link href={`/detail/${item.tokenId}`}>
              <Image
                m="0 auto"
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
