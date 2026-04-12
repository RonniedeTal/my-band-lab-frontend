// src/services/apollo.ts
import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Usar URL completa para desarrollo
const GRAPHQL_URL = 'http://localhost:9000/graphql';

console.log('🔗 Conectando a GraphQL:', GRAPHQL_URL);

const httpLink = createHttpLink({
  uri: GRAPHQL_URL,
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('auth_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const combinedLink = from([authLink, httpLink]);

export const client = new ApolloClient({
  link: combinedLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  devtools: {
    enabled: true,
  },
});

export const getAuthToken = () => localStorage.getItem('auth_token');
export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
  client.resetStore();
};
export const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
  client.resetStore();
};
