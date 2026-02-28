import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdPeople,
  MdTableChart,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import ParticipantRegister from 'views/admin/participants';
import ParticipantManagement from 'views/admin/participants/Management';
import StandManagement from 'views/admin/stands';
import VisitScanner from 'views/admin/scanner';
import SurveySatisfaction from 'views/admin/surveys';
import Analytics from 'views/admin/analytics';




const routes = [
  {
    name: 'Panel Principal',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Registro de Participantes',
    layout: '/admin',
    path: '/participants',
    icon: <Icon as={MdPeople} width="20px" height="20px" color="inherit" />,
    component: <ParticipantRegister />,
  },
  {
    name: 'Gestión de Usuarios',
    layout: '/admin',
    path: '/user-management',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <ParticipantManagement />,
  },
  {
    name: 'Gráficas de Información',
    layout: '/admin',
    path: '/analytics',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: <Analytics />,
  },
  {
    name: 'Gestión de Estands',
    layout: '/admin',
    path: '/stands',
    icon: <Icon as={MdTableChart} width="20px" height="20px" color="inherit" />,
    component: <StandManagement />,
  },
  {
    name: 'Escanear QR',
    layout: '/admin',
    path: '/scanner',
    icon: <Icon as={MdQrCode} width="20px" height="20px" color="inherit" />,
    component: <VisitScanner />,
  },
  {
    name: 'Encuesta',
    layout: '/admin',
    path: '/survey',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: <SurveySatisfaction />,
  },
];

export default routes;
