import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
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
  SimpleGrid,
  useToast,
  Card,
  Icon,
  InputGroup,
  InputLeftElement,
  VStack,
  Image,
} from '@chakra-ui/react';

import { 
  MdPerson, 
  MdEmail,
  MdWc, 
  MdPrint,
  MdQrCode,
  MdFileUpload
} from 'react-icons/md';
import { getApiUrl } from 'utils/api';
// Usamos rutas estáticas desde /public para evitar problemas de CSP con el bundle
const logoFrancophonie = '/logo_francophonie.png';
const utgzLogo = '/utgz.png';

export default function ParticipantRegister() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    municipio: '',
    genero: 'M',
    correo: '',
  });
  const [qrBase64, setQrBase64] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
    
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';
  const cardBg = useColorModeValue('white', 'navy.800');
  const cardShadow = useColorModeValue('0px 18px 40px rgba(112, 144, 176, 0.12)', 'unset');
  const brandColor = useColorModeValue('brand.500', 'brand.400');
  const inputBg = useColorModeValue('secondaryGray.300', 'navy.900');
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExcelImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = evt.target.result;
        const wb = XLSX.read(data, { type: 'array' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const json = XLSX.utils.sheet_to_json(ws);

        if (json.length === 0) {
          throw new Error("El archivo Excel está vacío.");
        }

        const API_URL = getApiUrl();
        
        const normalize = (str) => 
          str ? str.toString().toLowerCase().trim().replace(/\s+/g, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';

        const guests = json.map(row => {
          const rowKeys = Object.keys(row);
          const findVal = (aliases) => {
            const key = rowKeys.find(k => aliases.includes(normalize(k)));
            return key ? row[key] : '';
          };

          return {
            nombre: findVal(['nombre', 'name', 'nombrecompleto', 'first name']),
            apellidoPaterno: findVal(['apellidopaterno', 'paterno', 'lastname', 'apellido1']),
            apellidoMaterno: findVal(['apellidomaterno', 'materno', 'apellido2']),
            municipio: findVal(['municipio', 'ciudad', 'city', 'location', 'procedencia']),
            genero: (findVal(['genero', 'gender', 'sexo']) || 'M').toString().toUpperCase().startsWith('F') ? 'F' : 'M',
            correo: findVal(['correo', 'email', 'correoelectronico', 'contacto']),
          };
        }).filter(g => g.nombre && g.correo);

        if (guests.length === 0) {
          throw new Error("No se encontraron registros válidos para importar.");
        }

        const resp = await fetch(`${API_URL}/api/participants/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(guests),
        });

        if (!resp.ok) {
          const errorData = await resp.json();
          throw new Error(errorData.error || "Error al importar los datos.");
        }

        const result = await resp.json();

        toast({
          title: 'Importación Exitosa',
          description: result.mensaje || `Se importaron ${result.count} participantes.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

      } catch (error) {
        toast({
          title: 'Error al importar Excel',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setQrBase64(''); // Limpia el QR anterior
    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("El servidor no respondió correctamente. Asegúrese de que el backend esté ejecutándose.");
      }

      const participant = await response.json();
      
      if (!response.ok) {
        throw new Error(participant.error || 'Error en el registro');
      }

      // Usando la API de goQR.me en lugar de la biblioteca local
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(participant.codigoQR)}&size=200x200&color=4318FF`;
      setQrBase64(qrUrl);

      toast({
        title: '¡Registro Exitoso!',
        description: `${participant.nombre} ha sido registrado.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error de Registro',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const printBadge = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Identificación Oficial - ${formData.nombre}</title>
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
            <div class="name">${formData.nombre}<br>${formData.apellidoPaterno}</div>
            <div class="location">${formData.municipio}</div>
            <div class="qr-container">
                <img src="${qrBase64}" class="qr-img" />
            </div>
            <div class="footer">${formData.correo}</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="20px">
        {/* Formulario */}
        <Card p="30px" bg={cardBg} boxShadow={cardShadow} borderRadius="20px">
          <VStack align="start" spacing="5px" mb="30px">
            <Text color={textColor} fontSize="24px" fontWeight="700">
              Registro de Participante
            </Text>
            <Text color={textColorSecondary} fontSize="md">
              Complete los datos del asistente para generar su identificación.
            </Text>
            <Button
              variant="outline"
              colorScheme="brand"
              leftIcon={<Icon as={MdFileUpload} />}
              onClick={() => fileInputRef.current?.click()}
              size="sm"
              mt="10px"
              isLoading={loading}
            >
              Importar desde Excel
            </Button>
            <input
              type="file"
              accept=".xlsx, .xls"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleExcelImport}
            />
          </VStack>

          <form onSubmit={handleSubmit}>
            <VStack spacing="20px">
              <FormControl isRequired>
                <FormLabel color={textColor} fontWeight="bold">Nombre</FormLabel>
                <InputGroup>
                  <InputLeftElement children={<Icon as={MdPerson} color={brandColor} />} />
                  <Input 
                    name="nombre" 
                    variant="auth"
                    bg={inputBg}
                    value={formData.nombre} 
                    onChange={handleChange} 
                    placeholder="Escriba el nombre..." 
                  />
                </InputGroup>
              </FormControl>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px" w="100%">
                <FormControl isRequired>
                  <FormLabel color={textColor} fontWeight="bold">Apellido Paterno</FormLabel>
                  <Input 
                    name="apellidoPaterno" 
                    variant="auth"
                    bg={inputBg}
                    value={formData.apellidoPaterno} 
                    onChange={handleChange} 
                    placeholder="Paterno" 
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color={textColor} fontWeight="bold">Apellido Materno</FormLabel>
                  <Input 
                    name="apellidoMaterno" 
                    variant="auth"
                    bg={inputBg}
                    value={formData.apellidoMaterno} 
                    onChange={handleChange} 
                    placeholder="Materno" 
                  />
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px" w="100%">
                <FormControl isRequired>
                  <FormLabel color={textColor} fontWeight="bold">Municipio</FormLabel>
                  <Input 
                    name="municipio" 
                    variant="auth"
                    bg={inputBg}
                    value={formData.municipio} 
                    onChange={handleChange} 
                    placeholder="Municipio" 
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color={textColor} fontWeight="bold">Género</FormLabel>
                  <InputGroup>
                    <InputLeftElement children={<Icon as={MdWc} color={brandColor} />} />
                    <Select 
                      name="genero" 
                      variant="auth"
                      bg={inputBg}
                      value={formData.genero} 
                      onChange={handleChange}
                      ps="40px"
                    >
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                      <option value="Other">Otro</option>
                    </Select>
                  </InputGroup>
                </FormControl>
              </SimpleGrid>

              <FormControl isRequired>
                <FormLabel color={textColor} fontWeight="bold">Correo Electrónico</FormLabel>
                <InputGroup>
                  <InputLeftElement children={<Icon as={MdEmail} color={brandColor} />} />
                  <Input 
                    name="correo" 
                    type="email" 
                    variant="auth"
                    bg={inputBg}
                    value={formData.correo} 
                    onChange={handleChange} 
                    placeholder="usuario@correo.com" 
                  />
                </InputGroup>
              </FormControl>


              <Button 
                type="submit" 
                variant="brand" 
                fontWeight="700" 
                h="50px" 
                w="100%"
                mt="10px" 
                borderRadius="15px"
                isLoading={loading}
                leftIcon={<Icon as={MdQrCode} />}
              >
                Registrar y Generar Identificación
              </Button>
            </VStack>
          </form>
        </Card>

        {/* Vista previa de la identificación */}
        <Flex direction="column" align="center" justify="center">
          {qrBase64 ? (
            <Card p="40px" bg={cardBg} boxShadow={cardShadow} borderRadius="20px" align="center" w="100%" maxW="420px">
              <Box 
                bg={brandColor} 
                w="110%" 
                mt="-40px" 
                p="15px" 
                borderRadius="20px 20px 0 0" 
                textAlign="center"
              >
                <Text color="white" fontWeight="800" letterSpacing="1px">IDENTIFICACIÓN OFICIAL</Text>
              </Box>
              
              <Flex justify="space-between" align="center" w="100%" mt="25px" mb="15px">
                <Image src={logoFrancophonie} h="45px" objectFit="contain" />
                <Image src={utgzLogo} h="45px" objectFit="contain" />
              </Flex>

              <VStack spacing="5px" mb="20px">
                <Text color={textColor} fontSize="28px" fontWeight="800" textAlign="center" lineHeight="1.1" textTransform="uppercase">
                  {formData.nombre}<br/>{formData.apellidoPaterno}
                </Text>
                <Text color={textColorSecondary} fontSize="md" fontWeight="500">
                  {formData.municipio}
                </Text>
              </VStack>

              <Box bg={inputBg} p="20px" borderRadius="20px" mb="30px">
                <Image src={qrBase64} alt="QR Code" w="180px" h="180px" />
              </Box>

              <Text color={textColorSecondary} fontSize="sm" mb="25px" borderTop="1px dashed" borderColor="gray.200" pt="15px" w="100%" textAlign="center" fontWeight="500">
                {formData.correo}
              </Text>

              <Button 
                leftIcon={<Icon as={MdPrint} />} 
                colorScheme="brand" 
                variant="solid" 
                w="100%"
                h="50px"
                borderRadius="15px"
                boxShadow="0px 10px 20px rgba(67, 24, 255, 0.2)"
                onClick={printBadge}
              >
                Imprimir Gafete
              </Button>
            </Card>
          ) : (
            <Flex 
              direction="column" 
              align="center" 
              justify="center" 
              p="60px" 
              bg={cardBg} 
              borderRadius="20px" 
              border="2px dashed" 
              borderColor="secondaryGray.400"
              w="100%"
              h="100%"
            >
              <Icon as={MdQrCode} w="60px" h="60px" color="secondaryGray.400" mb="20px" />
              <Text color="secondaryGray.500" fontWeight="600" textAlign="center">
                Complete el registro para visualizar la vista previa del gafete.
              </Text>
            </Flex>
          )}
        </Flex>
      </SimpleGrid>
    </Box>
  );
}
