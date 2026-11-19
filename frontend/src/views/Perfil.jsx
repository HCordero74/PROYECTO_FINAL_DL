import { useContext, useState } from 'react';
import { Container, Card, Button, Badge, Row, Col, Tab, Nav, Modal, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { LucyContext } from '../context/LucyContext';

export default function Perfil() {
  const {
    user,
    logout,
    productos,
    editarProductoAPI,
    eliminarProductoAPI,
    favoritos,
    toggleFavorito,
    agregarAlCarrito,
  } = useContext(LucyContext);
  const navigate = useNavigate();

  // Validación booleana para determinar si el usuario tiene privilegios de administrador
  const esAdmin = user?.rol === 'admin';

  // Estados para editar un producto
  const [showEditModal, setShowEditModal] = useState(false);
  const [editError, setEditError] = useState('');
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [formEdit, setFormEdit] = useState({
    name: '',
    desc: '',
    price: '',
    stock: '',
    category: 'Panadería',
    img: '',
  });

  const handleLogout = () => {
    logout(); // Limpia estado global y elimina token/user de localStorage
    navigate('/');
  };

  // Función para eliminar un producto publicado en PostgreSQL (solo accesible para admin)
  const eliminarProducto = async (id) => {
    try {
      await eliminarProductoAPI(id);
    } catch (err) {
      alert(err.message || 'No se pudo eliminar el producto en el servidor.');
    }
  };

  // Abre el modal cargando los datos actuales del producto seleccionado
  const abrirEdicion = (prod) => {
    setProductoEditando(prod);
    setEditError('');
    setFormEdit({
      name: prod.name || '',
      desc: prod.desc || '',
      price: prod.price ?? '',
      stock: prod.stock ?? 0,
      category: prod.category || prod.categoria || 'Panadería',
      img: prod.img || '',
    });
    setShowEditModal(true);
  };

  const cerrarEdicion = () => {
    setShowEditModal(false);
    setProductoEditando(null);
    setEditError('');
    setGuardandoEdicion(false);
  };

  // Guarda los cambios del producto editado en PostgreSQL y actualiza el estado global
  const guardarEdicion = async (e) => {
    e.preventDefault();

    if (
      !formEdit.name.trim() ||
      !formEdit.desc.trim() ||
      formEdit.price === '' ||
      formEdit.stock === '' ||
      !formEdit.img.trim()
    ) {
      setEditError('Por favor, completa todos los campos del producto.');
      return;
    }

    const precioNum = Number(formEdit.price);
    const stockNum = Number(formEdit.stock);

    if (Number.isNaN(precioNum) || precioNum <= 0) {
      setEditError('Ingresa un precio válido mayor a 0.');
      return;
    }

    if (Number.isNaN(stockNum) || stockNum < 0) {
      setEditError('Ingresa un stock válido (0 o mayor).');
      return;
    }

    setEditError('');
    setGuardandoEdicion(true);

    try {
      await editarProductoAPI(productoEditando.id, {
        name: formEdit.name.trim(),
        desc: formEdit.desc.trim(),
        price: precioNum,
        stock: stockNum,
        category: formEdit.category,
        categoria: formEdit.category.toLowerCase(),
        img: formEdit.img.trim(),
      });

      cerrarEdicion();
    } catch (err) {
      setEditError(err.message || 'No se pudieron guardar los cambios en el servidor.');
      setGuardandoEdicion(false);
    }
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
                              <img
                                src={prod.img}
                                alt={prod.name}
                                style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px' }}
                              />
                              <div>
                                <h6 className="fw-bold mb-1">{prod.name}</h6>
                                <p className="text-success mb-1 fw-bold">${prod.price?.toLocaleString('es-CL')}</p>
                                <small className="text-muted">Stock: {prod.stock ?? 0} u.</small>
                              </div>
                            </div>
                            <div className="d-flex flex-column gap-1">
                              <Button variant="outline-primary" size="sm" onClick={() => abrirEdicion(prod)}>
                                ✏️ Editar
                              </Button>
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

      {/* Modal para editar producto */}
      <Modal show={showEditModal} onHide={cerrarEdicion} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">✏️ Editar Producto</Modal.Title>
        </Modal.Header>
        <Form onSubmit={guardarEdicion}>
          <Modal.Body>
            {editError && <Alert variant="danger">{editError}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Título del Producto:</Form.Label>
              <Form.Control
                type="text"
                value={formEdit.name}
                onChange={(e) => setFormEdit({ ...formEdit, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Descripción:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formEdit.desc}
                onChange={(e) => setFormEdit({ ...formEdit, desc: e.target.value })}
              />
            </Form.Group>

            <Row>
              <Col sm={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Precio ($):</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={formEdit.price}
                    onChange={(e) => setFormEdit({ ...formEdit, price: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Stock (unidades):</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={formEdit.stock}
                    onChange={(e) => setFormEdit({ ...formEdit, stock: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Categoría:</Form.Label>
              <Form.Select
                value={formEdit.category}
                onChange={(e) => setFormEdit({ ...formEdit, category: e.target.value })}
              >
                <option value="Panadería">Panadería</option>
                <option value="Pastelería">Pastelería</option>
                <option value="Tortas">Tortas</option>
                <option value="Café">Café</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="fw-semibold">URL de la imagen:</Form.Label>
              <Form.Control
                type="text"
                value={formEdit.img}
                onChange={(e) => setFormEdit({ ...formEdit, img: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cerrarEdicion} disabled={guardandoEdicion}>
              Cancelar
            </Button>
            <Button variant="warning" type="submit" className="fw-bold text-dark" disabled={guardandoEdicion}>
              {guardandoEdicion ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}