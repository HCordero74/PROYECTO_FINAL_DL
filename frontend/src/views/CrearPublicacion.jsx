import { useState, useContext } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { LucyContext } from '../context/LucyContext';

export default function CrearPublicacion() {
  const { productos, setProductos } = useContext(LucyContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Panadería');
  const [img, setImg] = useState('');
  const [exito, setExito] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !desc.trim() || !price || !img.trim()) {
      setError('Por favor, completa todos los campos requeridos.');
      return;
    }

    setError('');
    
    // Crear el nuevo producto simulado
    const nuevoProducto = {
      id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1,
      name,
      desc,
      price: Number(price),
      category,
      img
    };

    setProductos([...productos, nuevoProducto]);
    setExito(true);

    setTimeout(() => {
      navigate('/tienda');
    }, 2000);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Card style={{ maxWidth: '600px', width: '100%' }} className="shadow-sm border-0 p-4">
        <Card.Body>
          <h2 className="text-center fw-bold mb-4 text-dark">📝 Crear Nueva Publicación / Producto</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          {exito && <Alert variant="success">¡Producto publicado con éxito! Redirigiendo a la tienda...</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Título del Producto:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej. Torta de Mil Hojas"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Descripción:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Detalle de los ingredientes o preparación..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Precio ($):</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ej. 12900"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Categoría:</Form.Label>
              <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Panadería">Panadería</option>
                <option value="Pastelería">Pastelería</option>
                <option value="Tortas">Tortas</option>
                <option value="Café">Café</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">URL de la imagen:</Form.Label>
              <Form.Control
                type="text"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={img}
                onChange={(e) => setImg(e.target.value)}
              />
            </Form.Group>

            <Button variant="warning" type="submit" className="w-100 fw-bold text-dark shadow-sm">
              PUBLICAR PRODUCTO
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}