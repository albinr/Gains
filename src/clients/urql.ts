import { createClient } from 'urql';

// const URL = 'http://robmax.local:4242/graphql';
const { REACT_APP_BACKEND_ROOT_URL = 'https://healthcloud-staging.herokuapp.com' } = process.env;
const graphqlRootUrl = `${REACT_APP_BACKEND_ROOT_URL}/graphql`;

const createClientWithToken = (token: string | null) => {
  const client = createClient({
    url: graphqlRootUrl,
    requestPolicy: 'cache-and-network',
    fetchOptions: () => ({
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    }),
  });

  return client;
};

export default createClientWithToken;