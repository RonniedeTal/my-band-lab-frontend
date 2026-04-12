import { useQuery } from '@apollo/client';
import { TEST_CONNECTION } from '@/graphql/queries/test.queries';

export const useTestConnection = () => {
  const { loading, error, data } = useQuery(TEST_CONNECTION, {
    fetchPolicy: 'network-only',
  });

  const isConnected = !loading && !error && !!data;

  return { isConnected, loading, error };
};
