import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './services/apollo';
import { NotificationProvider } from './context/NotificationContext';
import { ToastContainer } from './components/ToastContainer';
import App from './App';
import './index.css';

console.log('🚀 Iniciando MyBandLab...');
console.log('🔗 Backend GraphQL:', import.meta.env.VITE_API_URL);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <NotificationProvider>
          <App />
          <ToastContainer />
        </NotificationProvider>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
);
