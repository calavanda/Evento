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

const Feature = ({ title, text, icon }) => {
  return (
    <Stack
      align={"center"}
      textAlign={"center"}
      p={8}
      bg={useColorModeValue("whiteAlpha.800", "navy.800")}
      backdropFilter="blur(10px)"
      borderRadius="24px"
      boxShadow="0px 20px 40px rgba(0, 0, 0, 0.05)"
      border="1px solid"
      borderColor={useColorModeValue("white", "whiteAlpha.100")}
      _hover={{ transform: "translateY(-10px)", transition: "all .3s ease" }}
    >
      <Flex
        w={16}
        h={16}
        align={"center"}
        justify={"center"}
        color={"white"}
        rounded={"full"}
        bg={"brand.500"}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={700} fontSize={"xl"} color={useColorModeValue("secondaryGray.900", "white")}>
        {title}
      </Text>
      <Text color={"secondaryGray.600"}>{text}</Text>
    </Stack>
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
      {/* Decorativos */}
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        w="500px"
        h="500px"
        bg="brand.500"
        filter="blur(120px)"
        opacity="0.1"
        zIndex="0"
      />
      <Box
        position="absolute"
        bottom="-10%"
        left="-5%"
        w="400px"
        h="400px"
        bg="cyan.400"
        filter="blur(100px)"
        opacity="0.1"
        zIndex="0"
      />

      <Container maxW={"7xl"} position="relative" zIndex="1">
        {/* Navbar */}
        <Flex py={6} align="center" justify="space-between">
          <Heading fontSize="2xl" fontWeight="800" letterSpacing="tight" color={useColorModeValue("brand.500", "white")}>
            FRANCOPHONIE <Box as="span" color="gray.400">|</Box> EVENTO
          </Heading>
          <Button
            as={RouterLink}
            to="/admin"
            variant="brand"
            borderRadius="16px"
            px={8}
            h="50px"
            leftIcon={<Icon as={MdLogin} />}
            boxShadow="0px 10px 20px rgba(67, 24, 255, 0.2)"
          >
            Acceder al Panel
          </Button>
        </Flex>

        {/* Sección Hero */}
        <Stack
          align={"center"}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
          direction={{ base: "column", md: "row" }}
        >
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <Heading
              lineHeight={1.1}
              fontWeight={800}
              fontSize={{ base: "4xl", sm: "5xl", lg: "6xl" }}
            >
              <Text as={"span"} color={"brand.500"}>
                Bienvenida
              </Text>
              <br />
              <Text as={"span"}>al Evento de Gastronomía</Text>
            </Heading>
            <Text color={"secondaryGray.600"} fontSize="lg" maxW="500px">
              Una plataforma integral para el registro de participantes, evaluación de estands 
              y analíticas en tiempo real para el festival Francophonie.
            </Text>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={{ base: "column", sm: "row" }}
            >
              <Button
                as={RouterLink}
                to="/admin"
                rounded={"full"}
                size={"lg"}
                fontWeight={"700"}
                px={10}
                colorScheme={"brand"}
                bg={"brand.500"}
                _hover={{ bg: "brand.600" }}
                h="60px"
                fontSize="xl"
                boxShadow="0px 15px 30px rgba(67, 24, 255, 0.3)"
              >
                ENTRAR AL EVENTO
              </Button>
            </Stack>
          </Stack>
          <Flex
            flex={1}
            justify={"center"}
            align={"center"}
            position={"relative"}
            w={"full"}
          >
            <Box
              position={"relative"}
              height={"450px"}
              rounded={"2xl"}
              boxShadow={"2xl"}
              width={"full"}
              overflow={"hidden"}
            >
              <Image
                alt={"Hero Image"}
                fit={"cover"}
                align={"center"}
                w={"100%"}
                h={"100%"}
                src={require("assets/img/landing_hero.png")}
              />
            </Box>
          </Flex>
        </Stack>

        {/* Tabla de características */}
        <Box py={20}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Feature
              icon={<Icon as={MdEvent} w={10} h={10} />}
              title={"Registro QR"}
              text={"Generación instantánea de gafetes QR para identificación y acceso rápido."}
            />
            <Feature
              icon={<Icon as={MdStorefront} w={10} h={10} />}
              title={"Estands Digitales"}
              text={"Gestión de mesas y responsables con seguimiento de visitas en tiempo real."}
            />
            <Feature
              icon={<Icon as={MdAnalytics} w={10} h={10} />}
              title={"Analíticas Admin"}
              text={"Dashboard profesional con gráficas interactivas y reportes de satisfacción."}
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
