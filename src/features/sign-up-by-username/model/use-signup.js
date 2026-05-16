import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveSession, setCredentials } from '@/entities/session';
import appRoutes from '@/shared/config/routes';

const useSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signup = async ({ username, password }) => {
    try {
      const response = await axios.post('/api/v1/signup', { username, password });
      const credentials = {
        token: response.data.token,
        username: response.data.username,
      };

      saveSession(credentials);
      dispatch(setCredentials(credentials));
      navigate(appRoutes.home, { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 409) {
        throw new Error('Такой пользователь уже существует');
      }

      throw new Error('Не удалось выполнить регистрацию. Попробуйте еще раз.');
    }
  };

  return signup;
};

export default useSignup;
