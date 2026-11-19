import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LucyProvider, LucyContext } from './context/LucyContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Importación de Vistas
import Home from './views/Home';
import Tienda from './views/Tienda';
import DetalleProducto from './views/DetalleProducto';
import Login from './views/Login';
import Register from './views/Register';
import Perfil from './views/Perfil';
import Carrito from './views/Carrito';
import CrearPublicacion from './views/CrearPublicacion';

// Guardián de ruta para administradores
const RutaAdmin = ({ children }) => {
  const { user } = useContext(LucyContext);

  if (!user || user.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <LucyProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tienda" element={<Tienda />} />
              <Route path="/producto/:id" element={<DetalleProducto />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/perfil" element={<Perfil />} />
              
              {/* Ruta blindada: solo accesible si user.rol === 'admin' */}
              <Route 
                path="/crear-producto" 
                element={
                  <RutaAdmin>
                    <CrearPublicacion />
                  </RutaAdmin>
                } 
              />

              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </LucyProvider>
  );
}

export default App;