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
} from '@chakra-ui/react';
import Chart from 'react-apexcharts';
import { MdStar, MdTimeline, MdPeople, MdRefresh } from 'react-icons/md';
import { Button } from '@chakra-ui/react';
import IconBox from 'components/icons/IconBox';
import { getApiUrl } from 'utils/api';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';
  const cardBg = useColorModeValue('white', 'navy.800');
  const brandColor = useColorModeValue('brand.500', 'brand.400');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const API_URL = getApiUrl();
      const [analyticsRes, visitorStatsRes] = await Promise.all([
        fetch(`${API_URL}/api/reports/stand-analytics`),
        fetch(`${API_URL}/api/reports/visitor-stats`)
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
      categories: Array.from({ length: 24 }, (_, i) => `${i}:00`),
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

  const standUniqueNames = [...new Set((data?.peakVisits || []).map(v => v.standName).filter(n => typeof n === 'string'))];
  
  const totalPeakData = Array(24).fill(0);
  data?.peakVisits?.forEach(v => {
    if (v.hour !== undefined && v.hour !== null) {
        totalPeakData[v.hour] += v.count;
    }
  });

  console.log('Stand Unique Names:', standUniqueNames);
  console.log('Peak Visits Data:', data?.peakVisits);

  const standSeries = standUniqueNames.length > 0 ? standUniqueNames.map(name => {
    const standData = Array(24).fill(0);
    const standVisits = (data?.peakVisits || []).filter(v => v.standName === name);
    standVisits.forEach(v => {
      const h = Number(v.hour);
      if (!isNaN(h) && h >= 0 && h < 24) {
          standData[h] = v.count;
      }
    });
    return { name, data: standData };
  }) : [{ name: 'Sin datos', data: Array(24).fill(0) }];

  const resetZoom = (id) => {
    if (window.ApexCharts) {
        window.ApexCharts.exec(id, 'resetZoom');
    }
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
      <Flex direction="column" mb="30px">
        <Text color={textColor} fontSize="34px" fontWeight="700" lineHeight="100%">
          Gráficas de Información
        </Text>
        <Text color={textColorSecondary} fontSize="md" mt="10px">
          Visualice el rendimiento y la satisfacción en tiempo real.
        </Text>
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
          <Chart
            options={{...peakChartOptions, chart: { ...peakChartOptions.chart, id: 'peak-chart-total' }}}
            series={standSeries}
            type="area"
            width="100%"
            height="350px"
          />
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
          <Chart
            options={{...peakChartOptions, chart: { ...peakChartOptions.chart, id: 'peak-chart-general' }, colors: ['#4318FF']}}
            series={[{ name: 'Visitas Totales', data: totalPeakData }]}
            type="area"
            width="100%"
            height="350px"
          />
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
          <Chart
            options={surveyChartOptions}
            series={[{ name: 'Promedio', data: data?.surveyStats.map(s => s.avgRating) || [] }]}
            type="bar"
            width="100%"
            height="350px"
          />
        </Card>
      </SimpleGrid>

      {/* Detalle Individual por Stand */}
      <Text color={textColor} fontSize="24px" fontWeight="700" mt="50px" mb="20px">
        Detalle de Picos por Stand
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="20px" pb="50px">
        {standUniqueNames.map((name, index) => {
          const standData = Array(24).fill(0);
          data?.peakVisits?.filter(v => v.standName === name).forEach(v => {
            standData[v.hour] = v.count;
          });
          
          const chartId = `peak-chart-${name.replace(/\s+/g, '-').toLowerCase()}`;
          const colors = ['#4318FF', '#6AD2FF', '#01B574', '#FFB547', '#E31A1A', '#A1E31A'];
          const color = colors[index % colors.length];

          return (
            <Card key={index} p="20px" bg={cardBg} borderRadius="20px" boxShadow="0px 18px 40px rgba(112, 144, 176, 0.12)">
              <Flex justify="space-between" align="center" mb="15px">
                <Text color={textColor} fontSize="md" fontWeight="700">{name}</Text>
                <IconButton
                  size="xs"
                  icon={<MdRefresh />}
                  onClick={() => resetZoom(chartId)}
                  variant="ghost"
                  aria-label="Reset zoom"
                />
              </Flex>
              <Chart
                options={{
                    ...peakChartOptions, 
                    chart: { ...peakChartOptions.chart, id: chartId, toolbar: { show: false } }, 
                    colors: [color],
                    xaxis: { ...peakChartOptions.xaxis, labels: { show: false } },
                    yaxis: { labels: { show: true, style: { colors: '#A3AED0' } } }
                }}
                series={[{ name: 'Visitas', data: standData }]}
                type="area"
                height="150px"
              />
            </Card>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}
