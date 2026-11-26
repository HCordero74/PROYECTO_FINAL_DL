import { createContext, useState, useEffect, useCallback } from 'react';
import panCompletoImg from '../assets/pan_completo.jpg';

export const LucyContext = createContext();

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

const PRODUCTOS_INICIALES = [
  {
    id: '1',
    name: 'Kuchen de Manzana Artesanal',
    categoria: 'pasteleria',
    category: 'Pastelería',
    price: 8500,
    stock: 8,
    aPedido: false,
    desc: 'Tradicional receta sureña con masa crujiente, manzanas frescas de la zona y cobertura de migas.',
    img: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Pan Amasado Tradicional (Pack x 6)',
    categoria: 'pan',
    category: 'Panadería',
    price: 2500,
    stock: 25,
    aPedido: false,
    desc: 'Recién horneados, calientes, con la textura perfecta y mantecosos.',
    img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Cupcakes Artesanales (Pack x 4)',
    categoria: 'pasteleria',
    category: 'Pastelería',
    price: 4500,
    stock: 12,
    aPedido: false,
    desc: 'Esponjosos cupcakes de diferentes sabores, con crema de chantilly.',
    img: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Torta de Hojarasca Manjar Lúcuma',
    categoria: 'tortas',
    category: 'Tortas',
    price: 18900,
    stock: null,
    aPedido: true,
    desc: 'Finísimas capas de hojarascas artesanales rellenas con manjar blanco y suave crema de lúcuma.',
    img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '5',
    name: 'Pan de Completo Artesanal (Pack x 6)',
    categoria: 'pan',
    category: 'Panadería',
    price: 2200,
    stock: 20,
    aPedido: false,
    desc: 'Tradicional pan de completo fresco y esponjoso, ideal para preparar en casa.',
    img: panCompletoImg
  },
  {
    id: '6',
    name: 'Café Espresso de Grano',
    categoria: 'cafe',
    category: 'Café',
    price: 2200,
    stock: 50,
    aPedido: false,
    desc: 'Café 100% Arábica recién molido, de cuerpo intenso y crema persistente.',
    img: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=600&auto=format&fit=crop'
  }
];

const calcularEsAPedido = (categoriaNormalizada, stockNum, aPedidoFlag) => {
  return Boolean(
    aPedidoFlag ||
      categoriaNormalizada === 'tortas' ||
      (stockNum === 0 && categoriaNormalizada !== 'cafe')
  );
};

const adaptarProducto = (prod = {}) => {
  const catRaw = prod.categoria ?? prod.category ?? 'pan';
  const catLower = String(catRaw).toLowerCase().trim();
  let categoriaNormalizada = catLower;

  if (catLower.startsWith('pan')) categoriaNormalizada = 'pan';
  else if (catLower.includes('pastel')) categoriaNormalizada = 'pasteleria';
  else if (catLower.includes('torta')) categoriaNormalizada = 'tortas';
  else if (catLower.includes('café') || catLower.includes('cafe')) categoriaNormalizada = 'cafe';

  const stockNum =
    prod.stock === null || prod.stock === undefined ? null : Number(prod.stock);

  const esAPedido = calcularEsAPedido(categoriaNormalizada, stockNum, prod.aPedido);

  return {
    ...prod,
    id: String(prod.id),
    name: prod.name ?? prod.nombre ?? '',
    desc: prod.desc ?? prod.descripcion ?? '',
    price: Number(prod.price ?? prod.precio ?? 0),
    stock: stockNum,
    categoria: categoriaNormalizada,
    category: prod.category ?? prod.categoria ?? 'Panadería',
    img: prod.img ?? prod.imagen ?? '',
    aPedido: esAPedido
  };
};

const esItemAPedido = (item, prodRef) => {
  const cat = String(item?.categoria ?? prodRef?.categoria ?? '').toLowerCase().trim();
  const stockVal = prodRef?.stock ?? item?.stock;
  const stockNum =
    stockVal === null || stockVal === undefined ? null : Number(stockVal);

  return calcularEsAPedido(
    cat,
    stockNum,
    item?.aPedido || prodRef?.aPedido
  );
};

const obtenerClaveItem = (item) =>
  item.cartItemId || (item.tamano ? `${item.id}__${item.tamano}` : `${item.id}`);

export const LucyProvider = ({ children }) => {
  const [productos, setProductos] = useState(PRODUCTOS_INICIALES);
  const [carrito, setCarrito] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const obtenerProductosAPI = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/productos`);
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setProductos(data.map(adaptarProducto));
      }
    } catch (error) {
      console.error('Error al cargar productos desde la API:', error);
    }
  }, []);

  useEffect(() => {
    obtenerProductosAPI();
  }, [obtenerProductosAPI]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  };

  const crearProductoAPI = async (nuevoProd) => {
    const payload = {
      nombre: nuevoProd.name,
      descripcion: nuevoProd.desc,
      precio: Number(nuevoProd.price),
      stock: Number(nuevoProd.stock),
      categoria: nuevoProd.category || nuevoProd.categoria || 'Panadería',
      imagen: nuevoProd.img
    };

    const res = await fetch(`${API_URL}/productos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || 'No se pudo crear el producto.');
    }

    const creado = adaptarProducto(data.producto || data);
    setProductos((prev) => [...prev, creado]);
    return creado;
  };

  const editarProductoAPI = async (id, datosActualizados) => {
    const payload = {
      nombre: datosActualizados.name,
      descripcion: datosActualizados.desc,
      precio: Number(datosActualizados.price),
      stock: Number(datosActualizados.stock),
      categoria: datosActualizados.category || datosActualizados.categoria || 'Panadería',
      imagen: datosActualizados.img
    };

    const res = await fetch(`${API_URL}/productos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || 'No se pudo actualizar el producto.');
    }

    const actualizado = adaptarProducto(data.producto || data);
    setProductos((prev) => prev.map((p) => (String(p.id) === String(id) ? actualizado : p)));
    return actualizado;
  };

  const eliminarProductoAPI = async (id) => {
    const res = await fetch(`${API_URL}/productos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || 'No se pudo eliminar el producto.');
    }

    setProductos((prev) => prev.filter((p) => String(p.id) !== String(id)));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const agregarAlCarrito = (producto, seleccion = {}) => {
    const cantidadSumar = Number(seleccion.count ?? seleccion.cantidad ?? 1);
    if (cantidadSumar <= 0) return;

    const prodRef = productos.find((p) => String(p.id) === String(producto.id));
    const aPedidoFinal = esItemAPedido(producto, prodRef);

    if (!aPedidoFinal && (!prodRef || prodRef.stock < cantidadSumar)) return;

    const tamanoElegido = seleccion.tamano || producto.tamano || null;
    const precioElegido = Number(seleccion.price ?? seleccion.precio ?? producto.price ?? 0);
    const cartItemId = tamanoElegido
      ? `${producto.id}__${tamanoElegido}`
      : `${producto.id}`;

    setCarrito((prev) => {
      const idx = prev.findIndex((item) => obtenerClaveItem(item) === cartItemId);
      if (idx !== -1) {
        const copia = [...prev];
        copia[idx] = {
          ...copia[idx],
          aPedido: aPedidoFinal,
          count: copia[idx].count + cantidadSumar,
        };
        return copia;
      }

      return [
        ...prev,
        {
          ...producto,
          aPedido: aPedidoFinal,
          cartItemId,
          tamano: tamanoElegido,
          price: precioElegido,
          count: cantidadSumar,
        },
      ];
    });

    if (!aPedidoFinal) {
      setProductos((prev) =>
        prev.map((item) =>
          String(item.id) === String(producto.id)
            ? { ...item, stock: item.stock - cantidadSumar }
            : item
        )
      );
    }
  };

  const incrementarCount = (itemId) => {
    const itemCarrito = carrito.find((item) => obtenerClaveItem(item) === String(itemId));
    if (!itemCarrito) return;

    const prodRef = productos.find((p) => String(p.id) === String(itemCarrito.id));
    const aPedidoFinal = esItemAPedido(itemCarrito, prodRef);

    if (!aPedidoFinal && (!prodRef || prodRef.stock <= 0)) return;

    setCarrito((prev) =>
      prev.map((item) =>
        obtenerClaveItem(item) === String(itemId)
          ? { ...item, count: item.count + 1 }
          : item
      )
    );

    if (!aPedidoFinal) {
      setProductos((prev) =>
        prev.map((item) =>
          String(item.id) === String(itemCarrito.id)
            ? { ...item, stock: item.stock - 1 }
            : item
        )
      );
    }
  };

  const decrementarCount = (itemId) => {
    const itemCarrito = carrito.find((item) => obtenerClaveItem(item) === String(itemId));
    if (!itemCarrito) return;

    const prodRef = productos.find((p) => String(p.id) === String(itemCarrito.id));
    const aPedidoFinal = esItemAPedido(itemCarrito, prodRef);

    setCarrito((prev) =>
      prev
        .map((item) =>
          obtenerClaveItem(item) === String(itemId)
            ? { ...item, count: item.count - 1 }
            : item
        )
        .filter((item) => item.count > 0)
    );

    if (!aPedidoFinal) {
      setProductos((prev) =>
        prev.map((item) =>
          String(item.id) === String(itemCarrito.id)
            ? { ...item, stock: item.stock + 1 }
            : item
        )
      );
    }
  };

  const eliminarDelCarrito = (itemId) => {
    const itemCarrito = carrito.find((item) => obtenerClaveItem(item) === String(itemId));
    if (!itemCarrito) return;

    const prodRef = productos.find((p) => String(p.id) === String(itemCarrito.id));
    const aPedidoFinal = esItemAPedido(itemCarrito, prodRef);

    if (!aPedidoFinal) {
      setProductos((prev) =>
        prev.map((item) =>
          String(item.id) === String(itemCarrito.id)
            ? { ...item, stock: item.stock + itemCarrito.count }
            : item
        )
      );
    }

    setCarrito((prev) => prev.filter((item) => obtenerClaveItem(item) !== String(itemId)));
  };

  const vaciarCarrito = () => {
    carrito.forEach((item) => {
      const prodRef = productos.find((p) => String(p.id) === String(item.id));
      const aPedidoFinal = esItemAPedido(item, prodRef);

      if (!aPedidoFinal) {
        setProductos((prevProds) =>
          prevProds.map((p) =>
            String(p.id) === String(item.id) ? { ...p, stock: p.stock + item.count } : p
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
        obtenerProductosAPI,
        crearProductoAPI,
        editarProductoAPI,
        eliminarProductoAPI,
        carrito,
        setCarrito,
        favoritos,
        toggleFavorito,
        user,
        setUser,
        logout,
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