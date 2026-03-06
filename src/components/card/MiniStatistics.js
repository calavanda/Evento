// Chakra imports
// Chakra imports
import {
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
// Custom icons
import React from "react";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

export default function Default(props) {
  const { startContent, endContent, name, growth, value } = props;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "secondaryGray.600";

  return (
    <MotionCard
      py='15px'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -5, 
        transition: { duration: 0.2 },
        boxShadow: "0px 20px 40px rgba(112, 144, 176, 0.2)"
      }}
      cursor="pointer"
    >
      <Flex
        my='auto'
        h='100%'
        align={{ base: "center", xl: "start" }}
        justify={{ base: "center", xl: "center" }}>
        {startContent}

        <Stat my='auto' ms={startContent ? "18px" : "0px"}>
          <StatLabel
            lineHeight='100%'
            color={textColorSecondary}
            fontSize={{
              base: "sm",
            }}>
            {name}
          </StatLabel>
          <StatNumber
            color={textColor}
            fontWeight="800"
            fontSize={{
              base: "2xl",
            }}>
            {value}
          </StatNumber>
          {growth ? (
            <Flex align='center'>
              <Text color='green.500' fontSize='xs' fontWeight='700' me='5px'>
                {growth}
              </Text>
              <Text color='secondaryGray.600' fontSize='xs' fontWeight='400'>
                desde el último mes
              </Text>
            </Flex>
          ) : null}
        </Stat>
        <Flex ms='auto' w='max-content'>
          {endContent}
        </Flex>
      </Flex>
    </MotionCard>
  );
}
