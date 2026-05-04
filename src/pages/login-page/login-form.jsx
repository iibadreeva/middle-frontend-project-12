import { Formik, Field } from 'formik';
import { Form, Button, Stack } from 'react-bootstrap';
import * as Yup from 'yup';
import './login-form.css';

const validationSchema = Yup.object({
  username: Yup.string()
    .required('Обязательное поле')
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов'),
  password: Yup.string().required('Обязательное поле'),
});

const LoginForm = () => (
  <Formik
    initialValues={{ username: '', password: '' }}
    validationSchema={validationSchema}
    onSubmit={(values) => {
      console.log(values);
    }}
  >
    {({ handleSubmit }) => (
      <Form noValidate onSubmit={handleSubmit} className="login-form mx-auto w-100 px-sm-2">
        <h2 className="text-center mb-4">Войти</h2>
        <Stack gap={3}>
          <Field name="username">
            {({ field, meta }) => (
              <div className="form-floating">
                <Form.Control
                  id="login-username"
                  type="text"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Ваш ник"
                  autoComplete="username"
                  className="rounded-3"
                  isInvalid={meta.touched && Boolean(meta.error)}
                />
                <Form.Label htmlFor="login-username">Ваш ник</Form.Label>
                <Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>
              </div>
            )}
          </Field>
          <Field name="password">
            {({ field, meta }) => (
              <div className="form-floating">
                <Form.Control
                  id="login-password"
                  type="password"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Пароль"
                  autoComplete="current-password"
                  className="rounded-3"
                  isInvalid={meta.touched && Boolean(meta.error)}
                />
                <Form.Label htmlFor="login-password">Пароль</Form.Label>
                <Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>
              </div>
            )}
          </Field>
          <Button variant="outline-primary" type="submit" size="md" className="w-100 mb-3 ">
            Войти
          </Button>
        </Stack>
      </Form>
    )}
  </Formik>
);

export default LoginForm;
