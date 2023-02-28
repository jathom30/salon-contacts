import { Header, MaxHeightContainer, Modal } from 'components';
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import { useIdentityContext } from 'react-netlify-identity'
import { ContactListRoute, ContactRoute, CreateContactRoute, LoginRoute, AccountRecoveryRoute, UserRoute } from 'routes';
import './App.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn } = useIdentityContext()
  const location = useLocation()

  if (location.hash.includes('recovery_token')) {
    return (
      <AccountRecoveryRoute />
    )
  }

  return (isLoggedIn) ? children : <LoginRoute />
}

function App() {
  const { isLoggedIn, user, isConfirmedUser } = useIdentityContext()
  const { pathname } = useLocation()

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
        footer={
          isLoggedIn && !pathname.includes('user-settings') ? (
            <div className='main-banner'>
              <p><span>NOTICE:</span> This website will go offline as of <strong>February 2024</strong>. At that time users will no longer be able to retrieve client info. We have a new service up at <a href='https://www.salonclients.xyz' target="_blank" rel="noreferrer" className='link'>salonclients.xyz</a>. Follow the steps under <Link className='link' to="/user-settings">User Details</Link> to learn how to transfer your existing clients.</p>
            </div>
          ) : null
        }
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
          <Route path="/user-settings" element={
            <ProtectedRoute>
              <UserRoute />
            </ProtectedRoute>
          } />
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
