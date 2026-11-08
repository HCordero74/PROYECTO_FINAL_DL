import { Container, Row, Col } from 'react-bootstrap';

export default function FooterLucy() {
  return (
    <footer style={{ backgroundColor: '#3E2723', color: '#FFF8E7' }} className="py-4 mt-5">
      <Container>
        <Row className="align-items-center text-center text-md-start">
          <Col md={4} className="mb-3 mb-md-0">
            <h5 className="fw-bold text-warning mb-2">🥖 Panadería y Pastelería Lucy</h5>
            <p className="small mb-0 text-light">
              Elaboración artesanal con la mejor tradición y sabor.
            </p>
          </Col>
          
          <Col md={4} className="mb-3 mb-md-0 text-center">
            <h6 className="fw-bold text-warning mb-2">📍 Ubicación</h6>
            <p className="small mb-0">Avda. Las Palmas N° 1313</p>
          </Col>

          <Col md={4} className="text-center text-md-end">
            <h6 className="fw-bold text-warning mb-2">📞 Teléfonos de Contacto</h6>
            <p className="small mb-1">
              📱 +56 9 64398133
            </p>
            <p className="small mb-0">
              📱 +56 9 44184983
            </p>
          </Col>
        </Row>
        <hr className="my-3 border-warning" />
        <div className="text-center small text-muted">
          © 2026 Panadería y Pastelería Lucy - Todos los derechos reservados.
        </div>
      </Container>
    </footer>
  );
}