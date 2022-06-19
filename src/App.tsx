import { Header, MaxHeightContainer } from 'components';
import React from 'react';
import {Routes, Route} from 'react-router-dom'
import { ContactListRoute, ContactRoute, CreateContactRoute } from 'routes';
import './App.scss';

function App() {
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
