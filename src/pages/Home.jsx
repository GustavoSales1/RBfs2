import { Container, Row, Col, Image } from 'react-bootstrap';

function Home() {
  return (
    <Container className="mt-5">
      <Row>
        <Col md={6}>
          <h1>Bem-vindo ao Sistema RBFS</h1>
          <p>
            Um sistema pensado no bem estar animal
          </p>
          
        </Col>
        <Col md={6}>
          <Image src="../assets/desenhos-minimalistas-animais-differantly-cavalo.jpg" fluid rounded />
        </Col>
      </Row>
    </Container>
  );
}

export default Home;