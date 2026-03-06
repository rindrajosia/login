import { SyntheticEvent, useState} from "react";
import axios from "axios";

interface Props {
  loginData: {
    id: number;
    email: string;
    password: string;
    qrUrl?: string;
    refreshToken?: string;
  };
  success: Function;
}

export const AuthenticatorForm = ({ loginData, success }: Props) => {
    const [code, setCode] = useState('');
    const setCookieFunctionSeconds = (name: string, seconds: number, value?: string) => {
      let expires = "";
      if (seconds) {
        const date = new Date();
        date.setTime(date.getTime() + seconds * 1000); // conversion en ms
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + value + expires + "; path=/";
    };

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setCookieFunctionSeconds("refreshToken", 86400, loginData.refreshToken);
        try {

          const { data } = await axios.post(
              "authentication/sign-in",
              {
                  email: loginData.email,
                  password: loginData.password,
                  tfaCode: code,
              },
              { withCredentials: true }
          );

          axios.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
          success();
        } catch (err) {
            console.error(err);
            alert("2FA verification failed");
        }
    };

    return (
    <>
      <form onSubmit={submit}>
        <h1 className="h3 mb-3 fw-normal">Please insert your authenticator code</h1>

        <div className="form-floating mb-2">
          <input
            className="form-control"
            placeholder="6 digits code"
            onChange={(e) => setCode(e.target.value)}
          />
          <label>6 digits code</label>
        </div>

        <button className="w-100 btn btn-lg btn-primary mt-3" type="submit">
          Submit
        </button>
      </form>

      {loginData.qrUrl && (
        <img src={loginData.qrUrl} alt="QR Code" style={{ width: "100%" }} />
      )}
    </>
  );
};