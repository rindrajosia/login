import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8000/api/';

let refresh = false;

axios.interceptors.response.use(resp => resp, async error => {
    const setCookieFunctionSeconds = (name: string, seconds: number, value?: string) => {
      let expires = "";
      if (seconds) {
        const date = new Date();
        date.setTime(date.getTime() + seconds * 1000); // conversion en ms
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + value + expires + "; path=/";
    };
    if (error.response.status === 401 && !refresh) {
        refresh = true;

        const response = await axios.post('authentication/refresh-tokens', {}, {withCredentials: true});

        if (response.status === 200) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            //setCookieFunctionSeconds("refreshToken", 86400, response.data.refreshToken);
            return axios(error.config);
        }
    }
    refresh = false;
    return error;
});
