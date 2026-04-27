import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_INSTRUMENTS = gql`
  query GetInstruments {
    instruments {
      id
      name
      category
    }
  }
`;

export const useInstruments = () => {
  const { data, loading, error } = useQuery(GET_INSTRUMENTS, {
    fetchPolicy: 'cache-first',
  });

  return {
    instruments: data?.instruments || [],
    loading,
    error,
  };
};
