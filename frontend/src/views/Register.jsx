import { useState, useContext } from 'react'; // 👈 1. Importa useContext
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { LucyContext } from '../context/LucyContext'; // 👈 2. Importa el contexto

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const { setUser } = useContext(LucyContext); // 👈 3. Extrae setUser del contexto
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe contener al menos 6 caracteres.');
      return;
    }

    setError('');
    
    // Se Guarda el usuario registrado con su contraseña en el contexto global
    setUser({
      nombre,
      email,
      password
    });

    setExito(true);

    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    // ... el return se mantiene exactamente igual ...
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Card style={{ maxWidth: '480px', width: '100%' }} className="shadow-sm border-0 p-4">
        <Card.Body>
          <h2 className="text-center fw-bold mb-4 text-dark">📝 Crear Cuenta</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          {exito && <Alert variant="success">¡Cuenta creada con éxito! Redirigiendo al login...</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="registerNombre">
              <Form.Label className="fw-semibold">Nombre Completo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Juan Pérez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="registerEmail">
              <Form.Label className="fw-semibold">Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="ejemplo@correo.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="registerPassword">
              <Form.Label className="fw-semibold">Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="registerConfirmPassword">
              <Form.Label className="fw-semibold">Confirmar Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100 fw-bold">
              Registrarse
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}