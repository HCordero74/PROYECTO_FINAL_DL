import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Importamos las imágenes locales si las guardaste en src/assets/
import berlinesImg from '../assets/berlines.jpg';
import tortaImg from '../assets/Torta.jpg';

export default function Home() {
  const navigate = useNavigate();

  const familias = [
    {
      id: 'pan',
      nombre: 'PAN',
      desc: 'Hallullas, marraquetas, pan amasado y más',
      color: '#E8A598',
      img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 'pasteleria',
      nombre: 'PASTELERÍA',
      desc: 'Berlines, kuchenes, chilenitos y dulces tradicionales',
      color: '#E8A598',
      img: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 'tortas',
      nombre: 'TORTAS',
      desc: 'Hojarasca, bizcochos artesanales y tortas a pedido',
      color: '#E8A598',
      img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 'cafe',
      nombre: 'CAFÉ',
      desc: 'Café de grano recién molido, batido y especialidades',
      color: '#E8A598',
      img: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=400&auto=format&fit=crop'
    }
  ];

  return (
    <div style={{ backgroundColor: '#F5ECE5', minHeight: '90vh' }} className="py-5">
      <Container>
        {/* Encabezado Principal con alineación vertical perfecta */}
        <div className="mb-5">
          <Row className="align-items-center justify-content-center">
            {/* Foto de los Berlines (Izquierda) */}
            <Col xs={3} md={2} className="text-end">
              <Image 
                src={berlinesImg} 
                alt="Berlines artesanales" 
                roundedCircle 
                className="shadow-sm border border-warning"
                style={{ width: '130px', height: '130px', objectFit: 'cover' }}
              />
            </Col>

            {/* Título y Botón Principal (Centro) */}
            <Col xs={6} md={8} className="text-center">
              <h1 className="fw-bold text-dark fs-2 mb-2" style={{ letterSpacing: '1px' }}>
                PANADERÍA Y PASTELERÍA LUCY: TRADICIÓN Y SABOR ARTESANAL
              </h1>
              <p className="text-muted fw-semibold fs-5 mb-3">
                ENCUENTRE EL MEJOR PAN, TORTAS, DULCES ARTESANALES Y CAFÉ RECIÉN MOLIDO
              </p>
              <Button 
                variant="outline-dark" 
                size="md" 
                className="px-4 py-2 fw-bold text-uppercase"
                onClick={() => navigate('/tienda')}
              >
                VER TIENDA COMPLETA
              </Button>
            </Col>

            {/* Foto de la Torta (Derecha) */}
            <Col xs={3} md={2} className="text-start">
              <Image 
                src={tortaImg} 
                alt="Torta artesanal" 
                roundedCircle 
                className="shadow-sm border border-warning"
                style={{ width: '130px', height: '130px', objectFit: 'cover' }}
              />
            </Col>
          </Row>
        </div>

        {/* Tarjetas de Familias de Productos */}
        <Row xs={1} sm={2} md={4} className="g-4 mt-2">
          {familias.map((fam) => (
            <Col key={fam.id}>
              <Card 
                className="h-100 border-0 shadow-sm rounded-3 text-center"
                style={{ backgroundColor: fam.color, transition: 'transform 0.2s', cursor: 'pointer' }}
                onClick={() => navigate(`/tienda?categoria=${fam.id}`)}
              >
                <Card.Img 
                  variant="top" 
                  src={fam.img} 
                  style={{ height: '160px', objectFit: 'cover' }} 
                  className="rounded-top-3"
                />
                <Card.Body className="d-flex flex-column justify-content-center p-4">
                  <h3 className="fw-bold text-dark m-0 fs-3 text-uppercase">{fam.nombre}</h3>
                  <p className="text-dark-50 small mt-2 mb-0">{fam.desc}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}