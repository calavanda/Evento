import React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
  useColorModeValue,
  Container,
  SimpleGrid,
  Image,
} from "@chakra-ui/react";
import { MdLogin, MdEvent, MdAnalytics, MdStorefront } from "react-icons/md";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionStack = motion(Stack);

const Feature = ({ title, text, icon, index }) => {
  return (
    <MotionStack
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      align={"center"}
      textAlign={"center"}
      p={8}
      bg={useColorModeValue("whiteAlpha.700", "navy.800")}
      backdropFilter="blur(20px)"
      borderRadius="30px"
      boxShadow={useColorModeValue(
        "0px 20px 40px rgba(0, 0, 0, 0.05)",
        "0px 20px 40px rgba(0, 0, 0, 0.3)"
      )}
      border="1px solid"
      borderColor={useColorModeValue("whiteAlpha.900", "whiteAlpha.100")}
      _hover={{ transform: "translateY(-12px)", boxShadow: "0px 30px 60px rgba(0,0,0,0.1)", transition: "all .4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}
    >
      <Flex
        w={16}
        h={16}
        align={"center"}
        justify={"center"}
        color={"white"}
        rounded={"20px"}
        bgGradient="linear(to-br, brand.400, brand.600)"
        mb={2}
        boxShadow="0px 10px 20px rgba(67, 24, 255, 0.2)"
      >
        {icon}
      </Flex>
      <Text fontWeight={800} fontSize={"xl"} color={useColorModeValue("secondaryGray.900", "white")}>
        {title}
      </Text>
      <Text color={"secondaryGray.600"} lineHeight="1.6">{text}</Text>
    </MotionStack>
  );
};

export default function LandingPage() {

  
  return (
    <Box 
        minH="100vh" 
        bg={useColorModeValue("#F4F7FE", "navy.900")}
        overflow="hidden"
        position="relative"
    >
      {/* Decorativos animados */}
      <MotionBox
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        position="absolute"
        top="-10%"
        right="-5%"
        w="600px"
        h="600px"
        bg="brand.500"
        filter="blur(140px)"
        zIndex="0"
      />
      <MotionBox
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.08, 0.12, 0.08],
          x: [0, -40, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        position="absolute"
        bottom="-15%"
        left="-5%"
        w="500px"
        h="500px"
        bg="cyan.400"
        filter="blur(120px)"
        zIndex="0"
      />

      <Container maxW={"7xl"} position="relative" zIndex="1">
        {/* Navbar */}
        <MotionFlex 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          py={6} 
          align="center" 
          justify="space-between"
        >
          <Heading fontSize="2x1" fontWeight="900" letterSpacing="extra-tight" color={useColorModeValue("brand.500", "white")}>
            FRANCOPHONIE <Box as="span" color="gray.300" fontWeight="300">|</Box> SAVEURS
          </Heading>
          <Button
            as={RouterLink}
            to="/admin"
            variant="brand"
            bgGradient="linear(to-r, brand.500, brand.400)"
            _hover={{ bgGradient: "linear(to-r, brand.600, brand.500)", transform: "scale(1.05)" }}
            _active={{ transform: "scale(0.95)" }}
            borderRadius="18px"
            px={8}
            h="52px"
            leftIcon={<Icon as={MdLogin} />}
            boxShadow="0px 10px 25px rgba(67, 24, 255, 0.25)"
            transition="all 0.3s ease"
          >
            Panel Administrativo
          </Button>
        </MotionFlex>

        {/* Sección Hero */}
        <Stack
          align={"center"}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 12, md: 24 }}
          direction={{ base: "column", md: "row" }}
        >
          <MotionStack 
            flex={1} 
            spacing={{ base: 6, md: 10 }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Heading
              lineHeight={1.1}
              fontWeight={900}
              fontSize={{ base: "5xl", sm: "6xl", lg: "7xl" }}
              letterSpacing="tight"
            >
              <Text 
                as={"span"} 
                bgGradient="linear(to-r, brand.500, cyan.400)" 
                bgClip="text"
                display="inline-block"
              >
                Bienvenida
              </Text>
              <br />
              <Text as={"span"} color={useColorModeValue("navy.900", "white")}>
                al Evento Gastronómico
              </Text>
            </Heading>
            <Text color={"secondaryGray.600"} fontSize="xl" maxW="550px" lineHeight="1.8">
              Una plataforma premium diseñada para el registro, gestión de stands y 
              analíticas avanzadas del festival <b>Les Saveurs de la Francophonie</b>.
            </Text>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={{ base: "column", sm: "row" }}
            >
              <Button
                as={RouterLink}
                to="/admin"
                rounded={"20px"}
                size={"lg"}
                fontWeight={"800"}
                px={12}
                colorScheme={"brand"}
                bgGradient="linear(to-r, brand.500, brand.400)"
                _hover={{ bgGradient: "linear(to-r, brand.600, brand.500)", transform: "translateY(-5px)", boxShadow: "0px 20px 40px rgba(67, 24, 255, 0.4)" }}
                _active={{ transform: "scale(0.98)" }}
                h="70px"
                fontSize="xl"
                boxShadow="0px 15px 30px rgba(67, 24, 255, 0.3)"
                transition="all 0.3s cubic-bezier(.08,.52,.52,1)"
              >
                EMPEZAR AHORA
              </Button>
            </Stack>
          </MotionStack>
          <MotionFlex
            flex={1}
            justify={"center"}
            align={"center"}
            position={"relative"}
            w={"full"}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <MotionBox
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              position={"relative"}
              height={{ base: "350px", md: "500px" }}
              rounded={"3xl"}
              boxShadow={"dark-lg"}
              width={"full"}
              overflow={"hidden"}
              border="8px solid"
              borderColor={useColorModeValue("whiteAlpha.800", "whiteAlpha.100")}
              backdropFilter="blur(10px)"
            >
              <Image
                alt={"Hero Image"}
                fit={"cover"}
                align={"center"}
                w={"100%"}
                h={"100%"}
                src={require("assets/img/landing_hero.png")}
              />
            </MotionBox>
          </MotionFlex>
        </Stack>

        {/* Tabla de características */}
        <Box py={24}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={12}>
            <Feature
              index={0}
              icon={<Icon as={MdEvent} w={8} h={8} />}
              title={"Registro QR Inteligente"}
              text={"Generación instantánea de gafetes QR blindados para una identificación y acceso ultrarrápido."}
            />
            <Feature
              index={1}
              icon={<Icon as={MdStorefront} w={8} h={8} />}
              title={"Stands Premium"}
              text={"Gestión interactiva de mesas y responsables con seguimiento de tráfico en vivo."}
            />
            <Feature
              index={2}
              icon={<Icon as={MdAnalytics} w={8} h={8} />}
              title={"Analíticas Predictivas"}
              text={"Dashboard de élite con gráficas 3D dinámicas y reportes profundos de satisfacción."}
            />
          </SimpleGrid>
        </Box>

        {/* Footer */}
        <Box py={10} borderTop="1px solid" borderColor={useColorModeValue("gray.200", "whiteAlpha.100")} textAlign="center">
          <Text color="gray.500" fontSize="sm">
            © 2026 Sistema del Evento Le Saveurs de la Francophonie. Todos los derechos reservados.
          </Text>
        </Box>
      </Container>
    </Box>
  );
}
