import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  HStack,
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

export default function Analytics() {
  // Helper to get YYYY-MM-DD in local time
  const getLocalDate = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };

  const [data, setData] = useState({ 
    visitStats: [], 
    surveyStats: [], 
    peakVisits: [], 
    visitorStats: [] 
  });
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(getLocalDate());
  const [endDate, setEndDate] = useState(getLocalDate());
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [exportModules, setExportModules] = useState(['stands', 'picos', 'picos-detal-total', 'intensidad', 'satisfaccion']);
  const [showTotal, setShowTotal] = useState(true);
  const [showUnique, setShowUnique] = useState(true);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';
  const cardBg = useColorModeValue('white', 'navy.800');
  const brandColor = useColorModeValue('brand.500', 'brand.400');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const API_URL = getApiUrl();
      const params = new URLSearchParams({
        startDate,
        endDate
      });
      const [analyticsRes, visitorStatsRes] = await Promise.all([
        fetch(`${API_URL}/api/reports/stand-analytics?${params}`),
        fetch(`${API_URL}/api/reports/visitor-stats?${params}`)
      ]);
      
      if (!analyticsRes.ok || !visitorStatsRes.ok) throw new Error("Servidor no responde");
      
      const analyticsData = await analyticsRes.json();
      const visitorStatsData = await visitorStatsRes.json();
      
      setData({ 
        visitStats: analyticsData.visitStats || [],
        surveyStats: analyticsData.surveyStats || [],
        peakVisits: analyticsData.peakVisits || [],
        visitorStats: visitorStatsData || [] 
      });
    } catch (error) {
      console.error('Error fetching analytics', error);
    }
    setLoading(false);
  }, [startDate, endDate]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const standPalette = [
    '#4318FF', '#39B1FF', // Stand 1 (Dark/Light)
    '#01B574', '#45EBA5', // Stand 2
    '#FFB547', '#FFD591', // Stand 3
    '#E31A1A', '#FF5C5C', // Stand 4
    '#A1E31A', '#C6F066', // Stand 5
    '#7551FF', '#A389FF', // Stand 6
  ];

  // Process participation data for "grouped colors" effect with spacers
  const { participationSeriesData, participationColors } = useMemo(() => {
    const series = [];
    const colors = [];
    
    (data?.visitorStats || []).forEach((s, i) => {
      const colorIdx = (i % (standPalette.length / 2)) * 2;
      
      // Add Total bar
      if (showTotal) {
        series.push({ x: `${s.name} (Total)`, y: s.totalVisits });
        colors.push(standPalette[colorIdx]);
      }
      
      // Add Unique bar
      if (showUnique) {
        series.push({ x: `${s.name} (Únicos)`, y: s.uniqueVisitorsCount });
        colors.push(standPalette[colorIdx + 1]);
      }
      
      // Add Spacer Bar (Height 0) only if not the last one and something is shown
      if (i < (data?.visitorStats?.length || 0) - 1 && (showTotal || showUnique)) {
          series.push({ x: `spacer-${i}`, y: 0 });
          colors.push('transparent');
      }
    });
    return { participationSeriesData: series, participationColors: colors };
  }, [data?.visitorStats, showTotal, showUnique]);

  const visitChartOptions = useMemo(() => ({
    chart: { 
      type: 'bar', 
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
      distributed: true,
      id: 'chart-participation',
      animations: { enabled: false } // Disable to prevent glitches on capture
    },
    xaxis: { 
      labels: { 
        show: true,
        rotate: -60,
        rotateAlways: true,
        hideOverlappingLabels: false,
        trim: false,
        style: { colors: '#A3AED0', fontWeight: '500', fontSize: '10px' },
        formatter: (val) => {
          if (!val || String(val).includes('spacer-')) return '';
          const sVal = String(val);
          if (showTotal && sVal.includes(' (Total)')) return sVal.replace(' (Total)', '');
          if (!showTotal && showUnique && sVal.includes(' (Únicos)')) return sVal.replace(' (Únicos)', '');
          return '';
        },
        offsetY: 5,
        minHeight: 100,
        maxHeight: 140,
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
        labels: { style: { colors: '#A3AED0', fontWeight: '500' } }
    },
    colors: participationColors,
    grid: {
        strokeDashArray: 5,
        borderColor: '#E0E5F2'
    },
    plotOptions: { 
      bar: { 
        borderRadius: 4, 
        columnWidth: '85%',
        distributed: true,
        dataLabels: { position: 'top' }
      } 
    },
    dataLabels: { 
      enabled: true, 
      offsetY: -20,
      formatter: (val, opts) => {
        if (val === 0) return '';
        const name = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].x;
        if (name.includes('(Total)')) return `Tot: ${val}`;
        if (name.includes('(Únicos)')) return `Uni: ${val}`;
        return val;
      },
      style: { fontSize: '9px', colors: ["#304758"] }
    },
    tooltip: { 
      theme: 'dark',
      x: { 
        formatter: (val) => {
          if (!val) return '';
          return String(val).replace(' (Total)', '').replace(' (Únicos)', '');
        },
        show: true 
      }
    },
    legend: { show: false }
  }), [participationColors, showTotal, showUnique]);

  const peakChartOptions = useMemo(() => ({
    chart: {
      type: 'area',
      toolbar: { 
        show: true,
        tools: {
          download: false, zoom: true, zoomin: true, zoomout: true, pan: true, reset: true
        }
      },
      animations: { enabled: false }, // Disable to prevent misaligned areas/smudges
      fontFamily: 'Inter, sans-serif',
      id: 'chart-peak-general'
    },
    xaxis: {
      type: 'datetime',
      labels: { 
        style: { colors: '#A3AED0', fontWeight: '500' },
        datetimeUTC: false,
        hideOverlappingLabels: true
      },
    },
    colors: standPalette,
    stroke: { curve: 'straight', width: 2 },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      labels: { 
        style: { colors: '#A3AED0', fontWeight: '500' },
        formatter: (val) => Math.floor(val)
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100]
      }
    },
    dataLabels: { enabled: false },
    tooltip: { 
      theme: 'dark',
      x: { format: 'dd MMM HH:mm' }
    },
    markers: { 
      size: 5, 
      strokeWidth: 2,
      strokeColors: '#fff',
      hover: { size: 7 } 
    },
    grid: { borderColor: '#E0E5F2', strokeDashArray: 5 },
    legend: { 
      show: true, 
      position: 'bottom', 
      horizontalAlign: 'center',
      offsetY: 0,
      labels: { colors: '#A3AED0' } 
    }
  }), []);

  const standPeakChartOptions = useMemo(() => ({
    ...peakChartOptions,
    chart: {
      ...peakChartOptions.chart,
      type: 'area',
      id: 'chart-peak-total'
    }
  }), [peakChartOptions]);

  // Process time-series data using timestamps from backend
  const standUniqueNames = useMemo(() => [...new Set((data?.peakVisits || []).map(v => v.standName).filter(n => typeof n === 'string'))], [data?.peakVisits]);
  
  // Peak Chart Series (Datetime)
  const standSeries = useMemo(() => standUniqueNames.map(name => ({
    name,
    data: (data?.peakVisits || [])
      .filter(v => v.standName === name)
      .map(v => {
        const ts = new Date(v.timestamp).getTime();
        return isNaN(ts) ? null : [ts, v.count];
      })
      .filter(p => p !== null)
  })), [data?.peakVisits, standUniqueNames]);

  // Total Peak Series
  const totalPeakSeries = useMemo(() => {
    const totalPeakDataDict = {};
    data?.peakVisits?.forEach(v => {
      const ts = new Date(v.timestamp).getTime();
      if (!isNaN(ts)) {
        totalPeakDataDict[ts] = (totalPeakDataDict[ts] || 0) + v.count;
      }
    });
    return [{
      name: 'Visitas Totales',
      data: Object.entries(totalPeakDataDict).map(([ts, count]) => [Number(ts), count]).sort((a, b) => a[0] - b[0])
    }];
  }, [data?.peakVisits]);

  // Heatmap Data (Stand vs Hour)
  const heatmapHours = useMemo(() => Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`), []);
  const heatmapSeries = useMemo(() => standUniqueNames.map(name => {
    const hourlyData = Array(24).fill(0).map((_, i) => ({ x: heatmapHours[i], y: 0 }));
    (data?.peakVisits || [])
      .filter(v => v.standName === name)
      .forEach(v => {
        const d = new Date(v.timestamp);
        const h = d.getHours();
        if (!isNaN(h) && h >= 0 && h < 24) {
          hourlyData[h].y += v.count;
        }
      });
    return { name, data: hourlyData };
  }), [data?.peakVisits, standUniqueNames, heatmapHours]);

  const heatmapOptions = useMemo(() => ({
    chart: { 
      type: 'heatmap', 
      toolbar: { show: false }, 
      fontFamily: 'Inter, sans-serif',
      id: 'chart-intensity',
      animations: { enabled: false }
    },
    dataLabels: { enabled: false },
    colors: ["#4318FF"],
    title: { show: false },
    xaxis: { 
      labels: { 
        style: { colors: '#A3AED0' },
        rotate: -45,
        tickAmount: 12
      } 
    },
    yaxis: { labels: { style: { colors: '#A3AED0' } } },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 0,
        useFillColorAsStroke: true,
        colorScale: {
          ranges: [
            { from: 0, to: 0, name: 'Bajo', color: '#F4F7FE' },
            { from: 1, to: 10, name: 'Medio', color: '#6AD2FF' },
            { from: 11, to: 100, name: 'Alto', color: '#4318FF' }
          ]
        }
      }
    }
  }), []);

  const surveyChartOptions = useMemo(() => ({
    chart: { 
        type: 'bar', 
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif',
        id: 'chart-satisfaction',
        animations: { enabled: false }
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
  }), [data?.surveyStats]);


  if (loading) return <Flex justify="center" align="center" h="100vh"><Spinner size="xl" color="brand.500" /></Flex>;

  const resetZoom = (id) => {
    if (window.ApexCharts) {
        window.ApexCharts.exec(id, 'resetZoom');
    }
  };

  const exportToPDF = async () => {
    onClose();
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 15;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(67, 24, 255);
    doc.text('Reporte de Analíticas - Francophonie', pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Rango: ${startDate} al ${endDate}`, pageWidth / 2, currentY, { align: 'center' });
    currentY += 15;

    const sections = [
      { id: 'chart-participation', title: 'Participación por Stand', module: 'stands' },
      { id: 'chart-peak-total', title: 'Picos de Visitas por Stand', module: 'picos' },
      { id: 'chart-peak-general', title: 'Picos Generales', module: 'picos-detal-total' },
      { id: 'chart-intensity', title: 'Mapa de Calor de Actividad', module: 'intensidad' }, // Adding heatmap support
      { id: 'chart-satisfaction', title: 'Satisfacción Media', module: 'satisfaccion' }
    ];

    for (const section of sections) {
        if (!exportModules.includes(section.module)) continue;

        try {
            // ApexCharts dataURI is much more reliable than html2canvas for SVG charts
            const { imgURI } = await window.ApexCharts.exec(section.id, 'dataURI');
            
            if (imgURI) {
                const pdfWidth = pageWidth - 40; // Margins
                const imgProps = doc.getImageProperties(imgURI);
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                if (currentY + pdfHeight > 270) {
                    doc.addPage();
                    currentY = 20;
                }

                doc.setFontSize(16);
                doc.setTextColor(0);
                doc.text(section.title, 20, currentY);
                currentY += 10;
                doc.addImage(imgURI, 'PNG', 20, currentY, pdfWidth, pdfHeight);
                currentY += pdfHeight + 25;
            }
        } catch (err) {
            console.error(`Error exporting section ${section.id}:`, err);
        }
    }

    doc.save(`Reporte_Analytics_${startDate}.pdf`);
  };



  return (
    <Box pt={{ base: '110px', md: '80px', xl: '80px' }}>
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
            <VStack align="start" spacing="0" flex="1">
                <Text color={textColor} fontSize="lg" fontWeight="700">Participación por Stand</Text>
                <Text color={textColorSecondary} fontSize="sm">Únicos vs Totales</Text>
            </VStack>
            <HStack spacing="15px">
                <HStack 
                  spacing="5px" 
                  cursor="pointer" 
                  onClick={() => setShowTotal(!showTotal)}
                  opacity={showTotal ? 1 : 0.4}
                  transition="0.2s"
                >
                  <Box w="10px" h="10px" borderRadius="full" bg="#4318FF" />
                  <Text fontSize="xs" fontWeight="500" color={textColorSecondary}>Totales</Text>
                </HStack>
                <HStack 
                  spacing="5px" 
                  cursor="pointer" 
                  onClick={() => setShowUnique(!showUnique)}
                  opacity={showUnique ? 1 : 0.4}
                  transition="0.2s"
                >
                  <Box w="10px" h="10px" borderRadius="full" bg="#39B1FF" />
                  <Text fontSize="xs" fontWeight="500" color={textColorSecondary}>Únicos</Text>
                </HStack>
            </HStack>
          </Flex>
          <Box id="chart-visits">
            <Chart
                options={visitChartOptions}
                series={[{ name: 'Participantes', data: participationSeriesData }]}
                type="bar"
                width="100%"
                height="400px"
            />
          </Box>
        </Card>

        {/* Intensity Heatmap Chart Card */}
        <Card p="30px" bg={cardBg} borderRadius="20px" boxShadow="0px 18px 40px rgba(112, 144, 176, 0.12)">
          <Flex align="center" mb="20px">
            <IconBox
              w='46px' h='46px' bg={boxBg}
              icon={<Icon w='24px' h='24px' as={MdRefresh} color='orange.400' />}
              me="15px"
            />
            <VStack align="start" spacing="0">
              <Text color={textColor} fontSize="lg" fontWeight="700">Mapa de Calor</Text>
              <Text color={textColorSecondary} fontSize="sm">Actividad por Stand y Hora</Text>
            </VStack>
          </Flex>
          <Box id="chart-heatmap">
            <Chart
              options={heatmapOptions}
              series={heatmapSeries}
              type="heatmap"
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
                    <Text color={textColorSecondary} fontSize="sm">Usa los íconos de la derecha para controlar el zoom y mover la gráfica</Text>
                </VStack>
            </Flex>
            <Button 
                onClick={() => resetZoom('chart-peak-total')}
                leftIcon={<MdRefresh />}
                variant="soft" 
                size="sm"
                colorScheme="brand"
            >
                Restablecer Vista
            </Button>
          </Flex>
          <Box id="chart-peaks">
            <Chart
                options={standPeakChartOptions}
                series={standSeries}
                type="area"
                width="100%"
                height="400px"
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
                    <Text color={textColorSecondary} fontSize="sm">Usa los íconos de la derecha para controlar el zoom y mover la gráfica</Text>
                </VStack>
            </Flex>
             <Button 
                onClick={() => resetZoom('chart-peak-general')}
                leftIcon={<MdRefresh />}
                variant="soft" 
                size="sm"
                colorScheme="blue"
            >
                Restablecer Vista
            </Button>
          </Flex>
          <Box id="chart-general">
            <Chart
                options={{...peakChartOptions, colors: ['#4318FF']}}
                series={totalPeakSeries}
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
                <Checkbox value="intensidad">Mapa de Calor (Actividad)</Checkbox>
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
