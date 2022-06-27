import { Button, Header, MaxHeightContainer, Modal } from 'components';
import React, { useEffect } from 'react';
import {Routes, Route, useLocation} from 'react-router-dom'
import { useIdentityContext } from 'react-netlify-identity'
import { ContactListRoute, ContactRoute, CreateContactRoute, LoginRoute, PasswordResetRoute, UserRoute } from 'routes';
import './App.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const ProtectedRoute = ({children}: {children: JSX.Element}) => {
  const { isLoggedIn } = useIdentityContext()
  const location = useLocation()

  if (location.hash.includes('recovery_token')) {
    return (
      <PasswordResetRoute />
    )
  }

  return (isLoggedIn) ? children : <LoginRoute />
}

function App() {
  const { isLoggedIn, user, isConfirmedUser } = useIdentityContext()

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
        header={isLoggedIn && <Header />}
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
          {/* <Route path="/user" element={
            <ProtectedRoute>
              <UserRoute />
            </ProtectedRoute>
          } /> */}
          <Route path="/:id" element={
            <ProtectedRoute>
              <ContactRoute />
            </ProtectedRoute>
          } />
        </Routes>
      </MaxHeightContainer>
      {isLoggedIn && !isConfirmedUser && (
        <Modal>
          <div className="App__modal">
            <FontAwesomeIcon color="var(--color-primary)" icon={faEnvelope} size="5x" />
            <h2>Verify your email address</h2>
            <p>A verification email has been sent to {user?.email}. To complete the sign up process, please click the link in the email.</p>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default App;
