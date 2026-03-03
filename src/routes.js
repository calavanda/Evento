import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdPeople,
  MdTableChart,
  MdQrCode2,
  MdAdminPanelSettings,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import ParticipantRegister from 'views/admin/participants';
import ParticipantManagement from 'views/admin/participants/Management';
import StandManagement from 'views/admin/stands';
import VisitScanner from 'views/admin/scanner';
import SurveySatisfaction from 'views/admin/surveys';
import Analytics from 'views/admin/analytics';
import AdminManagement from 'views/admin/admins';


const routes = [
  {
    name: 'Panel Principal',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
    roles: ['admin', 'moderador', 'escaneador'],
  },
  {
    name: 'Administradores',
    layout: '/admin',
    path: '/admins',
    icon: <Icon as={MdAdminPanelSettings} width="20px" height="20px" color="inherit" />,
    component: <AdminManagement />,
    roles: ['admin'],
  },
  {
    name: 'Registro de Participantes',
    layout: '/admin',
    path: '/participants',
    icon: <Icon as={MdPeople} width="20px" height="20px" color="inherit" />,
    component: <ParticipantRegister />,
    roles: ['admin', 'moderador'],
  },
  {
    name: 'Gestión de Usuarios',
    layout: '/admin',
    path: '/user-management',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <ParticipantManagement />,
    roles: ['admin', 'moderador'],
  },
  {
    name: 'Gráficas de Información',
    layout: '/admin',
    path: '/analytics',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: <Analytics />,
    roles: ['admin', 'moderador', 'escaneador', 'public'],
  },
  {
    name: 'Gestión de Estands',
    layout: '/admin',
    path: '/stands',
    icon: <Icon as={MdTableChart} width="20px" height="20px" color="inherit" />,
    component: <StandManagement />,
    roles: ['admin', 'moderador'],
  },
  {
    name: 'Escanear QR',
    layout: '/admin',
    path: '/scanner',
    icon: <Icon as={MdQrCode2} width="20px" height="20px" color="inherit" />,
    component: <VisitScanner />,
    roles: ['admin', 'escaneador'],
  },
  {
    name: 'Encuesta',
    layout: '/admin',
    path: '/survey',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: <SurveySatisfaction />,
    roles: ['admin', 'escaneador'],
  },
];

export default routes;
