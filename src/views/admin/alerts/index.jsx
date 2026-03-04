import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Button,
  Badge,
  Icon,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { MdSecurity, MdDelete } from 'react-icons/md';
import Card from 'components/card/Card';
import { getApiUrl } from 'utils/api';

export default function SecurityAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const fetchAlerts = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/api/security/alerts`);
      const data = await response.json();
      setAlerts(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setLoading(false);
    }
  };

  const clearAlerts = async () => {
    if (!window.confirm('¿Estás seguro de que deseas limpiar todo el historial de seguridad?')) return;
    try {
      const response = await fetch(`${getApiUrl()}/api/security/alerts/clear`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setAlerts([]);
        toast({
          title: 'Historial limpiado',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error al limpiar',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000); // Actualizar cada 10 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}>
        <Flex px="25px" justify="space-between" mb="20px" align="center">
          <Flex align="center">
            <Icon as={MdSecurity} color="red.500" h="24px" w="24px" me="10px" />
            <Text
              color={textColor}
              fontSize="22px"
              fontWeight="700"
              lineHeight="100%">
              Registro de Incidentes de Seguridad
            </Text>
          </Flex>
          <Button
            leftIcon={<MdDelete />}
            colorScheme="red"
            variant="outline"
            size="sm"
            onClick={clearAlerts}
            isDisabled={alerts.length === 0}>
            Limpiar Historial
          </Button>
        </Flex>
        
        {loading ? (
          <Flex justify="center" p="50px">
            <Spinner />
          </Flex>
        ) : (
          <Table variant="simple" color="gray.500" mb="24px">
            <Thead>
              <Tr>
                <Th borderColor={borderColor}>Fecha/Hora</Th>
                <Th borderColor={borderColor}>IP</Th>
                <Th borderColor={borderColor}>Método/URL</Th>
                <Th borderColor={borderColor}>Tipo de Ataque</Th>
                <Th borderColor={borderColor}>Detalles (Payload)</Th>
              </Tr>
            </Thead>
            <Tbody>
              {alerts.length === 0 ? (
                <Tr>
                  <Td colSpan={5} textAlign="center" py="50px">
                    <Text fontWeight="600" color="green.500">
                      ✅ No se han detectado incidentes de seguridad.
                    </Text>
                  </Td>
                </Tr>
              ) : (
                alerts.map((alert, index) => (
                  <Tr key={index}>
                    <Td borderColor={borderColor} fontSize="sm">
                      {new Date(alert.timestamp).toLocaleString()}
                    </Td>
                    <Td borderColor={borderColor} fontSize="sm">
                      <Badge colorScheme="orange">{alert.ip}</Badge>
                    </Td>
                    <Td borderColor={borderColor} fontSize="sm">
                      <Text fontWeight="700">{alert.metodo}</Text>
                      <Text fontSize="xs">{alert.url}</Text>
                    </Td>
                    <Td borderColor={borderColor}>
                      <Badge colorScheme="red" variant="solid">
                        {alert.tipoAtaque}
                      </Badge>
                    </Td>
                    <Td borderColor={borderColor} fontSize="xs">
                      <Box maxW="300px" overflow="hidden" textOverflow="ellipsis">
                        <code>{JSON.stringify(alert.detalles)}</code>
                      </Box>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        )}
      </Card>
    </Box>
  );
}
