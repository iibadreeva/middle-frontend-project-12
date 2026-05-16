import { Toast, ToastContainer } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast, selectToasts } from '@/shared/model/toasts';

const AppToasts = () => {
  const dispatch = useDispatch();
  const toasts = useSelector(selectToasts);

  return (
    <ToastContainer position="top-end" className="p-3 position-fixed top-0 end-0">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          onClose={() => dispatch(removeToast(toast.id))}
          delay={3000}
          autohide
          className={`shadow-sm border-0 border-start border-4 ${
            toast.variant === 'success' ? 'border-success' : 'border-secondary'
          }`}
        >
          <Toast.Header closeButton>
            <strong className="me-auto">{toast.title}</strong>
          </Toast.Header>
          <Toast.Body>{toast.message}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default AppToasts;
