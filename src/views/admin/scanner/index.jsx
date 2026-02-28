import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Text,
  useColorModeValue,
  useToast,
  Card,
  VStack,
  HStack,
  Icon,
  Flex,
  Badge,
  Circle,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Image,
  Spinner,
} from '@chakra-ui/react';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  MdQrCodeScanner, MdStorefront, MdCheckCircle, MdError, 
  MdCameraAlt, MdStop, MdCameraswitch, MdUploadFile, MdRefresh 
} from 'react-icons/md';

export default function VisitScanner() {
  const [stands, setStands] = useState([]);
  const [selectedStand, setSelectedStand] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';
  const cardBg = useColorModeValue('white', 'navy.800');
  const brandColor = useColorModeValue('brand.500', 'brand.400');
  const successBg = useColorModeValue('green.50', 'green.900');
  const errorBg = useColorModeValue('red.50', 'red.900');
  const inputBg = useColorModeValue('secondaryGray.300', 'navy.900');
  const toast = useToast();

  useEffect(() => {
    fetchStands();
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length > 0) {
        setCameras(devices);
        const backCamera = devices.find(d => 
          d.label.toLowerCase().includes('back') || 
          d.label.toLowerCase().includes('trasera') || 
          d.label.toLowerCase().includes('rear')
        );
        setSelectedCamera(backCamera ? backCamera.id : devices[0].id);
      }
    }).catch(err => console.warn('Could not enumerate cameras:', err));

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        throw new Error("Servidor no responde correctamente");
      }
      const data = await response.json();
      setStands(data);
      if (data.length > 0) setSelectedStand(data[0]._id);
    } catch (error) {
      console.error('Error fetching stands', error);
    }
  };

  // ── Camera scanning ──
  const startScanner = async () => {
    if (!selectedStand) {
      toast({ title: 'Selecciona un estand primero', status: 'warning' });
      return;
    }
    setScanResult(null);
    setScanning(true);

    setTimeout(async () => {
      try {
        const html5Qrcode = new Html5Qrcode('reader');
        scannerRef.current = html5Qrcode;

        const config = { 
          fps: 10, 
          qrbox: function(viewfinderWidth, viewfinderHeight) {
            // Make qrbox 70% of the smallest dimension
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const qrboxSize = Math.floor(minEdge * 0.7);
            return { width: qrboxSize, height: qrboxSize };
          },
          aspectRatio: 1.0,
          disableFlip: false,
        };

        // Use selected camera ID, or fallback to environment (back camera)
        const cameraId = selectedCamera || { facingMode: "environment" };

        await html5Qrcode.start(cameraId, config,
          (decodedText) => {
            console.log('✅ QR Decodificado:', decodedText);
            html5Qrcode.stop().then(() => {
              scannerRef.current = null;
              setScanning(false);
              handleScan(decodedText);
            }).catch(err => console.error('Error stopping scanner:', err));
          },
          (errorMessage) => {
            // This fires continuously when no QR is found — ignore silently
          }
        );
        console.log('📷 Cámara activada correctamente');
      } catch (err) {
        setScanning(false);
        console.error('Camera error:', err);
        toast({
          title: 'Error al acceder a la cámara',
          description: String(err),
          status: 'error', duration: 8000, isClosable: true,
        });
      }
    }, 300);
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop().catch(() => {});
      scannerRef.current = null;
    }
    setScanning(false);
  };

  // ── Image upload scanning via goQR.me API ──
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!selectedStand) {
      toast({ title: 'Selecciona un estand primero', status: 'warning' });
      return;
    }

    // Show preview
    const previewUrl = URL.createObjectURL(file);
    setUploadPreview(previewUrl);
    setUploadLoading(true);
    setScanResult(null);

    try {
      // Send image to goQR.me read API
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      const qrData = result?.[0]?.symbol?.[0]?.data;
      const qrError = result?.[0]?.symbol?.[0]?.error;

      if (qrError || !qrData) {
        throw new Error(qrError || 'No se pudo leer el código QR de la imagen.');
      }

      // QR decoded successfully, now register the visit
      handleScan(qrData);
    } catch (error) {
      setScanResult({ success: false, error: error.message });
      toast({
        title: 'Error al leer QR',
        description: error.message,
        status: 'error', duration: 5000, isClosable: true,
      });
    }
    setUploadLoading(false);
  };

  // ── Visit registration (shared by both methods) ──
  const handleScan = async (qrCode) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL 
        ? (process.env.REACT_APP_API_URL.startsWith('http') 
            ? process.env.REACT_APP_API_URL 
            : `https://${process.env.REACT_APP_API_URL}`) 
        : 'http://localhost:5001';
      const response = await fetch(`${API_URL}/api/visits/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCode, standId: selectedStand }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Error al procesar QR');
      }
      
      setScanResult({ success: true, data: data });
      toast({ title: '¡Visita Registrada!', status: 'success', duration: 2000 });
    } catch (error) {
      setScanResult({ success: false, error: error.message });
    }
  };

  const resetUpload = () => {
    setUploadPreview(null);
    setScanResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex direction="column" align="center">
        <Card p={{ base: '25px', md: '40px' }} bg={cardBg} borderRadius="30px" boxShadow="0px 18px 40px rgba(112, 144, 176, 0.12)" w="100%" maxW="600px">
          
          <VStack spacing="5px" mb="30px" textAlign="center">
            <Icon as={MdQrCodeScanner} w="50px" h="50px" color={brandColor} mb="15px" />
            <Text color={textColor} fontSize="26px" fontWeight="800">Control de Visitas</Text>
            <Text color={textColorSecondary} fontSize="md">Escanee o suba una imagen del código QR del participante.</Text>
          </VStack>

          {/* Stand selector */}
          <FormControl mb="20px">
            <FormLabel fontWeight="bold" display="flex" alignItems="center">
              <Icon as={MdStorefront} mr="10px" color={brandColor} /> Tu Estand Actual
            </FormLabel>
            <Select 
              variant="auth" bg={inputBg}
              value={selectedStand} 
              onChange={(e) => setSelectedStand(e.target.value)}
              h="55px" borderRadius="15px"
            >
              {stands.map(s => (
                <option key={s._id} value={s._id} style={{color: 'black'}}>{s.name} - {s.responsible}</option>
              ))}
            </Select>
          </FormControl>

          {/* Tabs: Camera vs Upload */}
          <Tabs variant="soft-rounded" colorScheme="brand" isFitted>
            <TabList mb="20px" bg={inputBg} p="5px" borderRadius="15px">
              <Tab borderRadius="12px" fontWeight="700" _selected={{ bg: brandColor, color: 'white' }}>
                <HStack spacing="8px"><Icon as={MdCameraAlt} /><Text>Cámara</Text></HStack>
              </Tab>
              <Tab borderRadius="12px" fontWeight="700" _selected={{ bg: brandColor, color: 'white' }}>
                <HStack spacing="8px"><Icon as={MdUploadFile} /><Text>Subir Imagen</Text></HStack>
              </Tab>
            </TabList>

            <TabPanels>
              {/* ── Tab 1: Camera ── */}
              <TabPanel p="0">
                {/* Camera selector */}
                {cameras.length > 1 && (
                  <FormControl mb="20px">
                    <FormLabel fontWeight="bold" display="flex" alignItems="center" fontSize="sm">
                      <Icon as={MdCameraswitch} mr="8px" color={brandColor} /> Seleccionar Cámara
                    </FormLabel>
                    <Select 
                      variant="auth" bg={inputBg} size="sm"
                      value={selectedCamera} 
                      onChange={(e) => setSelectedCamera(e.target.value)}
                      h="45px" borderRadius="12px" isDisabled={scanning}
                    >
                      {cameras.map(cam => (
                        <option key={cam.id} value={cam.id} style={{color: 'black'}}>
                          {cam.label || `Cámara ${cam.id.substring(0, 8)}`}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {/* Camera viewport */}
                {scanning && (
                  <Box 
                    id="reader" w="100%" minH="350px" borderRadius="20px" overflow="hidden" 
                    border="4px solid" borderColor={brandColor} mb="20px"
                    sx={{
                      '& video': { borderRadius: '16px', width: '100%' },
                      '& img[alt="Info icon"]': { display: 'none' },
                      '& span': { color: textColorSecondary },
                      '& a': { display: 'none' },
                    }}
                  />
                )}

                {!scanning ? (
                  <Button 
                    variant="brand" w="100%" h="70px" fontSize="xl" borderRadius="20px"
                    boxShadow="0px 10px 20px rgba(67, 24, 255, 0.2)"
                    leftIcon={<Icon as={MdCameraAlt} boxSize="6" />}
                    onClick={startScanner}
                  >
                    Activar Cámara
                  </Button>
                ) : (
                  <Button 
                    colorScheme="red" w="100%" h="55px" fontSize="lg" borderRadius="20px"
                    leftIcon={<Icon as={MdStop} boxSize="5" />}
                    onClick={stopScanner}
                  >
                    Detener Escaneo
                  </Button>
                )}
              </TabPanel>

              {/* ── Tab 2: Upload Image ── */}
              <TabPanel p="0">
                <VStack spacing="20px" w="100%">
                  {/* Upload area */}
                  <Flex
                    direction="column" align="center" justify="center"
                    w="100%" minH="200px" p="30px"
                    bg={inputBg} borderRadius="20px"
                    border="2px dashed" borderColor="secondaryGray.400"
                    cursor="pointer"
                    _hover={{ borderColor: brandColor, bg: useColorModeValue('brand.50', 'whiteAlpha.100') }}
                    transition="all 0.2s"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploadPreview ? (
                      <VStack spacing="15px">
                        <Image src={uploadPreview} maxH="200px" borderRadius="15px" />
                        {uploadLoading && (
                          <HStack spacing="10px">
                            <Spinner size="sm" color="brand.500" />
                            <Text fontSize="sm" color={textColorSecondary} fontWeight="600">Leyendo código QR...</Text>
                          </HStack>
                        )}
                      </VStack>
                    ) : (
                      <VStack spacing="10px">
                        <Icon as={MdUploadFile} w="50px" h="50px" color="secondaryGray.400" />
                        <Text fontWeight="700" color={textColor}>Toca aquí para subir imagen</Text>
                        <Text fontSize="sm" color={textColorSecondary}>PNG, JPG o GIF con el código QR visible</Text>
                      </VStack>
                    )}
                  </Flex>

                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    display="none"
                    onChange={handleFileUpload}
                  />

                  {uploadPreview && (
                    <Button 
                      variant="outline" colorScheme="brand" w="100%" h="50px"
                      borderRadius="15px" leftIcon={<Icon as={MdRefresh} />}
                      onClick={resetUpload}
                    >
                      Subir Otra Imagen
                    </Button>
                  )}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>

          {/* ── Scan Result (shared by both tabs) ── */}
          {scanResult && (
            <Card 
              w="100%" p="25px" mt="20px" borderRadius="20px" 
              bg={scanResult.success ? successBg : errorBg} 
              border="1px solid" borderColor={scanResult.success ? 'green.200' : 'red.200'}
            >
              <Flex align="center">
                <Circle size="45px" bg={scanResult.success ? 'green.500' : 'red.500'} color="white" mr="20px">
                  <Icon as={scanResult.success ? MdCheckCircle : MdError} w="25px" h="25px" />
                </Circle>
                <Box>
                  <Text fontSize="lg" fontWeight="800" color={scanResult.success ? 'green.800' : 'red.800'}>
                    {scanResult.success ? 'REGISTRO EXITOSO' : 'REGISTRO FALLIDO'}
                  </Text>
                  <Text fontSize="sm" color={scanResult.success ? 'green.600' : 'red.600'}>
                    {scanResult.success ? scanResult.data.message : scanResult.error}
                  </Text>
                </Box>
              </Flex>
              
              {scanResult.success && (
                <Box mt="20px" pt="20px" borderTop="1px solid" borderColor="green.200">
                  <Text fontSize="sm" color="green.700" fontWeight="bold" mb="5px">PARTICIPANTE:</Text>
                  <Text fontSize="xl" fontWeight="800" color="green.900">
                    {scanResult.data.participant.firstName} {scanResult.data.participant.lastNamePaternal}
                  </Text>
                  <Badge colorScheme="green" mt="10px">Visita #{scanResult.data.participant.currentVisitCount}</Badge>
                </Box>
              )}
            </Card>
          )}

          {/* Scan again button */}
          {scanResult && !scanning && (
            <Button 
              variant="outline" colorScheme="brand" w="100%" h="55px" mt="15px"
              fontSize="lg" borderRadius="20px"
              leftIcon={<Icon as={MdQrCodeScanner} boxSize="5" />}
              onClick={() => { setScanResult(null); setUploadPreview(null); }}
            >
              Escanear Otro Código
            </Button>
          )}
        </Card>
      </Flex>
    </Box>
  );
}
