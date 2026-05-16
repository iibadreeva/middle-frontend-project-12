import { Formik } from 'formik';
import { Alert, Button, Form, Stack } from 'react-bootstrap';
import * as Yup from 'yup';
import { FormField } from '@/shared/ui/form-field';
import useSignup from '../model/use-signup.js';
import './signup-form.css';

const validationSchema = Yup.object({
  username: Yup.string()
    .required('Обязательное поле')
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов'),
  password: Yup.string()
    .required('Обязательное поле')
    .min(6, 'Не менее 6 символов'),
  confirmPassword: Yup.string()
    .required('Обязательное поле')
    .oneOf([Yup.ref('password')], 'Пароли должны совпадать'),
});

const SignupForm = () => {
  const signup = useSignup();

  return (
    <Formik
      initialValues={{ username: '', password: '', confirmPassword: '' }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setStatus, setSubmitting }) => {
        setStatus(null);

        try {
          await signup(values);
        } catch (error) {
          setStatus(error.message);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ handleSubmit, status, isSubmitting }) => (
        <Form noValidate onSubmit={handleSubmit} className="signup-form mx-auto w-100 px-sm-2">
          <h2 className="text-center mb-4">Регистрация</h2>
          <Stack gap={3}>
            {status && (
              <Alert variant="danger" className="mb-0">
                {status}
              </Alert>
            )}
            <FormField
              name="username"
              id="signup-username"
              type="text"
              label="Имя пользователя"
              placeholder="Имя пользователя"
              autoComplete="username"
              disabled={isSubmitting}
              autoFocus
            />
            <FormField
              name="password"
              id="signup-password"
              type="password"
              label="Пароль"
              placeholder="Пароль"
              autoComplete="new-password"
              disabled={isSubmitting}
            />
            <FormField
              name="confirmPassword"
              id="signup-confirm-password"
              type="password"
              label="Подтвердите пароль"
              placeholder="Подтвердите пароль"
              autoComplete="new-password"
              disabled={isSubmitting}
            />
            <Button
              variant="outline-primary"
              type="submit"
              size="md"
              className="w-100 mb-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default SignupForm;
