import { Header, MaxHeightContainer } from 'components';
import React, { useEffect } from 'react';
import {Routes, Route} from 'react-router-dom'
import { useIdentityContext } from 'react-netlify-identity'
import { ContactListRoute, ContactRoute, CreateContactRoute, LoginRoute } from 'routes';
import './App.scss';

const ProtectedRoute = ({children}: {children: JSX.Element}) => {
  const { isLoggedIn } = useIdentityContext()
  return (isLoggedIn) ? children : <LoginRoute />
}

function App() {
  const { isLoggedIn } = useIdentityContext()

  useEffect(() => {
    const handleResize = () => {
      const doc = document.documentElement
      doc.style.setProperty('--app-height', `${window.innerHeight}px`)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  return (
    <div className="App">
      <MaxHeightContainer
        fullHeight
        header={(isLoggedIn) && <Header />}
      >
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <ContactListRoute />
            </ProtectedRoute>
          } />
          <Route path="/create-new" element={
            <ProtectedRoute>
              <CreateContactRoute />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/:id" element={
            <ProtectedRoute>
              <ContactRoute />
            </ProtectedRoute>
          } />
        </Routes>
      </MaxHeightContainer>
      
    </div>
  );
}

export default App;

// ! TODO
// Auth
// push to github
// deploy