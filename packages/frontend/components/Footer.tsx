import React from "react";
import { Box, Divider } from "@chakra-ui/react";

export const Footer: React.FC = () => {
  return (
    <>
      <Box position="absolute" bottom="0">
        <Divider
          mt="24px"
          marginRight="calc(50% - 50vw)"
          marginLeft="calc(50% - 50vw)"
          paddingRight="calc(50vw - 50%)"
          paddingLeft="calc(50vw - 50%)"
        />
        <Box p="16px">
          <footer>Copyright © 2022 webma. All right reserved.</footer>
        </Box>
      </Box>
    </>
  );
};
