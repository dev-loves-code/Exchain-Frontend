// src/context/LoadingContext.jsx
import React, { createContext, useState, useContext } from 'react';
import Loading from '../components/Loading.jsx';


const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('Loading...');

  const showLoading = (message) => {
    setText(message || 'Loading...');
    setLoading(true);
  };

  const hideLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
      {children}
      {loading && <Loading fullScreen text={text} />}
    </LoadingContext.Provider>
  );
};
