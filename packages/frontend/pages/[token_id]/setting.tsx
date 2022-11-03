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
  // TODO: mockなので正しくする
  const imageUrl = "/img/mockImage.png";

  const [value, setValue] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };

  // TODO: styling
  // TODO: react-hook-form 入れる
  return (
    <Box p="12">
      <Header />
      <Link href="/">
        <Button>
          <ChevronLeftIcon w={6} h={6} />
        </Button>
      </Link>

      <Heading as="h2" size="xl" mt="24px">
        item for sale
      </Heading>
      {/* contents */}
      <form>
        <Box>
          <Heading as="h3" size="md" mt="12px">
            Type
          </Heading>
          {/* memo:現状固定 */}
          <Box>Fixed Price💰</Box>
        </Box>

        <Box>
          <Heading as="h3" size="md" mt="12px">
            Price
          </Heading>
          <Input placeholder="Amount" />
          <Select>
            <option value="eth">ETH</option>
            <option value="btc">BTC</option>
            <option value="matic">MATIC</option>
          </Select>
        </Box>

        <Box>
          <Heading as="h3" size="md" mt="12px">
            Whether or not to sell
          </Heading>
          <FormLabel htmlFor="isChecked">Publish:</FormLabel>
          <Switch id="isChecked" />
        </Box>

        <Box>
          <Heading as="h3" size="md" mt="12px">
            Preview
          </Heading>
          <Box w="fit-content" border="4px solid #000" borderRadius="8px">
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
          <Textarea
            value={value}
            onChange={handleInputChange}
            placeholder="placeholder"
            size="lg"
          />
        </Box>

        <Button colorScheme="teal" size="lg" mt="24px">
          Completed
        </Button>
      </form>
    </Box>
  );
};
// _____________________________________________________________________________
//
export default Page;
