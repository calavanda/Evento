import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  useColorModeValue,
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
  VStack,
} from '@chakra-ui/react';
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md';
import { getApiUrl } from 'utils/api';

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editAdmin, setEditAdmin] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol: 'escaneador',
    activo: true,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.800');
  const inputBg = useColorModeValue('secondaryGray.300', 'navy.900');
  const toast = useToast();

  const fetchAdmins = useCallback(async () => {
    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/admins`);
      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error('Error fetching admins', error);
      toast({ title: 'Error al obtener administradores', status: 'error' });
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleOpenModal = (admin = null) => {
    if (admin) {
      setEditAdmin(admin);
      setFormData({
        nombre: admin.nombre,
        email: admin.email,
        rol: admin.rol,
        activo: admin.activo,
      });
    } else {
      setEditAdmin(null);
      setFormData({
        nombre: '',
        email: '',
        rol: 'escaneador',
        activo: true,
      });
    }
    onOpen();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = getApiUrl();
      const url = editAdmin ? `${API_URL}/api/admins/${editAdmin._id}` : `${API_URL}/api/admins`;
      const method = editAdmin ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({ title: `Admin ${editAdmin ? 'actualizado' : 'registrado'}`, status: 'success' });
        onClose();
        fetchAdmins();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la petición');
      }
    } catch (error) {
      toast({ title: 'Error', description: error.message, status: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este administrador?')) return;
    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/admins/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast({ title: 'Admin eliminado', status: 'success' });
        fetchAdmins();
      }
    } catch (error) {
      toast({ title: 'Error al eliminar', status: 'error' });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card p="25px" bg={cardBg} borderRadius="20px">
        <Flex align="center" justify="space-between" mb="30px">
          <Box>
            <Text color={textColor} fontSize="22px" fontWeight="700">
              Gestión de Administradores
            </Text>
            <Text color="secondaryGray.600" fontSize="sm">
              Control de acceso y roles para el panel.
            </Text>
          </Box>
          <Button
            leftIcon={<MdAdd />}
            colorScheme="brand"
            borderRadius="15px"
            onClick={() => handleOpenModal()}
          >
            Nuevo Admin
          </Button>
        </Flex>

        {loading ? (
          <Flex justify="center" p="50px"><Spinner size="xl" color="brand.500" /></Flex>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Nombre</Th>
                  <Th>Email</Th>
                  <Th>Rol</Th>
                  <Th>Estado</Th>
                  <Th textAlign="center">Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {admins.map((admin) => (
                  <Tr key={admin._id}>
                    <Td><Text fontWeight="700" color={textColor}>{admin.nombre}</Text></Td>
                    <Td>{admin.email}</Td>
                    <Td>
                      <Badge colorScheme={admin.rol === 'admin' ? 'purple' : admin.rol === 'moderador' ? 'blue' : 'orange'}>
                        {admin.rol.toUpperCase()}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={admin.activo ? 'green' : 'red'}>
                        {admin.activo ? 'ACTIVO' : 'INACTIVO'}
                      </Badge>
                    </Td>
                    <Td textAlign="center">
                      <IconButton icon={<MdEdit />} variant="soft" colorScheme="brand" mr="10px" onClick={() => handleOpenModal(admin)} />
                      <IconButton icon={<MdDelete />} variant="soft" colorScheme="red" onClick={() => handleDelete(admin._id)} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={cardBg}>
          <ModalHeader color={textColor}>{editAdmin ? 'Editar Administrador' : 'Nuevo Administrador'}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing="20px">
                <FormControl isRequired>
                  <FormLabel>Nombre completo</FormLabel>
                  <Input name="nombre" value={formData.nombre} onChange={handleChange} bg={inputBg} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Correo electrónico</FormLabel>
                  <Input name="email" type="email" value={formData.email} onChange={handleChange} bg={inputBg} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Rol asignado</FormLabel>
                  <Select name="rol" value={formData.rol} onChange={handleChange} bg={inputBg}>
                    <option value="admin">Administrador (Todo)</option>
                    <option value="moderador">Moderador (Participantes/Stands)</option>
                    <option value="escaneador">Escaneador/Encuestador</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="brand" mr={3} type="submit">Guardar</Button>
              <Button onClick={onClose} variant="ghost">Cancelar</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}
