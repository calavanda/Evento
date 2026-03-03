// Chakra imports
import { Portal, Box, useDisclosure, Flex, Text, Spinner, Icon, Button, useColorModeValue } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin.js';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin.js';
import Sidebar from 'components/sidebar/Sidebar.js';
import { SidebarContext } from 'contexts/SidebarContext';
import React, { useState, useEffect, useCallback } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import routes from 'routes.js';
import { useUser, SignOutButton } from "@clerk/clerk-react";
import { getApiUrl } from 'utils/api';
import { MdLock } from 'react-icons/md';

// Custom Chakra theme
export default function Dashboard(props) {
  const { ...rest } = props;
  const { user, isLoaded: isClerkLoaded } = useUser();
  const location = useLocation();
  
  // Chakra hooks - always call at the top level
  const bg = useColorModeValue('gray.50', 'navy.900');
  
  // states and functions
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [authStatus, setAuthStatus] = useState('loading'); // loading, authorized, unauthorized
  const [userRole, setUserRole] = useState(null);
  const [filteredRoutes, setFilteredRoutes] = useState([]);

  // Función para verificar si el usuario logueado en Clerk está autorizado en nuestra base de datos
  const checkAuthorization = useCallback(async () => {
    try {
      const email = user.primaryEmailAddress?.emailAddress;
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/admins/check-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role);
        setAuthStatus('authorized');
        
        // Filtrar las rutas permitidas según el rol obtenido del backend
        const filtered = routes.filter(route => 
          route.roles && route.roles.includes(data.role)
        );
        setFilteredRoutes(filtered);
      } else {
        // Si no está en la lista de admins, se le asigna el rol 'public' con acceso limitado
        setUserRole('public');
        setAuthStatus('authorized');
        const filtered = routes.filter(route => 
          route.roles && route.roles.includes('public')
        );
        setFilteredRoutes(filtered);
      }
    } catch (error) {
      console.error("Auth check failed", error);
      setAuthStatus('unauthorized');
    }
  }, [user]);

  useEffect(() => {
    if (isClerkLoaded && user) {
      checkAuthorization();
    } else if (isClerkLoaded && !user) {
      setAuthStatus('unauthorized');
    }
  }, [isClerkLoaded, user, checkAuthorization]);

  const getRoute = () => {
    return location.pathname !== '/admin/full-screen-maps';
  };
  
  const getActiveRoute = (routesList) => {
    let activeRoute = 'Dashboard';
    for (let i = 0; i < routesList.length; i++) {
        if (location.pathname.indexOf(routesList[i].layout + routesList[i].path) !== -1) {
          return routesList[i].name;
        }
    }
    return activeRoute;
  };

  const getRoutes = (routesList) => {
    return routesList.map((route, key) => {
      if (route.layout === '/admin') {
        return (
          <Route path={`${route.path}`} element={route.component} key={key} />
        );
      }
      return null;
    });
  };

  document.documentElement.dir = 'ltr';
  const { onOpen } = useDisclosure();

  if (authStatus === 'loading' || !isClerkLoaded) {
    return (
      <Flex h="100vh" w="100vw" align="center" justify="center" bg={bg}>
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Flex>
    );
  }

  // Pantalla de "Acceso Denegado" si el correo no está registrado en la base de datos
  if (authStatus === 'unauthorized') {
    return (
      <Flex h="100vh" w="100vw" align="center" justify="center" bg={bg} direction="column" p="20px">
        <Icon as={MdLock} w="60px" h="60px" color="red.500" mb="20px" />
        <Text fontSize="24px" fontWeight="800" mb="10px" textAlign="center">Acceso Denegado</Text>
        <Text fontSize="md" color="secondaryGray.600" mb="30px" textAlign="center">
          Lo sentimos, tu correo ({user?.primaryEmailAddress?.emailAddress}) no está autorizado para acceder al panel de administración.
        </Text>
        <SignOutButton>
          <Button colorScheme="brand" borderRadius="15px" px="40px">Cerrar Sesión</Button>
        </SignOutButton>
      </Flex>
    );
  }

  return (
    <Box>
      <Box>
        <SidebarContext.Provider
          value={{
            toggleSidebar,
            setToggleSidebar,
          }}
        >
          <Sidebar routes={filteredRoutes} display="none" {...rest} />
          <Box
            float="right"
            minHeight="100vh"
            height="100%"
            overflow="auto"
            position="relative"
            maxHeight="100%"
            w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
            maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
            transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
            transitionDuration=".2s, .2s, .35s"
            transitionProperty="top, bottom, width"
            transitionTimingFunction="linear, linear, ease"
          >
            <Portal>
              <Box>
                <Navbar
                  onOpen={onOpen}
                  logoText={'Francophonie'}
                  brandText={getActiveRoute(filteredRoutes)}
                  userRole={userRole}
                  secondary={false}
                  fixed={fixed}
                  {...rest}
                />
              </Box>
            </Portal>

            {getRoute() ? (
              <Box
                mx="auto"
                p={{ base: '20px', md: '30px' }}
                pe="20px"
                minH="100vh"
                pt="50px"
              >
                <Routes>
                  {getRoutes(filteredRoutes)}
                  <Route
                    path="/"
                    element={<Navigate to="/admin/default" replace />}
                  />
                  {/* Catch-all route to redirect back to default if unauthorized for specific route */}
                  <Route path="*" element={<Navigate to="/admin/default" replace />} />
                </Routes>
              </Box>
            ) : null}
            <Box>
              <Footer />
            </Box>
          </Box>
        </SidebarContext.Provider>
      </Box>
    </Box>
  );
}
