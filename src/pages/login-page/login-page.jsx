import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import image from './login-image.jpg';
import LoginForm from './login-form';

const LoginPage = () => (
  <Container fluid className="h-100">
    <Row className="justify-content-center align-content-center h-100">
      <Col xs="12" md="8" xxl="6">
        <Card className="h-100">
          <Card.Body>
            <Row className="p-5">
              <Col xs="12" md="6" className="d-flex align-items-center justify-content-center">
                <img src={image} alt="Войти" className="rounded-circle" />
              </Col>
              <Col xs="12" md="6" className="d-flex align-items-center justify-content-center">
                <LoginForm />
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer className="p-4">
            <div className="text-center">
              <span>Нет аккаунта? </span>
              <Link to="/signup">Регистрация</Link>
            </div>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default LoginPage;
