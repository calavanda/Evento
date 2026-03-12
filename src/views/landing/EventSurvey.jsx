import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { 
  MdStar, 
  MdStarBorder, 
  MdArrowBack,
} from "react-icons/md";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getApiUrl } from "utils/api";

const MotionBox = motion(Box);

export default function EventSurvey() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [email, setEmail] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const textColor = useColorModeValue("navy.900", "white");
  const bgColor = useColorModeValue("#F4F7FE", "navy.900");
  const formBg = useColorModeValue("white", "navy.800");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        title: "Calificación requerida",
        description: "Por favor selecciona una calificación de 1 a 5 estrellas.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${getApiUrl()}/api/event-surveys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          rating, 
          email: email || "Anónimo",
          comentarios 
        }),
      });

      if (response.ok) {
        toast({
          title: "¡Gracias por tu opinión!",
          description: "Tu feedback nos ayuda a mejorar.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => navigate("/"), 2000);
      } else {
        throw new Error("Respuesta no satisfactoria del servidor");
      }
    } catch (error) {
      console.error("Error al enviar encuesta:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu encuesta. Inténtalo de nuevo.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box minH="100vh" bg={bgColor} py={12}>
      <Container maxW="container.sm">
        <Button
          as={RouterLink}
          to="/"
          leftIcon={<Icon as={MdArrowBack} />}
          variant="ghost"
          mb={8}
          color={textColor}
          _hover={{ bg: useColorModeValue("gray.200", "whiteAlpha.200") }}
        >
          Volver al Inicio
        </Button>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          bg={formBg}
          p={8}
          borderRadius="30px"
          boxShadow={useColorModeValue(
            "0px 20px 40px rgba(0, 0, 0, 0.05)",
            "0px 20px 40px rgba(0, 0, 0, 0.3)"
          )}
        >
          <Stack spacing={6}>
            <Box textAlign="center">
              <Heading color={textColor} fontSize="3xl" mb={2}>
                Encuesta del Evento
              </Heading>
              <Text color="secondaryGray.600" fontSize="lg">
                Sabores de Franconia
              </Text>
              <Text color="secondaryGray.500" mt={2}>
                Cuéntanos qué te pareció el evento
              </Text>
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack spacing={6}>
                {/* Calificación */}
                <FormControl isRequired>
                  <FormLabel textAlign="center" fontSize="lg" fontWeight="bold">
                    ¿Cómo calificas el evento en general?
                  </FormLabel>
                  <Flex justify="center" gap={2}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Icon
                        key={star}
                        as={star <= (hoverRating || rating) ? MdStar : MdStarBorder}
                        w={12}
                        h={12}
                        color={star <= (hoverRating || rating) ? "orange.400" : "gray.300"}
                        cursor="pointer"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        transition="color 0.2s"
                        _hover={{ transform: "scale(1.1)", transition: "transform 0.2s" }}
                      />
                    ))}
                  </Flex>
                  <Text textAlign="center" fontSize="sm" color="secondaryGray.500" mt={2}>
                    {rating === 1 && "Muy malo"}
                    {rating === 2 && "Regular"}
                    {rating === 3 && "Bueno"}
                    {rating === 4 && "Muy bueno"}
                    {rating === 5 && "Excelente"}
                  </Text>
                </FormControl>

                <FormControl>
                  <FormLabel>Correo electrónico (Opcional)</FormLabel>
                  <Input
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    borderRadius="15px"
                  />
                  <Text fontSize="xs" mt={1} color="secondaryGray.500">
                    Si no ingresas un correo, la encuesta será anónima.
                  </Text>
                </FormControl>

                {/* Comentarios */}
                <FormControl>
                  <FormLabel>Comentarios (Opcional)</FormLabel>
                  <Textarea
                    placeholder="¿Qué fue lo que más te gustó? ¿Qué podríamos mejorar para la próxima edición?"
                    value={comentarios}
                    onChange={(e) => setComentarios(e.target.value)}
                    borderRadius="15px"
                    rows={4}
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  fontSize="md"
                  isLoading={isSubmitting}
                  loadingText="Enviando..."
                  bgGradient="linear(to-r, brand.500, brand.400)"
                  _hover={{ 
                    bgGradient: "linear(to-r, brand.600, brand.500)", 
                    transform: "translateY(-2px)", 
                    boxShadow: "0px 10px 20px rgba(67, 24, 255, 0.2)" 
                  }}
                  _active={{ transform: "scale(0.98)" }}
                  borderRadius="15px"
                  h="60px"
                  w="100%"
                >
                  Enviar Encuesta
                </Button>
              </Stack>
            </form>
          </Stack>
        </MotionBox>
      </Container>
    </Box>
  );
}