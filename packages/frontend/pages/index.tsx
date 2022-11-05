import { Header } from "../components/Header";
import Link from "next/link";
import { Button, Box, Image, Divider, Heading, Text } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";

export default function Home() {
  // TODO: mock
  const itemList: {
    subDomainSiteName: string;
    href: any;
    imageUrl: string;
    description: string;
  }[] = [
    {
      subDomainSiteName: "111111111.webma.site",
      href: "/",
      imageUrl: "",
      description: "descriptiondescriptiondescription",
    },
    {
      subDomainSiteName: "2222222222.webma.site",
      href: "/",
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
          <Box w="fit-content" border="2px solid #000" borderRadius="8px">
            <Text fontSize="24px" mt="12px" fontWeight="extrabold">
              {item.subDomainSiteName}
            </Text>
            <Link href={item.href}>
              <Image
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
      <Divider mt="24px" />
      <footer>Copyright © 2022 LSAT App. All right reserved.</footer>
    </Box>
  );
}
