import { Formik } from 'formik';
import { Alert, Button, Form, Stack } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { FormField } from '@/shared/ui/form-field';
import useLogin from '../model/use-login.js';
import './login-form.css';

const LoginForm = () => {
  const login = useLogin();
  const { t } = useTranslation();
  const validationSchema = Yup.object({
    username: Yup.string()
      .required(t('validation.required'))
      .min(3, t('validation.usernameLength'))
      .max(20, t('validation.usernameLength')),
    password: Yup.string().required(t('validation.required')),
  });

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
          <h2 className="text-center mb-4">{t('auth.loginTitle')}</h2>
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
              label={t('auth.loginUsernameLabel')}
              placeholder={t('auth.loginUsernamePlaceholder')}
              autoComplete="username"
              disabled={isSubmitting}
            />
            <FormField
              name="password"
              id="login-password"
              type="password"
              label={t('auth.passwordLabel')}
              placeholder={t('auth.passwordPlaceholder')}
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
              {isSubmitting ? t('auth.loginSubmitting') : t('auth.loginSubmit')}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
