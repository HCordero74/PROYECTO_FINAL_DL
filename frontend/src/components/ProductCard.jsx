import { Card, Button, Badge } from 'react-bootstrap';
import { useContext } from 'react';
import { LucyContext } from '../context/LucyContext';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ producto }) {
  const { agregarAlCarrito, favoritos, toggleFavorito } = useContext(LucyContext);
  const navigate = useNavigate();

  const esFavorito = favoritos.some((fav) => fav.id === producto.id);
  const sinStock = !producto.aPedido && producto.stock <= 0;

  return (
    <Card className="h-100 shadow-sm border-0 position-relative">
      <Button
        variant="light"
        size="sm"
        className="position-absolute top-0 end-0 m-2 rounded-circle shadow-sm"
        onClick={() => toggleFavorito(producto)}
      >
        {esFavorito ? '❤️' : '🤍'}
      </Button>

      <Card.Img
        variant="top"
        src={producto.img}
        alt={producto.name}
        style={{ height: '180px', objectFit: 'cover' }}
      />

      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold fs-6" style={{ color: '#3E2723' }}>
          {producto.name}
        </Card.Title>
        
        <Card.Text className="text-muted small flex-grow-1">
          {producto.desc}
        </Card.Text>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="fw-bold text-success fs-5">
            ${producto.price.toLocaleString('es-CL')}
          </span>

          {producto.aPedido ? (
            <Badge bg="warning" className="text-dark fw-bold px-2 py-1">
              📋 A Pedido
            </Badge>
          ) : sinStock ? (
            <Badge bg="danger" className="px-2 py-1">
              Agotado
            </Badge>
          ) : (
            <Badge bg="secondary" className="px-2 py-1">
              Stock: {producto.stock} u.
            </Badge>
          )}
        </div>

        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            className="w-50"
            onClick={() => navigate(`/producto/${producto.id}`)}
          >
            Ver más
          </Button>

          <Button
            variant="warning"
            size="sm"
            className="w-50 fw-bold text-dark"
            disabled={sinStock}
            onClick={() => agregarAlCarrito(producto)}
          >
            {sinStock ? 'Agotado' : '🛒 Añadir'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}