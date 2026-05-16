import { Formik } from 'formik';
import { Alert, Button, Form, Stack } from 'react-bootstrap';
import * as Yup from 'yup';
import { FormField } from '@/shared/ui/form-field';
import useLogin from '../model/use-login.js';
import './login-form.css';

const validationSchema = Yup.object({
  username: Yup.string()
    .required('Обязательное поле')
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов'),
  password: Yup.string().required('Обязательное поле'),
});

const LoginForm = () => {
  const login = useLogin();

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setStatus, setSubmitting }) => {
        setStatus(null);

        try {
          await login(values);
        } catch (error) {
          setStatus(error.message);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ handleSubmit, status, isSubmitting }) => (
        <Form noValidate onSubmit={handleSubmit} className="login-form mx-auto w-100 px-sm-2">
          <h2 className="text-center mb-4">Войти</h2>
          <Stack gap={3}>
            {status && (
              <Alert variant="danger" className="mb-0">
                {status}
              </Alert>
            )}
            <FormField
              name="username"
              id="login-username"
              type="text"
              label="Ваш ник"
              placeholder="Ваш ник"
              autoComplete="username"
              disabled={isSubmitting}
            />
            <FormField
              name="password"
              id="login-password"
              type="password"
              label="Пароль"
              placeholder="Пароль"
              autoComplete="current-password"
              disabled={isSubmitting}
            />
            <Button
              variant="outline-primary"
              type="submit"
              size="md"
              className="w-100 mb-3 "
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Вход...' : 'Войти'}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
