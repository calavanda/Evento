import './assets/css/App.css';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/admin';
import LandingPage from './views/landing/LandingPage';
import EventSurvey from './views/landing/EventSurvey';
import {
  ChakraProvider,
  // extendTheme
} from '@chakra-ui/react';
import initialTheme from './theme/theme'; //  { themeGreen }
import { useState } from 'react';
// Chakra imports

import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

export default function Main() {
  // eslint-disable-next-line
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        <Route
          path="admin/*"
          element={
            <>
              <SignedIn>
                <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route path="/" element={<LandingPage />} />
        <Route path="/evaluar-evento" element={<EventSurvey />} />
      </Routes>
    </ChakraProvider>
  );
}
