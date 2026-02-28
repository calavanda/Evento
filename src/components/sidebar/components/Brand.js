import React from "react";

// Chakra imports
import { Flex, Text } from "@chakra-ui/react";

// Custom components
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  return (
    <Flex align='center' direction='column'>
      <Text
        fontSize='32px'
        fontWeight='800'
        bgGradient='linear(to-r, brand.400, brand.500, navy.700)'
        bgClip='text'
        my='32px'
        textAlign='center'
      >
        Dashboard
      </Text>
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;