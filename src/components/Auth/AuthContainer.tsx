import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthContainerProps {
  onAuthSuccess: () => void;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitchToRegister = () => {
    setIsLogin(false);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
  };

  const handleSuccess = () => {
    onAuthSuccess();
  };

  return (
    <>
      {isLogin ? (
        <LoginForm 
          onSwitchToRegister={handleSwitchToRegister}
          onLoginSuccess={handleSuccess}
        />
      ) : (
        <RegisterForm 
          onSwitchToLogin={handleSwitchToLogin}
          onRegisterSuccess={handleSuccess}
        />
      )}
    </>
  );
};

export default AuthContainer;