import {
  Alert, Button, Form, Modal,
} from 'react-bootstrap'

const ChannelNameModal = ({
  show,
  title,
  value,
  status,
  errors,
  touched,
  isSubmitting,
  isLoading,
  isSubmitDisabled = false,
  inputId,
  inputName,
  inputRef,
  inputAriaLabel,
  onHide,
  onEntered,
  onBlur,
  onChange,
  onSubmit,
  cancelLabel,
  submitLabel,
  submittingLabel,
}) => (
  <Modal
    show={show}
    onHide={() => {
      if (!isSubmitting) {
        onHide()
      }
    }}
    onEntered={onEntered}
    centered
  >
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {status && (
        <Alert variant="danger" className="mb-3">
          {status}
        </Alert>
      )}
      <Form noValidate onSubmit={onSubmit}>
        <Form.Group controlId={inputId}>
          <Form.Label htmlFor={inputId}>{inputAriaLabel}</Form.Label>
          <Form.Control
            ref={inputRef}
            id={inputId}
            name={inputName}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            isInvalid={touched && Boolean(errors)}
            disabled={isSubmitting}
            autoComplete="off"
            aria-label={inputAriaLabel}
          />
          <Form.Control.Feedback type="invalid">{errors}</Form.Control.Feedback>
        </Form.Group>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting || isLoading || isSubmitDisabled}
          >
            {isSubmitting || isLoading ? submittingLabel : submitLabel}
          </Button>
        </div>
      </Form>
    </Modal.Body>
  </Modal>
)

export default ChannelNameModal
