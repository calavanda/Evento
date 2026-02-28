import {
  Box,
  Flex,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Card,
  Spinner,
  VStack,
  Badge,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdStar,
  MdFactCheck,
} from "react-icons/md";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";

export default function UserReports() {
  const [stats, setStats] = useState(null);
  const [standVisits, setStandVisits] = useState([]);
  const [loading, setLoading] = useState(true);


  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "secondaryGray.600";
  const cardBg = useColorModeValue("white", "navy.800");
  const hoverBg = useColorModeValue("secondaryGray.100", "whiteAlpha.50");


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL 
        ? (process.env.REACT_APP_API_URL.startsWith('http') 
            ? process.env.REACT_APP_API_URL 
            : `https://${process.env.REACT_APP_API_URL}`) 
        : 'http://localhost:5001';
      const [statsRes, visitsRes] = await Promise.all([
        fetch(`${API_URL}/api/reports/stats`),
        fetch(`${API_URL}/api/reports/stand-visits`)
      ]);
      
      if (!statsRes.ok || !visitsRes.ok) {
        throw new Error("Servidor no disponible");
      }

      const contentType1 = statsRes.headers.get("content-type");
      const contentType2 = visitsRes.headers.get("content-type");
      
      if (!contentType1?.includes("application/json") || !contentType2?.includes("application/json")) {
        throw new Error("El servidor no devolvió una respuesta válida (JSON).");
      }

      const statsData = await statsRes.json();
      const visitsData = await visitsRes.json();
      setStats(statsData);
      setStandVisits(visitsData);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }
    setLoading(false);
  };

  const CircleIcon = ({ size, bg, color, children, ...props }) => (
    <Flex
      align="center"
      justify="center"
      minW={size}
      minH={size}
      bg={bg}
      color={color}
      borderRadius="full"
      {...props}
    >
      {children}
    </Flex>
  );

  if (loading) return <Flex justify="center" align="center" h="100vh"><Spinner size="xl" color="brand.500" /></Flex>;

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Flex direction="column" mb="30px">
        <Text color={textColor} fontSize="34px" fontWeight="700" lineHeight="100%">
          Panel Principal
        </Text>
        <Text color={textColorSecondary} fontSize="md" mt="10px">
          Resumen general de actividad y participación en el evento.
        </Text>
      </Flex>

      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 5 }}
        gap='20px'
        mb='20px'>
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
              icon={
                <Icon w='32px' h='32px' as={MdPerson} color="white" />
              }
            />
          }
          name='Participantes'
          value={stats?.totalParticipants || 0}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg="linear-gradient(90deg, #4318FF 0%, #707EAE 100%)"
              icon={
                <Icon w='32px' h='32px' as={MdHome} color="white" />
              }
            />
          }
          name='Estands'
          value={stats?.totalStands || 0}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg="linear-gradient(90deg, #6AD2FF 0%, #3A2ED3 100%)"
              icon={
                <Icon w='32px' h='32px' as={MdBarChart} color="white" />
              }
            />
          }
          name='Visitas'
          value={stats?.totalVisits || 0}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg="linear-gradient(90deg, #EF5B5B 0%, #FFAC30 100%)"
              icon={
                <Icon w='32px' h='32px' as={MdFactCheck} color="white" />
              }
            />
          }
          name='Encuestas'
          value={stats?.surveysCount || 0}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg="linear-gradient(to right, #00b09b, #96c93d)"
              icon={
                <Icon w='32px' h='32px' as={MdStar} color='white' />
              }
            />
          }
          name='Satisfacción'
          value={stats?.avgSatisfaction || '0.0'}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1 }} gap='20px' mb='20px'>
        <Card p="30px" bg={cardBg} borderRadius="20px" boxShadow="0px 18px 40px rgba(112, 144, 176, 0.12)">
          <VStack align="start" mb="30px" spacing="5px">
            <Text color={textColor} fontSize="22px" fontWeight="700">
              Ranking de Estands
            </Text>
            <Text color={textColorSecondary} fontSize="sm">
              Estands con mayor número de visitas registradas.
            </Text>
          </VStack>
          <Box overflowX="auto">
            <Table variant="simple" color="gray.500">
                <Thead>
                <Tr>
                    <Th color="secondaryGray.400" fontSize="xs">Posición</Th>
                    <Th color="secondaryGray.400" fontSize="xs">Nombre del Estand</Th>
                    <Th isNumeric color="secondaryGray.400" fontSize="xs">Total Visitas</Th>
                </Tr>
                </Thead>
                <Tbody>
                {standVisits.map((item, index) => (
                    <Tr key={index} _hover={{ bg: hoverBg }}>
                    <Td>
                        <Flex align="center">
                            <CircleIcon 
                                size="30px" 
                                bg={index < 3 ? "brand.500" : "secondaryGray.300"} 
                                color={index < 3 ? "white" : "gray.600"} 
                                fontWeight="bold" 
                                mr="10px"
                                fontSize="xs"
                            >
                                {index + 1}
                            </CircleIcon>
                        </Flex>
                    </Td>
                    <Td>
                        <Text fontWeight="700" color={textColor}>{item.name}</Text>
                    </Td>
                    <Td isNumeric>
                        <Badge colorScheme="brand" variant="subtle" borderRadius="10px" fontSize="sm" px="10px">
                            {item.count} visitas
                        </Badge>
                    </Td>
                    </Tr>
                ))}
                {standVisits.length === 0 && (
                    <Tr><Td colSpan={3} textAlign="center" py="40px">No hay datos de visitas disponibles.</Td></Tr>
                )}
                </Tbody>
            </Table>
          </Box>
        </Card>
      </SimpleGrid>
    </Box>
  );
}
