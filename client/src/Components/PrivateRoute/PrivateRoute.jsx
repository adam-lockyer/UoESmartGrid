import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const auth = useSelector(state => state.auth);
  const { isAuthenticated, loading } = auth;
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // If authenticated, render the children
  return children;
};

export default PrivateRoute;

