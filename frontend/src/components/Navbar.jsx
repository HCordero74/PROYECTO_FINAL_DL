import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { LucyContext } from '../context/LucyContext';
import logoLucy from '../assets/logo.jpg';

export default function NavbarLucy() {
  const { carrito, user, setUser } = useContext(LucyContext);
  const navigate = useNavigate();

  const totalCarrito = carrito.reduce((acc, item) => acc + item.price * item.count, 0);

  // Se Define la función handleLogout para limpiar el usuario y redirigir
  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <Navbar style={{ backgroundColor: '#3E2723' }} variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-warning d-flex align-items-center gap-2">
          <img
            src={logoLucy}
            alt="Panadería y Pastelería Lucy"
            className="rounded-circle border border-warning"
            style={{ width: '45px', height: '45px', objectFit: 'cover' }}
          />
          Panadería Lucy
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/tienda">Tienda / Catálogo</Nav.Link>
          </Nav>
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <Button variant="outline-warning" size="sm" onClick={() => navigate('/perfil')}>
                  👤 Mi Perfil
                </Button>
                {/* 👇 Aquí invocamos la función handleLogout */}
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="warning" 
                  size="sm" 
                  className="fw-bold text-dark" 
                  onClick={() => navigate('/login')}
                >
                  Iniciar Sesión
                </Button>
                <Button 
                  variant="outline-warning" 
                  size="sm" 
                  onClick={() => navigate('/register')}
                >
                  Registrarse
                </Button>
              </>
            )}
            <Button variant="warning" size="sm" className="fw-bold text-dark" onClick={() => navigate('/carrito')}>
              🛒 Total: ${totalCarrito.toLocaleString('es-CL')}
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}