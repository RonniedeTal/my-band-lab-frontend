// src/components/TestApollo.tsx
import { useQuery } from '@apollo/client';
import { TEST_CONNECTION } from '../graphql/queries/test.queries';

export function TestApollo() {
  const { loading, error, data } = useQuery(TEST_CONNECTION); // ← Eliminado alias 'testData'

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h3>Conexión GraphQL</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
