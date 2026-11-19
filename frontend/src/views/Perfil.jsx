import { useContext } from 'react';
import { Container, Card, Button, Badge, Row, Col, Tab, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { LucyContext } from '../context/LucyContext';

export default function Perfil() {
  const { user, logout, productos, setProductos, favoritos, toggleFavorito, agregarAlCarrito } = useContext(LucyContext);
  const navigate = useNavigate();

  // Validación booleana para determinar si el usuario tiene privilegios de administrador
  const esAdmin = user?.rol === 'admin';

  const handleLogout = () => {
    logout(); // Limpia estado global y elimina token/user de localStorage
    navigate('/');
  };

  // Función para eliminar un producto publicado (solo accesible para admin)
  const eliminarProducto = (id) => {
    const nuevosProductos = productos.filter((p) => p.id !== id);
    setProductos(nuevosProductos);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <Card className="shadow-sm border-0 p-4 text-center">
            <div className="mb-3">
              <span style={{ fontSize: '4rem' }}>👤</span>
            </div>
            <h2 className="fw-bold text-dark">
              {user?.nombre || (esAdmin ? 'Administrador Panadería' : 'Cliente Frecuente')}
            </h2>
            <p className="text-muted mb-2">{user?.email || 'cliente@panaderialucy.cl'}</p>
            
            <div className="d-flex justify-content-center gap-2 mb-3">
              {esAdmin ? (
                <Badge bg="dark" text="warning" className="px-3 py-2">
                  Administrador
                </Badge>
              ) : (
                <Badge bg="warning" text="dark" className="px-3 py-2">
                  Cliente Registrado
                </Badge>
              )}

              {/* Solo se renderiza si el usuario es administrador */}
              {esAdmin && (
                <Button variant="outline-success" size="sm" onClick={() => navigate('/crear-producto')}>
                  ➕ Crear Nueva Publicación
                </Button>
              )}
            </div>

            <Button variant="outline-danger" size="sm" className="w-25 mx-auto" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Si es admin inicia en 'publicaciones'; si es cliente inicia directo en 'favoritos' */}
      <Tab.Container defaultActiveKey={esAdmin ? 'publicaciones' : 'favoritos'}>
        <Row className="justify-content-center">
          <Col md={10}>
            <Nav variant="tabs" className="justify-content-center mb-4">
              {esAdmin && (
                <Nav.Item>
                  <Nav.Link eventKey="publicaciones" className="fw-bold text-dark">
                    Gestión de Publicaciones
                  </Nav.Link>
                </Nav.Item>
              )}
              <Nav.Item>
                <Nav.Link eventKey="favoritos" className="fw-bold text-dark">
                  Mis Favoritos ({favoritos.length})
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              {esAdmin && (
                <Tab.Pane eventKey="publicaciones">
                  <h4 className="fw-bold mb-3">Productos Publicados</h4>
                  {productos.length > 0 ? (
                    <Row className="g-3">
                      {productos.map((prod) => (
                        <Col md={6} key={prod.id}>
                          <Card className="p-3 shadow-sm border-0 d-flex flex-row align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-3">
                              <img src={prod.img} alt={prod.name} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px' }} />
                              <div>
                                <h6 className="fw-bold mb-1">{prod.name}</h6>
                                <p className="text-success mb-1 fw-bold">${prod.price?.toLocaleString('es-CL')}</p>
                              </div>
                            </div>
                            <div className="d-flex flex-column gap-1">
                              <Button variant="outline-danger" size="sm" onClick={() => eliminarProducto(prod.id)}>
                                🗑️ Eliminar
                              </Button>
                            </div>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Card className="p-4 text-center border-0 shadow-sm text-muted">
                      No tienes productos publicados actualmente.
                    </Card>
                  )}
                </Tab.Pane>
              )}

              <Tab.Pane eventKey="favoritos">
                <h4 className="fw-bold mb-3">Productos Favoritos</h4>
                {favoritos.length > 0 ? (
                  <Row className="g-3">
                    {favoritos.map((prod) => {
                      const productoActual = productos.find((p) => String(p.id) === String(prod.id));
                      const productoMostrado = productoActual || prod;
                      const noDisponible =
                        !productoActual || (!productoActual.aPedido && (productoActual.stock ?? 0) <= 0);

                      return (
                        <Col md={6} key={prod.id}>
                          <Card className="p-3 shadow-sm border-0 d-flex flex-row align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={productoMostrado.img}
                                alt={productoMostrado.name}
                                style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px' }}
                              />
                              <div>
                                <h6 className="fw-bold mb-1">{productoMostrado.name}</h6>
                                <p className="text-success mb-1 fw-bold">
                                  ${productoMostrado.price?.toLocaleString('es-CL')}
                                </p>
                                {productoActual && !productoActual.aPedido && (
                                  <small className="text-muted">
                                    Stock disponible: {productoActual.stock ?? 0}
                                  </small>
                                )}
                                {!productoActual && (
                                  <small className="text-danger">Producto ya no disponible en catálogo</small>
                                )}
                              </div>
                            </div>

                            <div className="d-flex flex-column gap-2">
                              <Button
                                variant="warning"
                                size="sm"
                                className="fw-bold text-dark"
                                disabled={noDisponible}
                                onClick={() => productoActual && agregarAlCarrito(productoActual)}
                              >
                                {!productoActual
                                  ? 'No disponible'
                                  : noDisponible
                                    ? 'Sin stock'
                                    : '🛒 Agregar'}
                              </Button>

                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => toggleFavorito(prod)}
                              >
                                🗑️ Quitar
                              </Button>
                            </div>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                ) : (
                  <Card className="p-4 text-center border-0 shadow-sm text-muted">
                    Aún no has agregado productos a tu lista de favoritos. ¡Explora la tienda y marca tus preferidos con el corazón ❤️!
                  </Card>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}