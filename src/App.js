import './assets/css/App.css';
import { Routes, Route } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import PollLayout from './layouts/poll';
import LandingPage from './views/landing/LandingPage';
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
        <Route path="auth/*" element={<AuthLayout />} />
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
        <Route
          path="poll/*"
          element={
            <>
              <SignedIn>
                <PollLayout theme={currentTheme} setTheme={setCurrentTheme} />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </ChakraProvider>
  );
}
