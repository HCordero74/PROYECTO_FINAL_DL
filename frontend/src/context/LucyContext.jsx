import { createContext, useState } from 'react';
import panCompletoImg from '../assets/pan_completo.jpg';

export const LucyContext = createContext();

export const LucyProvider = ({ children }) => {
  const [productos, setProductos] = useState([
    {
      id: '1',
      name: 'Kuchen de Manzana Artesanal',
      categoria: 'pasteleria', // Familia Pastelería / Dulces
      price: 8500,
      stock: 8,
      aPedido: false,
      desc: 'Tradicional receta sureña con masa crujiente, manzanas frescas de la zona y cobertura de migas.',
      img: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: '2',
      name: 'Pan Amasado Tradicional (Pack x 6)',
      categoria: 'pan', // Familia Pan
      price: 2500,
      stock: 25,
      aPedido: false,
      desc: 'Recién horneados, calientes, con la textura perfecta y mantecosos.',
      img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: '3',
      name: 'Cupcakes Artesanales (Pack x 4)',
      categoria: 'pasteleria', // Familia Pastelería / Dulces
      price: 4500,
      stock: 12,
      aPedido: false,
      desc: 'Esponjosos cupcakes de diferentes sabores, con crema de chantilly.',
      img: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: '4',
      name: 'Torta de Hojarasca Manjar Lúcuma',
      categoria: 'tortas', // Familia Tortas
      price: 18900,
      stock: null,
      aPedido: true,
      desc: 'Finísimas capas de hojarascas artesanales rellenas con manjar blanco y suave crema de lúcuma.',
      img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: '5',
      name: 'Pan de Completo Artesanal (Pack x 6)', 
      categoria: 'pan', // Familia Pan
      price: 2200,
      stock: 20,
      aPedido: false,
      desc: 'Tradicional pan de completo fresco y esponjoso, ideal para preparar en casa.', // 👈 Nueva descripción
      img: panCompletoImg
    },
    {
      id: '6',
      name: 'Café Espresso de Grano',
      categoria: 'cafe', // Familia Café
      price: 2200,
      stock: 50,
      aPedido: false,
      desc: 'Café 100% Arábica recién molido, de cuerpo intenso y crema persistente.',
      img: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=600&auto=format&fit=crop'
    }
  ]);

  const [carrito, setCarrito] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [user, setUser] = useState(null);

  const agregarAlCarrito = (producto) => {
    const prodRef = productos.find((p) => p.id === producto.id);
    if (!producto.aPedido && (!prodRef || prodRef.stock <= 0)) return;

    const existe = carrito.find((item) => item.id === producto.id);
    if (existe) {
      setCarrito(
        carrito.map((item) =>
          item.id === producto.id ? { ...item, count: item.count + 1 } : item
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, count: 1 }]);
    }

    if (!producto.aPedido) {
      setProductos(
        productos.map((item) =>
          item.id === producto.id ? { ...item, stock: item.stock - 1 } : item
        )
      );
    }
  };

  const incrementarCount = (id) => {
    const prodRef = productos.find((p) => p.id === id);
    if (prodRef && !prodRef.aPedido && prodRef.stock <= 0) return;

    setCarrito(
      carrito.map((item) =>
        item.id === id ? { ...item, count: item.count + 1 } : item
      )
    );

    if (prodRef && !prodRef.aPedido) {
      setProductos(
        productos.map((item) =>
          item.id === id ? { ...item, stock: item.stock - 1 } : item
        )
      );
    }
  };

  const decrementarCount = (id) => {
    const itemCarrito = carrito.find((item) => item.id === id);
    if (!itemCarrito) return;

    setCarrito(
      carrito
        .map((item) => (item.id === id ? { ...item, count: item.count - 1 } : item))
        .filter((item) => item.count > 0)
    );

    const prodRef = productos.find((p) => p.id === id);
    if (prodRef && !prodRef.aPedido) {
      setProductos(
        productos.map((item) =>
          item.id === id ? { ...item, stock: item.stock + 1 } : item
        )
      );
    }
  };

  const eliminarDelCarrito = (id) => {
    const itemCarrito = carrito.find((item) => item.id === id);
    if (itemCarrito && !itemCarrito.aPedido) {
      setProductos(
        productos.map((item) =>
          item.id === id ? { ...item, stock: item.stock + itemCarrito.count } : item
        )
      );
    }
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  const vaciarCarrito = () => {
    carrito.forEach((item) => {
      if (!item.aPedido) {
        setProductos((prevProds) =>
          prevProds.map((p) =>
            p.id === item.id ? { ...p, stock: p.stock + item.count } : p
          )
        );
      }
    });
    setCarrito([]);
  };

  const toggleFavorito = (producto) => {
    const existe = favoritos.some((fav) => fav.id === producto.id);
    if (existe) {
      setFavoritos(favoritos.filter((fav) => fav.id !== producto.id));
    } else {
      setFavoritos([...favoritos, producto]);
    }
  };

  return (
    <LucyContext.Provider
      value={{
        productos,
        setProductos,
        carrito,
        setCarrito,
        favoritos,
        toggleFavorito,
        user,
        setUser,
        agregarAlCarrito,
        incrementarCount,
        decrementarCount,
        eliminarDelCarrito,
        vaciarCarrito,
      }}
    >
      {children}
    </LucyContext.Provider>
  );
};