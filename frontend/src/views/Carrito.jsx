import { useContext, useState } from 'react';
import { Container, Table, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { LucyContext } from '../context/LucyContext';

export default function Carrito() {
  const { carrito, incrementarCount, decrementarCount, eliminarDelCarrito, vaciarCarrito, user } = useContext(LucyContext);
  const [compraExitosa, setCompraExitosa] = useState(false);
  const navigate = useNavigate();

  const total = carrito.reduce((acc, item) => acc + item.price * item.count, 0);

  const handlePagar = () => {
    if (!user) {
      alert('Debes iniciar sesión para finalizar tu pedido.');
      navigate('/login');
      return;
    }

    setCompraExitosa(true);
    setTimeout(() => {
      vaciarCarrito();
      setCompraExitosa(false);
      navigate('/perfil');
    }, 2500);
  };

  if (compraExitosa) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="success" className="p-5 shadow-sm">
          <h2 className="fw-bold mb-3">🎉 ¡Pedido Realizado con Éxito!</h2>
          <p className="fs-5">Gracias por tu compra en Panadería y Pastelería Lucy. Estamos preparando tu pedido.</p>
        </Alert>
      </Container>
    );
  }

  if (carrito.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Card className="p-5 shadow-sm border-0">
          <div className="fs-1 mb-3">🛒</div>
          <h3 className="fw-bold">Tu carrito está vacío</h3>
          <p className="text-muted">Parece que aún no has agregado productos artesanales a tu pedido.</p>
          <div>
            <Button variant="warning" className="fw-bold text-dark mt-3" onClick={() => navigate('/tienda')}>
              Ir a la Tienda
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4 text-dark">🛒 Carrito de Compras</h2>
      <Row className="g-4">
        <Col lg={8}>
          <Card className="shadow-sm border-0 p-3">
            <Table responsive align="middle" className="mb-0">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="text-center">Precio</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-end">Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img 
                          src={item.img} 
                          alt={item.name} 
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} 
                        />
                        <span className="fw-semibold">{item.name}</span>
                      </div>
                    </td>
                    <td className="text-center">${item.price?.toLocaleString('es-CL')}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => decrementarCount(item.id)}
                        >
                          -
                        </Button>
                        <span className="fw-bold px-2">{item.count}</span>
                        <Button 
                          variant="outline-success" 
                          size="sm" 
                          onClick={() => incrementarCount(item.id)}
                        >
                          +
                        </Button>
                      </div>
                    </td>
                    <td className="text-end fw-bold">${(item.price * item.count).toLocaleString('es-CL')}</td>
                    <td className="text-center">
                      <Button 
                        variant="link" 
                        className="text-danger p-0 border-0" 
                        onClick={() => eliminarDelCarrito(item.id)}
                        title="Eliminar producto"
                      >
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>

        {/* Resumen del Pedido */}
        <Col lg={4}>
          <Card className="shadow-sm border-0 p-4">
            <h4 className="fw-bold mb-3">Resumen de la Compra</h4>
            <div className="d-flex justify-content-between mb-2 text-muted">
              <span>Productos ({carrito.reduce((acc, item) => acc + item.count, 0)}):</span>
              <span>${total.toLocaleString('es-CL')}</span>
            </div>
            <div className="d-flex justify-content-between mb-3 text-muted">
              <span>Despacho:</span>
              <span className="text-success fw-semibold">Gratis</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fs-4 fw-bold mb-4">
              <span>Total:</span>
              <span className="text-success">${total.toLocaleString('es-CL')}</span>
            </div>
            <Button 
              variant="warning" 
              size="lg" 
              className="w-100 fw-bold text-dark"
              onClick={handlePagar}
            >
              Ir a Pagar 💳
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}