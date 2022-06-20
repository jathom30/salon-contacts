import { Header, MaxHeightContainer } from 'components';
import React, { useEffect } from 'react';
import {Routes, Route} from 'react-router-dom'
import { ContactListRoute, ContactRoute, CreateContactRoute } from 'routes';
import './App.scss';

function App() {
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
        header={<Header />}
      >
        <Routes>
          <Route path="/" element={<ContactListRoute />} />
          <Route path="/create-new" element={<CreateContactRoute />} />
          <Route path="/:id" element={<ContactRoute />} />
        </Routes>
      </MaxHeightContainer>
      
    </div>
  );
}

export default App;

// ! TODO
// Loader
// InputLabel on ContactRoute to edit in place
// Edit/delete notes