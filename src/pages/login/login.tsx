import React, { FC, useCallback, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { Navigate } from 'react-router-dom';
import {
  getError,
  getUserState,
  loginUser
} from '../../services/slices/userSlice';

export const Login: FC = () => {
  const [userData, setUserData] = React.useState({ email: '', password: '' });
  const errorMessage = useSelector(getError);
  const { isAuthenticated } = useSelector(getUserState);
  const dispatch = useDispatch();

  if (isAuthenticated) {
    return <Navigate to='/' />;
  }

  const submitForm = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      const { email, password } = userData;
      if (email && password) {
        dispatch(loginUser({ email, password }));
      }
    },
    [userData, dispatch]
  );

  const setEmail = useCallback((value: React.SetStateAction<string>) => {
    setUserData((prev) => ({
      ...prev,
      email: typeof value === 'function' ? value(prev.email) : value
    }));
  }, []);

  const setPassword = useCallback((value: React.SetStateAction<string>) => {
    setUserData((prev) => ({
      ...prev,
      password: typeof value === 'function' ? value(prev.password) : value
    }));
  }, []);

  return (
    <LoginUI
      errorText={errorMessage?.toString()}
      email={userData.email}
      setEmail={setEmail}
      password={userData.password}
      setPassword={setPassword}
      handleSubmit={submitForm}
    />
  );
};
