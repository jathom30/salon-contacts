import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import {BrowserRouter} from 'react-router-dom'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { IdentityContextProvider } from "react-netlify-identity"
import { WindowDimsContextProvider } from 'context';

const queryClient = new QueryClient()

const url ="https://salon-contacts.netlify.app"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <IdentityContextProvider url={url}>
      <QueryClientProvider client={queryClient}>
        <WindowDimsContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </WindowDimsContextProvider>
      </QueryClientProvider>
    </IdentityContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
