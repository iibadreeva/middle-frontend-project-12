import { Field } from 'formik';
import { Form } from 'react-bootstrap';

const FormField = ({
  name,
  id,
  type,
  label,
  placeholder,
  autoComplete,
  disabled,
  autoFocus,
}) => (
  <Field name={name}>
    {({ field, meta }) => (
      <div className="form-floating">
        <Form.Control
          id={id}
          type={type}
          name={field.name}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="rounded-3"
          isInvalid={meta.touched && Boolean(meta.error)}
          disabled={disabled}
          autoFocus={autoFocus}
        />
        <Form.Label htmlFor={id}>{label}</Form.Label>
        <Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>
      </div>
    )}
  </Field>
);

export default FormField;
