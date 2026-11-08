import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LucyProvider } from './context/LucyContext';
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
              <Route path="*" element={<Home />} />
              <Route path="/crear-producto" element={<CrearPublicacion />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </LucyProvider>
  );
}

export default App;