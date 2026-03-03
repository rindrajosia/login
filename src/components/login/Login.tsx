import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "../../redux/authSlice";
import { LoginForm } from "./LoginForm";
import { AuthenticatorForm } from "./AuthenticatorForm";

interface LoginDataType {
  id: number;
  email: string;
  password: string;
  qrUrl?: string;
}

export const Login = () => {
  const dispatch = useDispatch();
  const [redirect, setRedirect] = useState(false);
  const [loginData, setLoginData] = useState<LoginDataType>({
    id: 0,
    email: '',
    password: '',
  });
  const [tfaRequired, setTfaRequired] = useState(false);

  const success = () => {
    setRedirect(true);
    dispatch(setAuth(true));
  };

  if (redirect) return <Navigate to="/" />;

  return (
    <main className="form-signin">
      {loginData.id === 0 ? (
        <LoginForm
          loginData={setLoginData}
          setTfaRequired={setTfaRequired}
          success={success}
        />
      ) : tfaRequired ? (
        <AuthenticatorForm loginData={loginData} success={success} />
      ) : null}
    </main>
  );
};
