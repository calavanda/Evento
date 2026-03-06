import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  SimpleGrid,
  Text,
  useColorModeValue,
  Card,
  Spinner,
  Icon,
  VStack,
  IconButton,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Checkbox,
  CheckboxGroup,
  Input,
  FormControl,
  FormLabel,
  Stack,
} from '@chakra-ui/react';
import Chart from 'react-apexcharts';
import { MdStar, MdTimeline, MdPeople, MdRefresh } from 'react-icons/md';
import IconBox from 'components/icons/IconBox';
import { getApiUrl } from 'utils/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [exportModules, setExportModules] = useState(['stands', 'picos', 'picos-detal-total', 'satisfaccion']);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';
  const cardBg = useColorModeValue('white', 'navy.800');
  const brandColor = useColorModeValue('brand.500', 'brand.400');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  useEffect(() => {
    fetchAnalytics();
  }, [startDate, endDate]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const API_URL = getApiUrl();
      const params = new URLSearchParams({
        startDate: `${startDate}T00:00:00Z`,
        endDate: `${endDate}T23:59:59Z`
      });
      const [analyticsRes, visitorStatsRes] = await Promise.all([
        fetch(`${API_URL}/api/reports/stand-analytics?${params}`),
        fetch(`${API_URL}/api/reports/visitor-stats?${params}`)
      ]);
      
      if (!analyticsRes.ok || !visitorStatsRes.ok) throw new Error("Servidor no responde");
      
      const analyticsData = await analyticsRes.json();
      const visitorStatsData = await visitorStatsRes.json();
      
      setData({ ...analyticsData, visitorStats: visitorStatsData });
    } catch (error) {
      console.error('Error fetching analytics', error);
    }
    setLoading(false);
  };

  if (loading) return <Flex justify="center" align="center" h="100vh"><Spinner size="xl" color="brand.500" /></Flex>;

  const visitChartOptions = {
    chart: { 
      type: 'bar', 
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
      stacked: false
    },
    xaxis: { 
      categories: data?.visitorStats.map(s => s.name) || [], 
      labels: { style: { colors: '#A3AED0', fontWeight: '500' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
        labels: { style: { colors: '#A3AED0', fontWeight: '500' } }
    },
    colors: ['#4318FF', '#6AD2FF'],
    grid: {
        strokeDashArray: 5,
        borderColor: '#E0E5F2'
    },
    plotOptions: { bar: { borderRadius: 10, columnWidth: '40px' } },
    dataLabels: { enabled: false },
    tooltip: { theme: 'dark' },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      fontFamily: 'Inter, sans-serif',
      labels: { colors: '#A3AED0' }
    }
  };

  const peakChartOptions = {
    chart: {
      type: 'area',
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
      fontFamily: 'Inter, sans-serif',
    },
    xaxis: {
      type: 'category',
      categories: [], // Will be set dynamically
      labels: { style: { colors: '#A3AED0', fontWeight: '500' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    colors: ['#4318FF', '#6AD2FF', '#01B574', '#FFB547', '#E31A1A', '#A1E31A'],
    stroke: { curve: 'smooth', width: 4 },
    fill: {
      type: 'solid',
      opacity: 0.1
    },
    dataLabels: { enabled: false },
    tooltip: { theme: 'dark' },
    grid: { borderColor: '#E0E5F2', strokeDashArray: 5 },
    legend: { show: true, position: 'top', labels: { colors: '#A3AED0' } }
  };

  const isSameDay = startDate === endDate;
  const currentHour = new Date().getHours();
  
  // Dynamic categories for Peak Charts
  let categories = [];
  if (isSameDay) {
    // Sliding 24h window: last 23 hours + current hour
    for (let i = 23; i >= 0; i--) {
        let h = (currentHour - i + 24) % 24;
        categories.push(`${h}:00`);
    }
  } else {
    // Multi-day: show simply 0-23 or we could expand to date-hour, 
    // but for now keeping 0-23 to compare "peak hours" across days
    categories = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  }

  const standUniqueNames = [...new Set((data?.peakVisits || []).map(v => v.standName).filter(n => typeof n === 'string'))];
  
  const totalPeakData = Array(categories.length).fill(0);
  
  // Helper to map hour to category index
  const getCategoryIndex = (h) => {
    if (isSameDay) {
        const index = categories.indexOf(`${h}:00`);
        return index;
    }
    return h;
  };

  data?.peakVisits?.forEach(v => {
    const h = Number(v.hour);
    const idx = getCategoryIndex(h);
    if (idx !== -1) {
        totalPeakData[idx] += v.count;
    }
  });

  const standSeries = standUniqueNames.length > 0 ? standUniqueNames.map(name => {
    const standData = Array(categories.length).fill(0);
    const standVisits = (data?.peakVisits || []).filter(v => v.standName === name);
    standVisits.forEach(v => {
      const h = Number(v.hour);
      const idx = getCategoryIndex(h);
      if (idx !== -1) {
          standData[idx] = v.count;
      }
    });
    return { name, data: standData };
  }) : [{ name: 'Sin datos', data: Array(categories.length).fill(0) }];

  const resetZoom = (id) => {
    if (window.ApexCharts) {
        window.ApexCharts.exec(id, 'resetZoom');
    }
  };

  const exportToPDF = async () => {
    onClose();
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 10;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(67, 24, 255);
    doc.text('Reporte de Analíticas - Francophonie', pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Rango: ${startDate} al ${endDate}`, pageWidth / 2, currentY, { align: 'center' });
    currentY += 15;

    const sections = [
      { id: 'chart-visits', title: 'Participación por Stand' },
      { id: 'chart-peaks', title: 'Picos de Visitas' },
      { id: 'chart-general', title: 'Picos Generales' },
      { id: 'chart-satisfaction', title: 'Satisfacción Media' }
    ];

    for (const section of sections) {
        const isSelected = (section.id === 'chart-visits' && exportModules.includes('stands')) ||
                           (section.id === 'chart-peaks' && exportModules.includes('picos')) ||
                           (section.id === 'chart-general' && exportModules.includes('picos-detal-total')) ||
                           (section.id === 'chart-satisfaction' && exportModules.includes('satisfaccion'));
        
        if (!isSelected) continue;

        const el = document.getElementById(section.id);
        if (el) {
            const canvas = await html2canvas(el, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const imgProps = doc.getImageProperties(imgData);
            const pdfWidth = pageWidth - 20;
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            if (currentY + pdfHeight > 280) {
                doc.addPage();
                currentY = 10;
            }

            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text(section.title, 10, currentY);
            currentY += 5;
            doc.addImage(imgData, 'PNG', 10, currentY, pdfWidth, pdfHeight);
            currentY += pdfHeight + 15;
        }
    }

    doc.save(`Reporte_Analytics_${startDate}.pdf`);
  };

  const surveyChartOptions = {
    chart: { 
        type: 'bar', 
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif'
    },
    xaxis: { 
        categories: data?.surveyStats.map(s => s.name) || [], 
        labels: { style: { colors: '#A3AED0', fontWeight: '500' } },
        axisBorder: { show: false },
        axisTicks: { show: false }
    },
    colors: ['#6AD2FF'],
    plotOptions: { bar: { borderRadius: 10, horizontal: true, barHeight: '40%' } },
    dataLabels: { enabled: true, formatter: (val) => val.toFixed(1), style: { colors: ['#fff'] } },
    grid: { borderColor: 'transparent' },
    yaxis: { max: 5 },
    tooltip: { theme: 'dark' }
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "start", md: "center" }} mb="30px">
        <Box>
            <Text color={textColor} fontSize="34px" fontWeight="700" lineHeight="100%">
            Gráficas de Información
            </Text>
            <Text color={textColorSecondary} fontSize="md" mt="10px">
            Visualice el rendimiento y la satisfacción en tiempo real.
            </Text>
        </Box>
        <Stack direction={{ base: "column", sm: "row" }} spacing="10px" mt={{ base: "20px", md: "0" }}>
            <FormControl>
                <FormLabel fontSize="xs" mb="1">Desde</FormLabel>
                <Input size="sm" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} borderRadius="10px" />
            </FormControl>
            <FormControl>
                <FormLabel fontSize="xs" mb="1">Hasta</FormLabel>
                <Input size="sm" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} borderRadius="10px" />
            </FormControl>
            <Button 
                alignSelf="flex-end"
                leftIcon={<MdTimeline />} 
                colorScheme="brand" 
                variant="brand" 
                onClick={onOpen}
            >
                Exportar PDF
            </Button>
        </Stack>
      </Flex>
      
      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing="20px">
        {/* Visits Chart Card */}
        <Card p="30px" bg={cardBg} borderRadius="20px" boxShadow="0px 18px 40px rgba(112, 144, 176, 0.12)">
          <Flex align="center" mb="20px">
            <IconBox
              w='46px'
              h='46px'
              bg={boxBg}
              icon={<Icon w='24px' h='24px' as={MdPeople} color={brandColor} />}
              me="15px"
            />
            <VStack align="start" spacing="0">
                <Text color={textColor} fontSize="lg" fontWeight="700">Participación por Stand</Text>
                <Text color={textColorSecondary} fontSize="sm">Únicos vs Totales</Text>
            </VStack>
          </Flex>
          <Box id="chart-visits">
            <Chart
                options={visitChartOptions}
                series={[
                    { name: 'Visitas Totales', data: data?.visitorStats.map(s => s.totalVisits) || [] },
                    { name: 'Visitantes Únicos', data: data?.visitorStats.map(s => s.uniqueVisitorsCount) || [] }
                ]}
                type="bar"
                width="100%"
                height="350px"
            />
          </Box>
        </Card>

        {/* Peak Visits Chart Card (All in one) */}
        <Card p="30px" bg={cardBg} borderRadius="20px" boxShadow="0px 18px 40px rgba(112, 144, 176, 0.12)">
          <Flex justify="space-between" align="center" mb="20px">
            <Flex align="center">
                <IconBox
                w='46px'
                h='46px'
                bg={boxBg}
                icon={<Icon w='24px' h='24px' as={MdTimeline} color="brand.200" />}
                me="15px"
                />
                <VStack align="start" spacing="0">
                    <Text color={textColor} fontSize="lg" fontWeight="700">Picos de Visitas por Stand</Text>
                    <Text color={textColorSecondary} fontSize="sm">Comparativa por hora</Text>
                </VStack>
            </Flex>
            <Button 
                onClick={() => resetZoom('peak-chart-total')}
                leftIcon={<MdRefresh />}
                variant="soft" 
                size="sm"
                colorScheme="brand"
            >
                Reiniciar
            </Button>
          </Flex>
          <Box id="chart-peaks">
            <Chart
                options={{...peakChartOptions, chart: { ...peakChartOptions.chart, id: 'peak-chart-total' }, xaxis: { ...peakChartOptions.xaxis, categories }}}
                series={standSeries}
                type="area"
                width="100%"
                height="350px"
            />
          </Box>
        </Card>

        {/* Total Peak Chart Card */}
         <Card p="30px" bg={cardBg} borderRadius="20px" boxShadow="0px 18px 40px rgba(112, 144, 176, 0.12)">
          <Flex justify="space-between" align="center" mb="20px">
            <Flex align="center">
                <IconBox
                w='46px'
                h='46px'
                bg={boxBg}
                icon={<Icon w='24px' h='24px' as={MdTimeline} color="blue.400" />}
                me="15px"
                />
                <VStack align="start" spacing="0">
                    <Text color={textColor} fontSize="lg" fontWeight="700">Picos Generales</Text>
                    <Text color={textColorSecondary} fontSize="sm">Suma total de visitas</Text>
                </VStack>
            </Flex>
             <Button 
                onClick={() => resetZoom('peak-chart-general')}
                leftIcon={<MdRefresh />}
                variant="soft" 
                size="sm"
                colorScheme="blue"
            >
                Reiniciar
            </Button>
          </Flex>
          <Box id="chart-general">
            <Chart
                options={{...peakChartOptions, chart: { ...peakChartOptions.chart, id: 'peak-chart-general' }, colors: ['#4318FF'], xaxis: { ...peakChartOptions.xaxis, categories }}}
                series={[{ name: 'Visitas Totales', data: totalPeakData }]}
                type="area"
                width="100%"
                height="350px"
            />
          </Box>
        </Card>

        {/* Satisfaction Chart Card */}
        <Card p="30px" bg={cardBg} borderRadius="20px" boxShadow="0px 18px 40px rgba(112, 144, 176, 0.12)">
           <Flex align="center" mb="20px">
            <IconBox
              w='46px'
              h='46px'
              bg={boxBg}
              icon={<Icon w='24px' h='24px' as={MdStar} color='orange.400' />}
              me="15px"
            />
            <Text color={textColor} fontSize="lg" fontWeight="700">Satisfacción Media</Text>
          </Flex>
          <Box id="chart-satisfaction">
            <Chart
                options={surveyChartOptions}
                series={[{ name: 'Promedio', data: data?.surveyStats.map(s => s.avgRating) || [] }]}
                type="bar"
                width="100%"
                height="350px"
            />
          </Box>
        </Card>
      </SimpleGrid>

      {/* Modal para Exportar PDF */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent borderRadius="20px">
          <ModalHeader>Exportar Reporte a PDF</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="4">Selecciona los módulos que deseas incluir en el reporte:</Text>
            <CheckboxGroup colorScheme="brand" value={exportModules} onChange={setExportModules}>
              <Stack direction="column">
                <Checkbox value="stands">Participación por Stand</Checkbox>
                <Checkbox value="picos">Picos de Visitas por Stand</Checkbox>
                <Checkbox value="picos-detal-total">Picos Generales</Checkbox>
                <Checkbox value="satisfaccion">Satisfacción Media</Checkbox>
              </Stack>
            </CheckboxGroup>
            <Text fontSize="sm" mt="6" color="secondaryGray.600">
                El PDF se generará capturando los datos mostrados actualmente en el rango de fechas seleccionado.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="brand" variant="brand" onClick={exportToPDF}>
              Generar PDF
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
