import { Container, Row, Col, Card } from 'react-bootstrap';

const AuthLayout = ({
  imageSrc,
  imageAlt,
  children,
  footer,
}) => (
  <Container fluid className="h-100">
    <Row className="justify-content-center align-content-center h-100">
      <Col xs="12" md="8" xxl="6">
        <Card className="h-100">
          <Card.Body>
            <Row className="p-5">
              <Col xs="12" md="6" className="d-flex align-items-center justify-content-center">
                <img src={imageSrc} alt={imageAlt} className="rounded-circle" />
              </Col>
              <Col xs="12" md="6" className="d-flex align-items-center justify-content-center">
                {children}
              </Col>
            </Row>
          </Card.Body>
          {footer && (
            <Card.Footer className="p-4">
              <div className="text-center">{footer}</div>
            </Card.Footer>
          )}
        </Card>
      </Col>
    </Row>
  </Container>
);

export default AuthLayout;
