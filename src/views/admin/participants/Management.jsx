import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
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
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Badge,
  Spinner,
  Icon,
} from '@chakra-ui/react';
import { MdEdit, MdDelete, MdPersonSearch } from 'react-icons/md';

export default function ParticipantManagement() {
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    ciudad: '',
    municipio: '',
    genero: 'M',
    correo: '',
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';
  const cardBg = useColorModeValue('white', 'navy.800');
  const inputBg = useColorModeValue('secondaryGray.300', 'navy.900');
  const brandColor = useColorModeValue('brand.500', 'brand.400');
  const toast = useToast();

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL 
        ? (process.env.REACT_APP_API_URL.startsWith('http') 
            ? process.env.REACT_APP_API_URL 
            : `https://${process.env.REACT_APP_API_URL}`) 
        : 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/participants`);
      const contentType = response.headers.get("content-type");
      if (!response.ok || !contentType || !contentType.includes("application/json")) {
        throw new Error("Servidor no responde correctamente");
      }
      const data = await response.json();
      setParticipants(data);
    } catch (error) {
      console.error('Error fetching participants', error);
    }
    setLoading(false);
  };

  const filteredParticipants = participants.filter(p => 
    `${p.nombre} ${p.apellidoPaterno}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user) => {
    setEditUser(user);
    setFormData(user);
    onOpen();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este participante?')) return;
    try {
      const API_URL = process.env.REACT_APP_API_URL 
        ? (process.env.REACT_APP_API_URL.startsWith('http') 
            ? process.env.REACT_APP_API_URL 
            : `https://${process.env.REACT_APP_API_URL}`) 
        : 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/participants/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast({ title: 'Participante eliminado', status: 'success' });
        fetchParticipants();
      }
    } catch (error) {
      toast({ title: 'Error al eliminar', status: 'error' });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const API_URL = process.env.REACT_APP_API_URL 
        ? (process.env.REACT_APP_API_URL.startsWith('http') 
            ? process.env.REACT_APP_API_URL 
            : `https://${process.env.REACT_APP_API_URL}`) 
        : 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/participants/${editUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast({ title: 'Participante actualizado', status: 'success' });
        onClose();
        fetchParticipants();
      }
    } catch (error) {
      toast({ title: 'Error al actualizar', status: 'error' });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card p="25px" bg={cardBg} borderRadius="20px" boxShadow="0px 18px 40px rgba(112, 144, 176, 0.12)">
        <Flex align={{ base: 'start', md: 'center' }} justify="space-between" mb="30px" direction={{ base: 'column', md: 'row' }}>
          <Box mb={{ base: '20px', md: '0' }}>
            <Text color={textColor} fontSize="22px" fontWeight="700">
              Gestión de Base de Datos
            </Text>
            <Text color={textColorSecondary} fontSize="sm">
              Listado completo de participantes registrados en el evento.
            </Text>
          </Box>
          <Flex align="center" bg={inputBg} p="10px" borderRadius="15px" w={{ base: '100%', md: '300px' }}>
            <Icon as={MdPersonSearch} color={brandColor} mr="10px" />
            <Input 
                variant="unstyled" 
                placeholder="Buscar por nombre o correo..." 
                fontSize="sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Flex>
        </Flex>

        {loading ? (
          <Flex justify="center" p="50px"><Spinner size="xl" color="brand.500" /></Flex>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple" color="gray.500">
              <Thead>
                <Tr>
                  <Th color="secondaryGray.400" fontSize="xs">Nombre Completo</Th>
                  <Th color="secondaryGray.400" fontSize="xs">Correo Electrónico</Th>
                  <Th color="secondaryGray.400" fontSize="xs">Ubicación</Th>
                  <Th color="secondaryGray.400" fontSize="xs">Género</Th>
                  <Th color="secondaryGray.400" fontSize="xs" textAlign="center">Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredParticipants.map((user) => (
                  <Tr key={user._id} _hover={{ bg: inputBg }}>
                    <Td>
                      <Text fontWeight="700" color={textColor}>{user.nombre} {user.apellidoPaterno} {user.apellidoMaterno}</Text>
                    </Td>
                    <Td>
                      <Text fontWeight="500">{user.correo}</Text>
                    </Td>
                    <Td>
                      <Badge variant="subtle" colorScheme="brand" borderRadius="5px">
                        {user.ciudad}, {user.municipio}
                      </Badge>
                    </Td>
                    <Td>
                        <Text fontWeight="500">{user.genero === 'M' ? 'Masc' : user.genero === 'F' ? 'Fem' : 'Otro'}</Text>
                    </Td>
                    <Td textAlign="center">
                      <IconButton
                        icon={<MdEdit />}
                        variant="soft"
                        colorScheme="brand"
                        mr="10px"
                        borderRadius="10px"
                        onClick={() => handleEdit(user)}
                      />
                      <IconButton
                        icon={<MdDelete />}
                        variant="soft"
                        colorScheme="red"
                        borderRadius="10px"
                        onClick={() => handleDelete(user._id)}
                      />
                    </Td>
                  </Tr>
                ))}
                {filteredParticipants.length === 0 && (
                    <Tr><Td colSpan={5} textAlign="center" py="40px">No se encontraron participantes.</Td></Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        )}
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg={cardBg} borderRadius="20px">
          <ModalHeader color={textColor} fontWeight="800">Editar Perfil del Participante</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleUpdate}>
            <ModalBody>
              <SimpleGrid columns={2} spacing="20px">
                <FormControl isRequired>
                  <FormLabel fontWeight="bold">Nombre</FormLabel>
                  <Input name="nombre" bg={inputBg} variant="auth" value={formData.nombre} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontWeight="bold">Paterno</FormLabel>
                  <Input name="apellidoPaterno" bg={inputBg} variant="auth" value={formData.apellidoPaterno} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontWeight="bold">Materno</FormLabel>
                  <Input name="apellidoMaterno" bg={inputBg} variant="auth" value={formData.apellidoMaterno} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontWeight="bold">Correo</FormLabel>
                  <Input name="correo" type="email" bg={inputBg} variant="auth" value={formData.correo} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontWeight="bold">Ciudad</FormLabel>
                  <Input name="ciudad" bg={inputBg} variant="auth" value={formData.ciudad} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontWeight="bold">Municipio</FormLabel>
                  <Input name="municipio" bg={inputBg} variant="auth" value={formData.municipio} onChange={handleChange} />
                </FormControl>
              </SimpleGrid>
            </ModalBody>
            <ModalFooter mt="20px">
              <Button colorScheme="brand" mr={3} borderRadius="15px" h="45px" w="120px" type="submit">
                Guardar
              </Button>
              <Button onClick={onClose} variant="ghost" borderRadius="15px">Cancelar</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}
