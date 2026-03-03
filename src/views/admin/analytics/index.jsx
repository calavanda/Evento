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
} from '@chakra-ui/react';
import Chart from 'react-apexcharts';
import { MdBarChart, MdStar, MdTimeline, MdPeople } from 'react-icons/md';
import IconBox from 'components/icons/IconBox';

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
      const API_URL = process.env.REACT_APP_API_URL 
        ? (process.env.REACT_APP_API_URL.startsWith('http') 
            ? process.env.REACT_APP_API_URL 
            : `https://${process.env.REACT_APP_API_URL}`) 
        : 'http://localhost:5001';
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
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
    },
    xaxis: {
      categories: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      labels: { style: { colors: '#A3AED0', fontWeight: '500' } },
    },
    colors: ['#4318FF'],
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    dataLabels: { enabled: false },
    tooltip: { theme: 'dark' },
    grid: { borderColor: '#E0E5F2', strokeDashArray: 5 }
  };

  const peakChartData = Array(24).fill(0);
  data?.peakVisits?.forEach(v => {
    peakChartData[v._id] = v.count;
  });

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
                <Text color={textColor} fontSize="lg" fontWeight="700">Participación por Estand</Text>
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

        {/* Peak Visits Chart Card */}
        <Card p="30px" bg={cardBg} borderRadius="20px" boxShadow="0px 18px 40px rgba(112, 144, 176, 0.12)">
          <Flex align="center" mb="20px">
            <IconBox
              w='46px'
              h='46px'
              bg={boxBg}
              icon={<Icon w='24px' h='24px' as={MdTimeline} color="brand.200" />}
              me="15px"
            />
            <VStack align="start" spacing="0">
                <Text color={textColor} fontSize="lg" fontWeight="700">Picos de Visitas</Text>
                <Text color={textColorSecondary} fontSize="sm">Distribución por hora del día</Text>
            </VStack>
          </Flex>
          <Chart
            options={peakChartOptions}
            series={[{ name: 'Visitas', data: peakChartData }]}
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
    </Box>
  );
}
