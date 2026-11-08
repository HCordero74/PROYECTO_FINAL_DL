import { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Badge } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { LucyContext } from '../context/LucyContext';
import ProductCard from '../components/ProductCard';

export default function Tienda() {
  const { productos } = useContext(LucyContext);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoriaURL = searchParams.get('categoria') || 'todas';
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categoriaURL);
  const [busqueda, setBusqueda] = useState('');

  // Para sincrocizar cuando cambie la URL
  useEffect(() => {
    setCategoriaSeleccionada(searchParams.get('categoria') || 'todas');
  }, [searchParams]);

  // Para manejar el cambio de categoría
  const handleCategoriaChange = (cat) => {
    setCategoriaSeleccionada(cat);
    if (cat === 'todas') {
      setSearchParams({});
    } else {
      setSearchParams({ categoria: cat });
    }
  };

  // Filtrado de subproductos según categoría y búsqueda
  const productosFiltrados = productos.filter((p) => {
    const coincideCategoria = 
      categoriaSeleccionada === 'todas' || p.categoria === categoriaSeleccionada;
    const coincideBusqueda = 
      p.name.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.desc.toLowerCase().includes(busqueda.toLowerCase());
    
    return coincideCategoria && coincideBusqueda;
  });

  const familiasBtns = [
    { id: 'todas', nombre: 'Todas las Familias' },
    { id: 'pan', nombre: 'Pan' },
    { id: 'pasteleria', nombre: 'Pastelería' },
    { id: 'tortas', nombre: 'Tortas' },
    { id: 'cafe', nombre: 'Café' }
  ];

  return (
    <Container className="py-4">
      {/* Selector de Categorías (Familias) */}
      <div className="d-flex flex-wrap gap-2 mb-3 justify-content-center">
        {familiasBtns.map((fam) => (
          <Button
            key={fam.id}
            variant={categoriaSeleccionada === fam.id ? 'warning' : 'outline-dark'}
            className="fw-bold px-3 py-2"
            onClick={() => handleCategoriaChange(fam.id)}
          >
            {fam.nombre}
          </Button>
        ))}
      </div>

      {/* Barra de Búsqueda */}
      <Form.Control
        type="text"
        placeholder="🔍 Buscar por nombre de producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="mb-4 shadow-sm py-2 px-3 fs-6"
      />

      {/* Título de la Familia activa */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h3 className="fw-bold text-dark text-capitalize m-0">
          {categoriaSeleccionada === 'todas' 
            ? 'Catálogo Completo' 
            : `Familia: ${categoriaSeleccionada}`}
        </h3>
        <Badge bg="secondary" className="fs-6">
          {productosFiltrados.length} subproductos encontrados
        </Badge>
      </div>

      {/* Grid de Subproductos */}
      {productosFiltrados.length > 0 ? (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {productosFiltrados.map((producto) => (
            <Col key={producto.id}>
              <ProductCard producto={producto} />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-5">
          <h4 className="text-muted">No se encontraron subproductos en esta familia.</h4>
          <Button 
            variant="warning" 
            className="mt-3 fw-bold"
            onClick={() => handleCategoriaChange('todas')}
          >
            Ver catálogo completo
          </Button>
        </div>
      )}
    </Container>
  );
}