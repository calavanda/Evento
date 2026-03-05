import React, { useState, useEffect, useRef } from 'react';
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
  IconButton,
  Tooltip,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { 
  MdStorefront, 
  MdPerson, 
  MdPlace, 
  MdDescription, 
  MdAddCircle,
  MdEdit,
  MdDelete,
  MdUpdate
} from 'react-icons/md';
import { getApiUrl } from 'utils/api';

export default function StandManagement() {
  const [formData, setFormData] = useState({
    nombre: '',
    responsable: '',
    ubicacion: '',
    descripcion: '',
  });
  const [loading, setLoading] = useState(false);
  const [standList, setStandList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  // AlertDialog state
  const [isOpen, setIsOpen] = useState(false);
  const [standToDelete, setStandToDelete] = useState(null);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';
  const cardBg = useColorModeValue('white', 'navy.800');
  const brandColor = useColorModeValue('brand.500', 'brand.400');
  const inputBg = useColorModeValue('secondaryGray.300', 'navy.900');
  const toast = useToast();




  const fetchStands = React.useCallback(async () => {
    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/stands`);
      const contentType = response.headers.get("content-type");
      if (!response.ok || !contentType || !contentType.includes("application/json")) {
        throw new Error("Servidor no responde correctamente");
      }
      const data = await response.json();
      setStandList(data);
    } catch (error) {
      console.error('Error al obtener los stands', error);
    }
  }, []);

  useEffect(() => {
    fetchStands();
  }, [fetchStands]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (stand) => {
    setEditingId(stand._id);
    setFormData({
      nombre: stand.nombre,
      responsable: stand.responsable,
      ubicacion: stand.ubicacion || '',
      descripcion: stand.descripcion || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ nombre: '', responsable: '', ubicacion: '', descripcion: '' });
  };

  const confirmDelete = (stand) => {
    setStandToDelete(stand);
    setIsOpen(true);
  };

  const handleDelete = async () => {
    if (!standToDelete) return;
    setLoading(true);
    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/stands/${standToDelete._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar stand');

      toast({
        title: 'Stand eliminado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchStands();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el stand.',
        status: 'error',
      });
    }
    setLoading(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_URL = getApiUrl();
      const url = editingId ? `${API_URL}/api/stands/${editingId}` : `${API_URL}/api/stands`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Error al ${editingId ? 'actualizar' : 'registrar'} stand`);

      toast({
        title: editingId ? '¡Stand Actualizado!' : '¡Stand Registrado!',
        description: editingId ? 'Los cambios han sido guardados.' : 'El nuevo stand ha sido dado de alta correctamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setFormData({ nombre: '', responsable: '', ubicacion: '', descripcion: '' });
      setEditingId(null);
      fetchStands();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
      });
    }
    setLoading(false);
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing="20px">
        {/* Registro/Edición de Stand */}
        <Card p="30px" bg={cardBg} borderRadius="20px" boxShadow="0px 18px 40px rgba(112, 144, 176, 0.12)">
          <VStack align="start" spacing="5px" mb="30px">
            <Text color={textColor} fontSize="24px" fontWeight="700">
              {editingId ? 'Editar Stand' : 'Alta de Stand'}
            </Text>
            <Text color={textColorSecondary} fontSize="md">
              {editingId ? 'Modifique los datos del equipo seleccionado.' : 'Registre las mesas o puestos que participarán en la evaluación.'}
            </Text>
          </VStack>

          <form onSubmit={handleSubmit}>
            <VStack spacing="20px">
              <FormControl isRequired>
                <FormLabel fontWeight="700" color={textColor}>Nombre del Stand</FormLabel>
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

              <Flex w="100%" gap="10px">
                {editingId && (
                  <Button 
                    variant="ghost" 
                    colorScheme="red"
                    fontWeight="700" 
                    h="55px" 
                    w="30%"
                    borderRadius="15px"
                    onClick={cancelEdit}
                  >
                    Cancelar
                  </Button>
                )}
                <Button 
                  type="submit" 
                  variant="brand" 
                  fontWeight="700" 
                  h="55px" 
                  w={editingId ? "70%" : "100%"}
                  mt={editingId ? "0" : "10px"} 
                  borderRadius="15px"
                  isLoading={loading}
                  leftIcon={<Icon as={editingId ? MdUpdate : MdAddCircle} />}
                >
                  {editingId ? 'Actualizar Stand' : 'Registrar Stand'}
                </Button>
              </Flex>
            </VStack>
          </form>
        </Card>

        {/* Tabla de stands */}
        <Card p="30px" bg={cardBg} borderRadius="20px" boxShadow="0px 18px 40px rgba(112, 144, 176, 0.12)" overflowX="auto">
          <Flex direction="column" mb="30px">
            <Text color={textColor} fontSize="22px" fontWeight="700">
              Stands Activos
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
                <Th color="secondaryGray.400" fontSize="xs">Acciones</Th>
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
                    <Flex gap="5px">
                      <Tooltip label="Editar">
                        <IconButton
                          icon={<Icon as={MdEdit} />}
                          variant="ghost"
                          colorScheme="brand"
                          onClick={() => handleEdit(stand)}
                          size="sm"
                        />
                      </Tooltip>
                      <Tooltip label="Eliminar">
                        <IconButton
                          icon={<Icon as={MdDelete} />}
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => confirmDelete(stand)}
                          size="sm"
                        />
                      </Tooltip>
                    </Flex>
                  </Td>
                </Tr>
              ))}
              {standList.length === 0 && (
                <Tr><Td colSpan={4} textAlign="center">No hay stands registrados aún.</Td></Tr>
              )}
            </Tbody>
          </Table>
        </Card>
      </SimpleGrid>

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="20px" bg={cardBg}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar Stand
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Está seguro de que desea eliminar el stand <strong>{standToDelete?.nombre}</strong>? Esta acción no se puede deshacer.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} borderRadius="10px">
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3} borderRadius="10px">
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
