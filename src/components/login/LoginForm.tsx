import React, { SyntheticEvent, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

interface Props {
  loginData: (data: any) => void;
  success: () => void;
  setTfaRequired: (value: boolean) => void;
}

export const LoginForm = ({ loginData, success, setTfaRequired }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
        const { data } = await axios.post(
            "authentication/sign-in",
            {
              email,
              password,
            },
            { withCredentials: true }
        );

        axios.defaults.headers.common["Authorization"] =
            `Bearer ${data.accessToken}`;

        try {
            console.log("qsqsd");
            const qrResponse = await axios.post(
                "authentication/2fa/generate",
                {},
                {
                    responseType: "blob",
                    withCredentials: true,
                }
            );

            const url = URL.createObjectURL(qrResponse.data);
            loginData({ id: data.id, email, password, qrUrl: url, refreshToken: data.refreshToken });
            setTfaRequired(true);
        } catch (err: any) {
            success();
        }
   } catch (err: any) {
     console.error(err.response?.data || err.message);
    alert("Login failed");
   }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const { data } = await axios.post(
        "authentication/google",
        {
          token: credentialResponse.credential,
        },
        { withCredentials: true }
      );
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${data.accessToken}`;

      loginData(data);
      success();
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  };

  const handleGoogleError = () => {
    console.log("Google Login Failed");
    alert("Google login failed");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <form onSubmit={submit}>
        <h1 className="h3 mb-3 fw-normal">Sign in</h1>

        <div className="form-floating mb-2">
          <input
            type="email"
            className="form-control"
            placeholder="name@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email address</label>
        </div>

        <div className="form-floating mb-2">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>
        </div>

        <div className="mb-3">
          <Link to="/forgot">Forgot password?</Link>
        </div>

        <button className="w-100 btn btn-lg btn-primary" type="submit">
          Sign in
        </button>
      </form>

      <hr />

      {/* 🔥 Google Login moderne */}
      <div className="d-flex justify-content-center mt-3">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />
      </div>
    </div>
  );
};