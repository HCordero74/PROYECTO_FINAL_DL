import { useContext, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import { LucyContext } from '../context/LucyContext';
import {
  extraerOpcionesTamano,
  formatearCLP,
  obtenerIndiceDefecto,
} from '../utils/tamanoPrecios';

export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { productos, agregarAlCarrito } = useContext(LucyContext);
  const [cantidad, setCantidad] = useState(1);
  const [indiceTamano, setIndiceTamano] = useState(0);

  const producto = productos.find((p) => String(p.id) === String(id));

  const esProductoAPedido = Boolean(
    producto?.aPedido ||
      producto?.categoria === 'tortas' ||
      (producto && Number(producto.stock) === 0 && producto.categoria !== 'cafe')
  );

  const opcionesTamano = useMemo(
    () => extraerOpcionesTamano(producto),
    [producto]
  );

  useEffect(() => {
    if (producto && opcionesTamano.length > 0) {
      setIndiceTamano(obtenerIndiceDefecto(opcionesTamano, producto.price));
    } else {
      setIndiceTamano(0);
    }
    setCantidad(1);
  }, [producto, opcionesTamano]);

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

  if (!esProductoAPedido && cantidad > producto.stock && producto.stock > 0) {
    setCantidad(producto.stock);
  }

  const tamanoSeleccionado =
    opcionesTamano.length > 0 ? opcionesTamano[indiceTamano] : null;

  const precioUnitario = tamanoSeleccionado
    ? Number(tamanoSeleccionado.precio)
    : Number(producto.price) || 0;

  const handleIncrementar = () => {
    if (esProductoAPedido || cantidad < producto.stock) {
      setCantidad((prev) => prev + 1);
    }
  };

  const handleDecrementar = () => {
    if (cantidad > 1) {
      setCantidad((prev) => prev - 1);
    }
  };

  const handleAgregarAlCarrito = () => {
    if (!esProductoAPedido && (cantidad <= 0 || cantidad > producto.stock)) return;

    agregarAlCarrito(
      { ...producto, aPedido: esProductoAPedido },
      {
        tamano: tamanoSeleccionado ? tamanoSeleccionado.etiqueta : null,
        price: precioUnitario,
        count: cantidad,
      }
    );

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
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </Col>
          <Col md={6}>
            {esProductoAPedido && (
              <span className="badge bg-warning text-dark mb-2">Elaboración Artesanal</span>
            )}
            <h2 className="fw-bold mb-3">{producto.name}</h2>
            <p className="text-muted mb-4">{producto.desc}</p>

            <h3 className="text-success fw-bold mb-3">{formatearCLP(precioUnitario)}</h3>

            {opcionesTamano.length > 0 && (
              <div className="mb-4">
                <label className="form-label fw-semibold d-block">
                  Selecciona el tamaño:
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {opcionesTamano.map((op, idx) => (
                    <Button
                      key={op.etiqueta}
                      type="button"
                      size="sm"
                      variant={idx === indiceTamano ? 'warning' : 'outline-secondary'}
                      className={idx === indiceTamano ? 'fw-bold text-dark' : ''}
                      onClick={() => setIndiceTamano(idx)}
                    >
                      {op.etiqueta} ({formatearCLP(op.precio)})
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {!esProductoAPedido && (
              <p className="text-muted fw-semibold">
                Stock disponible: <span className="text-dark">{producto.stock} u.</span>
              </p>
            )}

            {!esProductoAPedido && producto.stock <= 0 ? (
              <Button variant="danger" disabled className="w-100 fw-bold py-2">
                Agotado
              </Button>
            ) : (
              <>
                {!esProductoAPedido && (
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <span className="fw-semibold">Cantidad:</span>
                    <Button variant="outline-secondary" size="sm" onClick={handleDecrementar}>
                      -
                    </Button>
                    <span className="fw-bold fs-5 px-2">{cantidad}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handleIncrementar}
                      disabled={cantidad >= producto.stock}
                    >
                      +
                    </Button>
                  </div>
                )}

                <Button
                  variant="warning"
                  className="w-100 fw-bold text-dark py-2"
                  onClick={handleAgregarAlCarrito}
                >
                  🛒 Agregar al Carrito ({formatearCLP(precioUnitario * cantidad)})
                </Button>
              </>
            )}
          </Col>
        </Row>
      </Card>
    </Container>
  );
}