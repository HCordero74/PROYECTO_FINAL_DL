import { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import { LucyContext } from '../context/LucyContext';

export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { productos, setProductos, carrito, setCarrito } = useContext(LucyContext);
  const [cantidad, setCantidad] = useState(1);

  // Buscamos el producto en tiempo real desde el contexto
  const producto = productos.find((p) => p.id == id);

  if (!producto) {
    return (
      <Container className="py-5 text-center">
        <Card className="p-5 border-0 shadow-sm">
          <h3>Producto no encontrado</h3>
          <Button variant="warning" className="mt-3" onClick={() => navigate('/tienda')}>
            Volver a la Tienda
          </Button>
        </Card>
      </Container>
    );
  }

  // Para ajustar el contador local si el stock global disminuye y queda menor que la cantidad seleccionada
  if (!producto.aPedido && cantidad > producto.stock && producto.stock > 0) {
    setCantidad(producto.stock);
  }

  const handleIncrementar = () => {
    if (producto.aPedido || cantidad < producto.stock) {
      setCantidad(prev => prev + 1);
    }
  };

  const handleDecrementar = () => {
    if (cantidad > 1) {
      setCantidad(prev => prev - 1);
    }
  };

  const handleAgregarAlCarrito = () => {
    if (!producto.aPedido && (cantidad <= 0 || cantidad > producto.stock)) return;

    // 1. Para actualizar el carrito sumando la cantidad elegida
    const existe = carrito.find((item) => item.id === producto.id);
    if (existe) {
      setCarrito(
        carrito.map((item) =>
          item.id === producto.id ? { ...item, count: item.count + cantidad } : item
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, count: cantidad }]);
    }

    // 2. Para descontar la cantidad exacta del stock global en la tienda
    if (!producto.aPedido) {
      setProductos(
        productos.map((item) =>
          item.id === producto.id ? { ...item, stock: item.stock - cantidad } : item
        )
      );
    }

    navigate('/tienda');
  };

  return (
    <Container className="py-5">
      <Button variant="outline-secondary" className="mb-4" onClick={() => navigate('/tienda')}>
        ← Volver a la Tienda
      </Button>

      <Card className="border-0 shadow-sm p-4">
        <Row className="align-items-center">
          <Col md={6}>
            <Image 
              src={producto.img} 
              alt={producto.name} 
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
            />
          </Col>
          <Col md={6}>
            {producto.aPedido && <span className="badge bg-warning text-dark mb-2">Elaboración Artesanal</span>}
            <h2 className="fw-bold mb-3">{producto.name}</h2>
            <p className="text-muted mb-4">{producto.desc}</p>
            
            <h3 className="text-success fw-bold mb-3">${producto.price.toLocaleString('es-CL')}</h3>

            {/* Muestra el stock real actualizándose de inmediato */}
            {!producto.aPedido && (
              <p className="text-muted fw-semibold">
                Stock disponible: <span className="text-dark">{producto.stock} u.</span>
              </p>
            )}

            {/* Control de cantidad y botón condicional */}
            {!producto.aPedido && producto.stock <= 0 ? (
              <Button variant="danger" disabled className="w-100 fw-bold py-2">
                Agotado
              </Button>
            ) : (
              <>
                {!producto.aPedido && (
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <span className="fw-semibold">Cantidad:</span>
                    <Button variant="outline-secondary" size="sm" onClick={handleDecrementar}>-</Button>
                    <span className="fw-bold fs-5 px-2">{cantidad}</span>
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      onClick={handleIncrementar}
                      disabled={cantidad >= producto.stock}
                    >+</Button>
                  </div>
                )}

                <Button 
                  variant="warning" 
                  className="w-100 fw-bold text-dark py-2" 
                  onClick={handleAgregarAlCarrito}
                >
                  🛒 Agregar al Carrito (${(producto.price * (producto.aPedido ? cantidad : cantidad)).toLocaleString('es-CL')})
                </Button>
              </>
            )}
          </Col>
        </Row>
      </Card>
    </Container>
  );
}