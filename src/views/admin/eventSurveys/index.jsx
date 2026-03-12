import {
  Box,
  Flex,
  Icon,
  SimpleGrid,
  Text,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  VStack,
  HStack,
  Container,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdStar, MdComment, MdFactCheck } from "react-icons/md";
import Card from "components/card/Card";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import { getApiUrl } from "utils/api";

const MotionBox = motion(Box);
const MotionTr = motion(Tr);

export default function EventFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState(null);
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
      const API_URL = getApiUrl();
      const [feedbackRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/event-surveys`),
        fetch(`${API_URL}/api/reports/event-stats`)
      ]);

      if (feedbackRes.ok && statsRes.ok) {
        const feedbackData = await feedbackRes.json();
        const statsData = await statsRes.json();
        setFeedback(feedbackData);
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error fetching event feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <HStack spacing={1}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            as={MdStar}
            color={star <= rating ? "orange.400" : "gray.200"}
          />
        ))}
      </HStack>
    );
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Flex>
    );
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Container maxW="container.xl">
        <VStack align="start" mb="30px" spacing="5px">
          <Text color={textColor} fontSize="34px" fontWeight="800" letterSpacing="tight">
            Feedback del Evento
          </Text>
          <Text color={textColorSecondary} fontSize="md">
            Visualización general de la satisfacción de los asistentes y sus comentarios.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap="20px" mb="20px">
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg="linear-gradient(90deg, #FAD961 0%, #F76B1C 100%)"
                icon={<Icon w="32px" h="32px" as={MdStar} color="white" />}
              />
            }
            name="Satisfacción General"
            value={`${stats?.avgRating || "0.0"} / 5.0`}
          />
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg="linear-gradient(90deg, #4318FF 0%, #707EAE 100%)"
                icon={<Icon w="32px" h="32px" as={MdFactCheck} color="white" />}
              />
            }
            name="Total de Encuestas"
            value={stats?.totalEncuestas || 0}
          />
        </SimpleGrid>

        <Card p="30px" bg={cardBg} borderRadius="20px" boxShadow="0px 18px 40px rgba(112, 144, 176, 0.12)">
          <Flex align="center" mb="25px">
            <IconBox
              w="40px"
              h="40px"
              bg="brand.100"
              icon={<Icon as={MdComment} color="brand.500" h="20px" w="20px" />}
              mr="15px"
            />
            <Text color={textColor} fontSize="20px" fontWeight="700">
              Comentarios de los Asistentes
            </Text>
          </Flex>

          <Box overflowX="auto">
            <Table variant="simple" color="gray.500">
              <Thead>
                <Tr>
                  <Th color="secondaryGray.400" fontSize="xs">Fecha</Th>
                  <Th color="secondaryGray.400" fontSize="xs">Email / Origen</Th>
                  <Th color="secondaryGray.400" fontSize="xs">Calificación</Th>
                  <Th color="secondaryGray.400" fontSize="xs">Comentario</Th>
                </Tr>
              </Thead>
              <Tbody>
                <AnimatePresence>
                  {feedback.map((item, index) => (
                    <MotionTr
                      key={item._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      _hover={{ bg: hoverBg }}
                    >
                      <Td fontSize="sm">
                        {new Date(item.creadoEn).toLocaleDateString()}
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={item.email === "Anónimo" ? "gray" : "brand"}
                          variant="subtle"
                          borderRadius="10px"
                          px="10px"
                        >
                          {item.email}
                        </Badge>
                      </Td>
                      <Td>{renderStars(item.rating)}</Td>
                      <Td maxW="400px">
                        <Text color={textColor} fontSize="sm" whiteSpace="normal">
                          {item.comentarios || (
                            <Text as="span" fontStyle="italic" color="secondaryGray.400">
                              Sin comentarios
                            </Text>
                          )}
                        </Text>
                      </Td>
                    </MotionTr>
                  ))}
                </AnimatePresence>
                {feedback.length === 0 && (
                  <Tr>
                    <Td colSpan={4} textAlign="center" py="40px">
                      No hay comentarios disponibles aún.
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
