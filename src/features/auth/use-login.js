import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setCredentials } from './auth-slice';
import { saveAuth } from './auth-storage.js';

const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const login = async (values) => {
    try {
      const response = await axios.post('/api/v1/login', values);
      const credentials = {
        token: response.data.token,
        username: response.data.username,
      };

      saveAuth(credentials);
      dispatch(setCredentials(credentials));

      const nextPath = location.state && location.state.from
        ? location.state.from.pathname
        : '/';

      navigate(nextPath, { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        throw new Error('Неверные имя пользователя или пароль');
      }

      throw new Error('Не удалось выполнить вход. Попробуйте еще раз.');
    }
  };

  return login;
};

export default useLogin;
