import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  useEffect, useMemo, useState, createContext,
} from 'react';
import { Provider } from 'urql';

import urqlClient from '../clients/urql';

type AuthContextData = {
  readonly token: string | null,
  readonly isLoggedIn: boolean,
  readonly logout: () => void,
  readonly login: (token: string) => void
}

export const AuthContext = createContext<AuthContextData>({
  token: null,
  isLoggedIn: false,
  logout: () => { },
  login: () => { },
});

const AUTH_TOKEN_KEY = 'AUTH_TOKEN';

const AuthProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      console.log('got token', token);
      console.log(AUTH_TOKEN_KEY);
      setToken(token);
    };
    void init();
  }, []);

  const value = useMemo<AuthContextData>(() => ({
    isLoggedIn: !!token,
    token,
    login: (token: string) => {
      console.log('login', token);
      setToken(token);
      void AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    },
    logout: () => {
      setToken(null);
      void AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    },
  }), [token]);

  const client = useMemo(() => urqlClient(token), [token]);

  return (
    <AuthContext.Provider value={value}>
      <Provider value={client}>
        {children}
      </Provider>
    </AuthContext.Provider>
  );
};

export default AuthProvider;