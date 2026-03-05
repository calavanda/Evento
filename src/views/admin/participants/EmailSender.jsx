import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Flex,
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
  Checkbox,
  Spinner,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { MdEmail, MdCheckCircle } from 'react-icons/md';
import { getApiUrl } from 'utils/api';

export default function EmailSender() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [emailConfig, setEmailConfig] = useState({ subject: '', customMessage: '' });

  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';
  const cardBg = useColorModeValue('white', 'navy.800');
  const inputBg = useColorModeValue('secondaryGray.300', 'navy.900');
  const toast = useToast();

  const fetchParticipants = useCallback(async () => {
    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/participants`);
      if (response.ok) {
        const data = await response.json();
        setParticipants(data);
      }
    } catch (error) {
      console.error('Error fetching participants', error);
      toast({ title: 'Error al cargar participantes', status: 'error' });
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = participants.filter(p => p.correo).map(p => p._id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (e, id) => {
    if (e.target.checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const selectedParticipants = participants.filter(p => selectedIds.includes(p._id));

  const handleSendEmails = async () => {
    setIsSending(true);
    try {
      const API_URL = getApiUrl();
      const recipients = selectedParticipants.map(p => ({
        email: p.correo,
        nombre: `${p.nombre} ${p.apellidoPaterno}`,
        codigoQR: p.codigoQR
      }));

      const response = await fetch(`${API_URL}/api/email/send-qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients,
          subject: emailConfig.subject,
          customMessage: emailConfig.customMessage
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({ 
          title: 'Envío completado', 
          description: data.mensaje,
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        setSelectedIds([]);
        onClose();
        setEmailConfig({ subject: '', customMessage: '' });
      } else {
        const err = await response.json();
        toast({ title: 'Error al enviar', description: err.error, status: 'error' });
      }
    } catch (error) {
      toast({ title: 'Error de red', description: error.message, status: 'error' });
    } finally {
      setIsSending(false);
    }
  };

  const validParticipants = participants.filter(p => p.correo);
  const allSelected = validParticipants.length > 0 && selectedIds.length === validParticipants.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < validParticipants.length;

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card p="25px" bg={cardBg} borderRadius="20px" boxShadow="0px 18px 40px rgba(112, 144, 176, 0.12)">
        <Flex align={{ base: 'start', md: 'center' }} justify="space-between" mb="30px" direction={{ base: 'column', md: 'row' }}>
          <Box mb={{ base: '20px', md: '0' }}>
            <Text color={textColor} fontSize="22px" fontWeight="700">
              Envío Masivo de QR por Correo
            </Text>
            <Text color={textColorSecondary} fontSize="sm">
              Selecciona a los participantes a los que deseas enviarles su gafete QR.
            </Text>
          </Box>
          <Button
            colorScheme="brand"
            borderRadius="15px"
            leftIcon={<MdEmail />}
            isDisabled={selectedIds.length === 0}
            onClick={onOpen}
          >
            Redactar Correo ({selectedIds.length})
          </Button>
        </Flex>

        {loading ? (
          <Flex justify="center" p="50px"><Spinner size="xl" color="brand.500" /></Flex>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple" color="gray.500">
              <Thead>
                <Tr>
                  <Th w="50px">
                    <Checkbox 
                      colorScheme="brand" 
                      isChecked={allSelected}
                      isIndeterminate={isIndeterminate}
                      onChange={handleSelectAll}
                    />
                  </Th>
                  <Th color="secondaryGray.600" fontSize="xs">Nombre/s</Th>
                  <Th color="secondaryGray.600" fontSize="xs">Apellidos</Th>
                  <Th color="secondaryGray.600" fontSize="xs">Correo Electrónico</Th>
                  <Th color="secondaryGray.600" fontSize="xs" textAlign="center">Estado QR</Th>
                </Tr>
              </Thead>
              <Tbody>
                {participants.map((user) => {
                  const hasEmail = Boolean(user.correo);
                  return (
                    <Tr key={user._id} _hover={{ bg: inputBg }} opacity={hasEmail ? 1 : 0.5}>
                      <Td>
                        <Checkbox 
                          colorScheme="brand"
                          isChecked={selectedIds.includes(user._id)}
                          onChange={(e) => handleSelect(e, user._id)}
                          isDisabled={!hasEmail}
                        />
                      </Td>
                      <Td>
                        <Text fontWeight="700" color={textColor}>{user.nombre}</Text>
                      </Td>
                      <Td>
                        <Text fontWeight="500">{user.apellidoPaterno} {user.apellidoMaterno}</Text>
                      </Td>
                      <Td>
                        <Text fontWeight="500">{hasEmail ? user.correo : 'Sin correo'}</Text>
                      </Td>
                      <Td textAlign="center">
                        <Icon as={MdCheckCircle} color={user.codigoQR ? "green.500" : "gray.300"} w="20px" h="20px" />
                      </Td>
                    </Tr>
                  );
                })}
                {participants.length === 0 && (
                    <Tr><Td colSpan={5} textAlign="center" py="40px">No hay participantes registrados.</Td></Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        )}
      </Card>

      {/* Modal Redacción Correo */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg={cardBg} borderRadius="20px">
          <ModalHeader color={textColor} fontWeight="800">
            Redactar Correo a {selectedIds.length} participantes
          </ModalHeader>
          <ModalCloseButton isDisabled={isSending} />
          <ModalBody>
            <FormControl mb="20px">
              <FormLabel fontWeight="bold">Asunto (Opcional)</FormLabel>
              <Input 
                bg={inputBg} 
                placeholder="Tu Identificación Oficial QR - Sabores de la Francofonía" 
                value={emailConfig.subject}
                onChange={(e) => setEmailConfig({...emailConfig, subject: e.target.value})}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold">Mensaje Personalizado (Opcional)</FormLabel>
              <Textarea 
                bg={inputBg} 
                minH="150px"
                placeholder="Hola [Nombre], aquí tienes tu código QR oficial..."
                value={emailConfig.customMessage}
                onChange={(e) => setEmailConfig({...emailConfig, customMessage: e.target.value})}
              />
              <Text fontSize="xs" color={textColorSecondary} mt="2px">
                El código QR se incrustará automáticamente al final del mensaje.
              </Text>
            </FormControl>
          </ModalBody>
          <ModalFooter mt="20px">
            <Button 
                colorScheme="brand" 
                mr={3} borderRadius="15px" 
                onClick={handleSendEmails}
                isLoading={isSending}
                loadingText="Enviando Emails..."
            >
              Confirmar y Enviar
            </Button>
            <Button onClick={onClose} variant="ghost" borderRadius="15px" isDisabled={isSending}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
}
