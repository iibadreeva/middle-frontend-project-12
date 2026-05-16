import { Card, Col, Container, Row } from 'react-bootstrap';
import './chat-layout.css';

const ChatLayout = ({ sidebar, header, messages, composer }) => (
  <section className="chatPage bg-light container my-4">
    <Container fluid className="h-100">
      <Row className="justify-content-center h-100">
        <Col xs="12" xxl="12" className="h-100">
          <Card className="shadow chatCard border-0 overflow-hidden">
            <Row className="g-0 h-100">
              <Col xs="4" md="3" lg="2" className="border-end bg-white chatSidebar">
                <div className="d-flex flex-column h-100 chatSidebarContent">{sidebar}</div>
              </Col>
              <Col className="d-flex flex-column h-100 bg-white chatMain">
                {header}
                <div className="flex-grow-1 chatMessages">{messages}</div>
                <div className="px-4 py-3 chatComposerForm">{composer}</div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  </section>
);

export default ChatLayout;
