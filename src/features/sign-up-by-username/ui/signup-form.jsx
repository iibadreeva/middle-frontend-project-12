import { Formik } from 'formik';
import { Alert, Button, Form, Stack } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { FormField } from '@/shared/ui/form-field';
import useSignup from '../model/use-signup.js';
import './signup-form.css';

const SignupForm = () => {
  const signup = useSignup();
  const { t } = useTranslation();
  const validationSchema = Yup.object({
    username: Yup.string()
      .required(t('validation.required'))
      .min(3, t('validation.usernameLength'))
      .max(20, t('validation.usernameLength')),
    password: Yup.string().required(t('validation.required')).min(6, t('validation.passwordMin')),
    confirmPassword: Yup.string()
      .required(t('validation.required'))
      .oneOf([Yup.ref('password')], t('validation.passwordsMatch')),
  });

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
          <h2 className="text-center mb-4">{t('auth.signupTitle')}</h2>
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
              label={t('auth.signupUsernameLabel')}
              placeholder={t('auth.signupUsernamePlaceholder')}
              autoComplete="username"
              disabled={isSubmitting}
              autoFocus
            />
            <FormField
              name="password"
              id="signup-password"
              type="password"
              label={t('auth.passwordLabel')}
              placeholder={t('auth.passwordPlaceholder')}
              autoComplete="new-password"
              disabled={isSubmitting}
            />
            <FormField
              name="confirmPassword"
              id="signup-confirm-password"
              type="password"
              label={t('auth.confirmPasswordLabel')}
              placeholder={t('auth.confirmPasswordPlaceholder')}
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
              {isSubmitting ? t('auth.signupSubmitting') : t('auth.signupSubmit')}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default SignupForm;
