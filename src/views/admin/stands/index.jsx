import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useColorModeValue,
  SimpleGrid,
  useToast,
  Card,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Icon,
  InputGroup,
  InputLeftElement,
  VStack,
  Flex,
} from '@chakra-ui/react';
import { MdStorefront, MdPerson, MdPlace, MdDescription, MdAddCircle } from 'react-icons/md';

export default function StandManagement() {
  const [formData, setFormData] = useState({
    nombre: '',
    responsable: '',
    ubicacion: '',
    descripcion: '',
  });
  const [loading, setLoading] = useState(false);
  const [standList, setStandList] = useState([]);

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
      if (!response.ok || !contentType || !contentType.includes("application/json")) {
        throw new Error("Servidor no responde correctamente");
      }
      const data = await response.json();
      setStandList(data);
    } catch (error) {
      console.error('Error fetching stands', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL 
        ? (process.env.REACT_APP_API_URL.startsWith('http') 
            ? process.env.REACT_APP_API_URL 
            : `https://${process.env.REACT_APP_API_URL}`) 
        : 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/stands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al registrar estand');

      toast({
        title: '¡Estand Registrado!',
        description: 'El nuevo estand ha sido dado de alta correctamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setFormData({ nombre: '', responsable: '', ubicacion: '', descripcion: '' });
      fetchStands();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo completar el registro.',
        status: 'error',
      });
    }
    setLoading(false);
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing="20px">
        {/* Registration Form */}
        <Card p="30px" bg={cardBg} borderRadius="20px" boxShadow="0px 18px 40px rgba(112, 144, 176, 0.12)">
          <VStack align="start" spacing="5px" mb="30px">
            <Text color={textColor} fontSize="24px" fontWeight="700">
              Alta de Estand
            </Text>
            <Text color={textColorSecondary} fontSize="md">
              Registre las mesas o puestos que participarán en la evaluación.
            </Text>
          </VStack>

          <form onSubmit={handleSubmit}>
            <VStack spacing="20px">
              <FormControl isRequired>
                <FormLabel fontWeight="700" color={textColor}>Nombre del Estand</FormLabel>
                <InputGroup>
                  <InputLeftElement children={<Icon as={MdStorefront} color={brandColor} />} />
                  <Input 
                    name="nombre" 
                    variant="auth"
                    bg={inputBg}
                    value={formData.nombre} 
                    onChange={handleChange} 
                    placeholder="Ej: Gastronomía Francesa I" 
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="700" color={textColor}>Responsable (Alumno/Equipo)</FormLabel>
                <InputGroup>
                  <InputLeftElement children={<Icon as={MdPerson} color={brandColor} />} />
                  <Input 
                    name="responsable" 
                    variant="auth"
                    bg={inputBg}
                    value={formData.responsable} 
                    onChange={handleChange} 
                    placeholder="Nombre del responsable..." 
                  />
                </InputGroup>
              </FormControl>

              <SimpleGrid columns={2} spacing="20px" w="100%">
                <FormControl>
                  <FormLabel fontWeight="700" color={textColor}>Ubicación / Mesa</FormLabel>
                  <InputGroup>
                    <InputLeftElement children={<Icon as={MdPlace} color={brandColor} />} />
                    <Input 
                      name="ubicacion" 
                      variant="auth"
                      bg={inputBg}
                      value={formData.ubicacion} 
                      onChange={handleChange} 
                      placeholder="Ej: Mesa 5" 
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                    <FormLabel fontWeight="700" color={textColor}>Descripción Corta</FormLabel>
                    <InputGroup>
                      <InputLeftElement children={<Icon as={MdDescription} color={brandColor} />} />
                      <Input 
                        name="descripcion" 
                        variant="auth"
                        bg={inputBg}
                        value={formData.descripcion} 
                        onChange={handleChange} 
                        placeholder="Platillo o tema..." 
                      />
                    </InputGroup>
                </FormControl>
              </SimpleGrid>

              <Button 
                type="submit" 
                variant="brand" 
                fontWeight="700" 
                h="55px" 
                w="100%"
                mt="10px" 
                borderRadius="15px"
                isLoading={loading}
                leftIcon={<Icon as={MdAddCircle} />}
              >
                Registrar Estand
              </Button>
            </VStack>
          </form>
        </Card>

        {/* Stand List Table */}
        <Card p="30px" bg={cardBg} borderRadius="20px" boxShadow="0px 18px 40px rgba(112, 144, 176, 0.12)" overflowX="auto">
          <Flex direction="column" mb="30px">
            <Text color={textColor} fontSize="22px" fontWeight="700">
              Estands Activos
            </Text>
            <Text color={textColorSecondary} fontSize="sm">
              Lista de todos los equipos participantes registrados.
            </Text>
          </Flex>
          
          <Table variant="simple" color="gray.500">
            <Thead>
              <Tr>
                <Th color="secondaryGray.400" fontSize="xs">Nombre / Tema</Th>
                <Th color="secondaryGray.400" fontSize="xs">Responsable</Th>
                <Th color="secondaryGray.400" fontSize="xs">Ubicación</Th>
                <Th color="secondaryGray.400" fontSize="xs">Estado</Th>
              </Tr>
            </Thead>
            <Tbody>
              {standList.map((stand) => (
                <Tr key={stand._id} _hover={{ bg: inputBg }}>
                  <Td>
                    <Text fontWeight="700" color={textColor}>{stand.nombre}</Text>
                    <Text fontSize="xs" color={textColorSecondary}>{stand.descripcion}</Text>
                  </Td>
                  <Td fontWeight="500">{stand.responsable}</Td>
                  <Td>
                    <Badge variant="soft" colorScheme="brand" borderRadius="5px">
                        {stand.ubicacion || 'N/A'}
                    </Badge>
                  </Td>
                  <Td>
                    <Flex align="center">
                        <Box h="8px" w="8px" bg="green.400" borderRadius="50%" mr="10px" />
                        <Text fontSize="sm" fontWeight="700" color={textColor}>Activo</Text>
                    </Flex>
                  </Td>
                </Tr>
              ))}
              {standList.length === 0 && (
                <Tr><Td colSpan={4} textAlign="center">No hay estands registrados aún.</Td></Tr>
              )}
            </Tbody>
          </Table>
        </Card>
      </SimpleGrid>
    </Box>
  );
}
