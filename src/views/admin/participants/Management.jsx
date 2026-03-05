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
  VStack,
  HStack,
} from '@chakra-ui/react';
import { MdEdit, MdDelete, MdPersonSearch, MdHistory, MdTimeline, MdRefresh, MdPrint } from 'react-icons/md';
import Chart from 'react-apexcharts';
import { getApiUrl } from 'utils/api';
const logoFrancophonie = '/logo_francophonie.png';
const utgzLogo = '/utgz.png';

export default function ParticipantManagement() {
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    municipio: '',
    genero: 'M',
    correo: '',
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isHistoryOpen, 
    onOpen: onHistoryOpen, 
    onClose: onHistoryClose 
  } = useDisclosure();
  
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
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
      const API_URL = getApiUrl();
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
      const API_URL = getApiUrl();
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
      const API_URL = getApiUrl();
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

  const resetZoom = (id) => {
    if (window.ApexCharts) {
        window.ApexCharts.exec(id, 'resetZoom');
    }
  };

  const handleHistory = async (user) => {
    setSelectedUser(user);
    setHistoryLoading(true);
    onHistoryOpen();
    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/reports/participant-history/${user._id}`);
      if (response.ok) {
        const data = await response.json();
        setHistoryData(data);
      }
    } catch (error) {
      toast({ title: 'Error al obtener historial', status: 'error' });
    }
    setHistoryLoading(false);
  };

  const historyChartOptions = {
    chart: { 
        id: 'history-chart',
        type: 'line', 
        toolbar: { 
            show: true,
            tools: {
                download: false,
                selection: false,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: false,
                reset: true
            }
        }, 
        fontFamily: 'Inter, sans-serif' 
    },
    xaxis: { 
      categories: historyData.map(h => new Date(h.escaneadoEn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
      labels: { style: { colors: '#A3AED0' } }
    },
    stroke: { curve: 'stepline', width: 3 },
    markers: { size: 6, colors: ['#4318FF'], strokeWidth: 2, hover: { size: 8 } },
    colors: ['#4318FF'],
    tooltip: {
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const item = historyData[dataPointIndex];
        return '<div class="chart-tooltip">' +
          '<span>' + item.estand.nombre + '</span><br>' +
          '<span>' + new Date(item.escaneadoEn).toLocaleTimeString() + '</span>' +
          '</div>';
      }
    },
    grid: { borderColor: '#E0E5F2', strokeDashArray: 5 }
  };

  const handlePrint = (user) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(user.codigoQR)}&size=200x200&color=4318FF`;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Identificación Oficial - ${user.nombre}</title>
          <base href="${window.location.origin}">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap');
            body { 
              font-family: 'Inter', sans-serif; 
              text-align: center; 
              background: #f4f7fe; 
              padding: 0;
              margin: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .badge { 
              background: white;
              border: 1px solid #e0e5f2; 
              padding: 40px; 
              display: inline-block; 
              border-radius: 20px; 
              width: 380px; 
              box-shadow: 0px 18px 40px rgba(112, 144, 176, 0.12);
              position: relative;
              overflow: hidden;
              margin-top: 50px;
            }
            .header-strip { 
              background: #4318FF !important; 
              color: white; 
              padding: 12px; 
              margin: -40px -40px 30px -40px; 
              font-weight: 800;
              letter-spacing: 1px;
              font-size: 14px;
            }
            .logos-container {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 25px;
              padding: 0 10px;
            }
            .logo-img {
              height: 50px;
              width: auto;
              object-fit: contain;
            }
            .name { 
              font-size: 28px; 
              font-weight: 800; 
              color: #1B254B; 
              margin: 10px 0; 
              text-transform: uppercase;
              line-height: 1.1;
            }
            .location { 
              font-size: 16px; 
              color: #707EAE; 
              margin-bottom: 25px;
              font-weight: 500;
            }
            .qr-container { 
              background: #F4F7FE !important; 
              padding: 25px; 
              border-radius: 20px; 
              display: inline-block;
              margin-bottom: 25px;
            }
            .qr-img { width: 180px; height: 180px; }
            .footer { 
              margin-top: 10px; 
              font-size: 13px; 
              color: #707EAE; 
              border-top: 1px dashed #E0E5F2; 
              padding-top: 15px;
              font-weight: 500;
            }
          </style>
        </head>
        <body onload="setTimeout(() => { window.print(); window.close(); }, 500)">
          <div class="badge">
            <div class="header-strip">IDENTIFICACIÓN OFICIAL</div>
            <div class="logos-container">
              <img src="${logoFrancophonie}" class="logo-img" />
              <img src="${utgzLogo}" class="logo-img" />
            </div>
            <div class="name">${user.nombre}<br>${user.apellidoPaterno}</div>
            <div class="location">${user.municipio}</div>
            <div class="qr-container">
                <img src="${qrUrl}" class="qr-img" />
            </div>
            <div class="footer">${user.correo}</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
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
                        {user.municipio}
                      </Badge>
                    </Td>
                    <Td>
                        <Text fontWeight="500">{user.genero === 'M' ? 'Masc' : user.genero === 'F' ? 'Fem' : 'Otro'}</Text>
                    </Td>
                    <Td textAlign="center">
                      <IconButton
                        icon={<MdHistory />}
                        variant="soft"
                        colorScheme="blue"
                        mr="10px"
                        borderRadius="10px"
                        onClick={() => handleHistory(user)}
                        title="Ver Historial"
                      />
                      <IconButton
                        icon={<MdPrint />}
                        variant="soft"
                        colorScheme="brand"
                        mr="10px"
                        borderRadius="10px"
                        onClick={() => handlePrint(user)}
                        title="Imprimir Gafete"
                      />
                      <IconButton
                        icon={<MdEdit />}
                        variant="soft"
                        colorScheme="brand"
                        mr="10px"
                        borderRadius="10px"
                        onClick={() => handleEdit(user)}
                        title="Editar"
                      />
                      <IconButton
                        icon={<MdDelete />}
                        variant="soft"
                        colorScheme="red"
                        borderRadius="10px"
                        onClick={() => handleDelete(user._id)}
                        title="Eliminar"
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

      {/* Modal de Historial */}
      <Modal isOpen={isHistoryOpen} onClose={onHistoryClose} size="3xl">
        <ModalOverlay />
        <ModalContent bg={cardBg} borderRadius="20px">
          <ModalHeader color={textColor} fontWeight="800">Recorrido de {selectedUser?.nombre}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="30px">
            {historyLoading ? (
              <Flex justify="center" p="50px"><Spinner size="xl" color="brand.500" /></Flex>
            ) : historyData.length > 0 ? (
              <VStack spacing="30px" align="stretch">
                <Box p="20px" bg={inputBg} borderRadius="15px">
                   <Flex justify="space-between" align="center" mb="20px">
                    <Flex align="center">
                        <Icon as={MdTimeline} color={brandColor} mr="10px" />
                        <Text fontWeight="700">Cronología de Visitas</Text>
                    </Flex>
                    <Button 
                        onClick={() => resetZoom('history-chart')}
                        leftIcon={<MdRefresh />}
                        variant="soft" 
                        size="sm"
                        colorScheme="brand"
                    >
                        Reiniciar
                    </Button>
                  </Flex>
                  <Chart
                    options={historyChartOptions}
                    series={[{ name: 'Estand', data: historyData.map((_, i) => i + 1) }]}
                    type="line"
                    height="250px"
                  />
                </Box>
                
                <Box>
                  <Text fontWeight="700" mb="15px">Detalle de Visitas</Text>
                  <VStack spacing="10px" align="stretch">
                    {historyData.map((visit, index) => (
                      <Flex key={index} justify="space-between" p="15px" bg={inputBg} borderRadius="12px">
                        <HStack spacing="15px">
                          <Badge colorScheme="brand" boxSize="24px" display="flex" alignItems="center" justifyContent="center" borderRadius="full">
                            {index + 1}
                          </Badge>
                          <Text fontWeight="700">{visit.estand.nombre}</Text>
                        </HStack>
                        <Text color={textColorSecondary} fontSize="sm">
                          {new Date(visit.escaneadoEn).toLocaleTimeString()}
                        </Text>
                      </Flex>
                    ))}
                  </VStack>
                </Box>
              </VStack>
            ) : (
              <Flex direction="column" align="center" p="40px">
                <Icon as={MdHistory} w="50px" h="50px" color="gray.300" mb="20px" />
                <Text color="gray.500">Este participante aún no tiene visitas registradas.</Text>
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
