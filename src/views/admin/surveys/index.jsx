import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormLabel,
  RadioGroup,
  Radio,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  Card,
  VStack,
  Select,
  Icon,
  Flex,
  Textarea,
} from '@chakra-ui/react';
import { MdFactCheck, MdStorefront, MdComment } from 'react-icons/md';

export default function SurveySatisfaction() {
  const [formData, setFormData] = useState({
    estand: '',
    p1: '5',
    p2: '5',
    p3: '5',
    p4: '5',
    p5: '5',
    comentarios: '',
  });
  const [stands, setStands] = useState([]);
  const [loading, setLoading] = useState(false);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';
  const cardBg = useColorModeValue('white', 'navy.800');
  const brandColor = useColorModeValue('brand.500', 'brand.400');
  const inputBg = useColorModeValue('secondaryGray.300', 'navy.900');
  const toast = useToast();

  useEffect(() => {
    fetchStands();
  }, []);

  const fetchStands = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL 
        ? (process.env.REACT_APP_API_URL.startsWith('http') 
            ? process.env.REACT_APP_API_URL 
            : `https://${process.env.REACT_APP_API_URL}`) 
        : 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/stands`);
      const contentType = response.headers.get("content-type");
      if (!response.ok || !contentType?.includes("application/json")) {
        throw new Error("El servidor no respondió correctamente.");
      }
      const data = await response.json();
      setStands(data);
      if (data.length > 0) setFormData(prev => ({ ...prev, estand: data[0]._id }));
    } catch (error) {
      console.error('Error fetching stands', error);
    }
  };

  const questions = [
    { id: 'p1', text: '¿Qué tan satisfecho está con la organización del evento?' },
    { id: 'p2', text: '¿Cómo calificaría la calidad de los platillos evaluados?' },
    { id: 'p3', text: '¿Qué tan fácil fue realizar el registro y escaneo?' },
    { id: 'p4', text: '¿La atención en los estands fue adecuada?' },
    { id: 'p5', text: '¿Recomendaría este evento a otras personas?' },
  ];

  const handleChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.estand) {
      toast({ title: 'Error', description: 'Selecciona un estand', status: 'error' });
      return;
    }
    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL 
        ? (process.env.REACT_APP_API_URL.startsWith('http') 
            ? process.env.REACT_APP_API_URL 
            : `https://${process.env.REACT_APP_API_URL}`) 
        : 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/surveys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estand: formData.estand,
          p1: parseInt(formData.p1),
          p2: parseInt(formData.p2),
          p3: parseInt(formData.p3),
          p4: parseInt(formData.p4),
          p5: parseInt(formData.p5),
          comentarios: formData.comentarios,
        }),
      });

      if (!response.ok) throw new Error('Error al enviar encuesta');

      toast({
        title: '¡Gracias por participar!',
        description: 'Tus comentarios han sido registrados correctamente.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setFormData({ ...formData, p1: '5', p2: '5', p3: '5', p4: '5', p5: '5', comentarios: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo enviar la encuesta.',
        status: 'error',
      });
    }
    setLoading(false);
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex direction="column" align="center" mb="40px">
        <Icon as={MdFactCheck} w="60px" h="60px" color={brandColor} mb="15px" />
        <Text color={textColor} fontSize="34px" fontWeight="800" textAlign="center">
          Tu Opinión nos Importa
        </Text>
        <Text color={textColorSecondary} fontSize="md" textAlign="center" maxW="600px">
          Ayúdenos a mejorar evaluando su experiencia en el estand y la calidad del evento general.
        </Text>
      </Flex>

      <VStack spacing="30px" pb="100px">
        <Card p={{ base: '20px', md: '50px' }} bg={cardBg} w="100%" maxW="800px" borderRadius="30px" boxShadow="0px 18px 40px rgba(112, 144, 176, 0.12)">
          <form onSubmit={handleSubmit}>
            <VStack spacing="40px" align="stretch">
              
              <Box>
                <FormLabel fontWeight="800" color={textColor} display="flex" alignItems="center" fontSize="lg">
                    <Icon as={MdStorefront} mr="10px" color={brandColor} /> Estand Visitado
                </FormLabel>
                <Select 
                    variant="auth" 
                    bg={inputBg}
                    h="60px"
                    borderRadius="15px"
                    value={formData.estand} 
                    onChange={(e) => setFormData({...formData, estand: e.target.value})}
                >
                  {stands.map(s => (
                    <option key={s._id} value={s._id} style={{color: 'black'}}>{s.nombre} - {s.responsable}</option>
                  ))}
                </Select>
              </Box>

              {questions.map((q, index) => (
                <Box key={q.id} p="25px" bg={inputBg} borderRadius="25px">
                  <Text color={textColor} fontWeight="700" mb="20px" fontSize="md">
                    {index + 1}. {q.text}
                  </Text>
                  <RadioGroup onChange={(val) => handleChange(q.id, val)} value={formData[q.id]}>
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={{ base: '10px', md: '25px' }}>
                      {[1, 2, 3, 4, 5].map(num => (
                        <Radio key={num} value={num.toString()} colorScheme="brand" size="lg">
                          {num === 1 ? '1 (Bajo)' : num === 5 ? '5 (Excelente)' : num}
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                </Box>
              ))}

              <Box>
                <FormLabel fontWeight="800" color={textColor} display="flex" alignItems="center" fontSize="lg">
                    <Icon as={MdComment} mr="10px" color={brandColor} /> Comentarios Adicionales
                </FormLabel>
                <Textarea 
                  placeholder="Escriba aquí sus observaciones (opcional)..." 
                  variant="auth"
                  bg={inputBg}
                  borderRadius="20px"
                  p="20px"
                  h="120px"
                  value={formData.comentarios}
                  onChange={(e) => setFormData({...formData, comentarios: e.target.value})}
                />
              </Box>

              <Button 
                type="submit" 
                variant="brand" 
                h="65px" 
                fontSize="xl" 
                fontWeight="800"
                borderRadius="20px"
                isLoading={loading}
                boxShadow="0px 10px 20px rgba(67, 24, 255, 0.2)"
              >
                Enviar mi Evaluación
              </Button>
            </VStack>
          </form>
        </Card>
      </VStack>
    </Box>
  );
}
