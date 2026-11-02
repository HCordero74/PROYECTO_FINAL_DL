# 🥐 Panadería y Pastelería Lucy — Hito 1 (Arquitectura y Documentación Técnica)

Bienvenido al repositorio oficial del proyecto **Panadería y Pastelería Lucy**, desarrollado como proyecto para el programa **Fullstack Developer** en Desafío Latam.

Este repositorio contiene la arquitectura, el diseño de la interfaz gráfica, el modelado de base de datos relacional y la definición técnica del contrato de API REST para la plataforma e-commerce de la pastelería.

---

## 📌 Tabla de Contenidos
1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Estructura del Repositorio](#estructura-del-repositorio)
3. [Requerimientos del Hito 1](#requerimientos-del-hito-1)
   - [Requerimiento 1: Diseño de la Interfaz Gráfica (Figma)](#requerimiento-1-diseño-de-la-interfaz-gráfica-figma)
   - [Requerimiento 2: Mapa de Navegación (Rutas Públicas y Privadas)](#requerimiento-2-mapa-de-navegación-rutas-públicas-y-privadas)
   - [Requerimiento 3: Listado de Dependencias y Tecnologías](#requerimiento-3-listado-de-dependencias-y-tecnologías)
   - [Requerimiento 4: Modelo de Base de Datos (PostgreSQL)](#requerimiento-4-modelo-de-base-de-datos-postgresql)
   - [Requerimiento 5: Contrato del API REST](#requerimiento-5-contrato-del-api-rest)
4. [Recursos de Diseño](#recursos-de-diseño)
5. [Autor](#autor)

---

## 📖 Descripción del Proyecto
**Panadería y Pastelería Lucy** es una aplicación web fullstack diseñada para la gestión y comercialización de productos artesanales (Panadería, Pastelería, Tortas y Café). Permite a los usuarios explorar el catálogo público, registrarse, autenticarse de forma segura y gestionar sus publicaciones y productos favoritos en un panel privado.

---

## 📁 Estructura del Repositorio

```text
panaderia-y-pasteleria-lucy/
├── backend/                   # Servidor API REST (Node.js & Express)
│   ├── src/
│   │   ├── controllers/       # Lógica de controladores
│   │   ├── models/            # Consultas a PostgreSQL (pg)
│   │   ├── routes/            # Endpoints del servidor
│   │   └── middlewares/       # JWT y autenticación
│   ├── tests/                 # Pruebas automatizadas (Jest & Supertest)
│   ├── .env.example           # Plantilla de variables de entorno
│   ├── package.json
│   └── server.js
│
├── frontend/                  # Aplicación Cliente (React + Vite)
│   ├── public/                # Recursos estáticos
│   ├── src/
│   │   ├── components/        # Componentes UI reutilizables
│   │   ├── views/             # Vistas públicas y privadas
│   │   ├── App.jsx            # Enrutamiento principal (React Router)
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── docs/                      # Documentación entregable Hito 1
│   ├── informe-hito1.pdf      # Informe técnico completo en PDF
│   ├── der-base-de-datos.png  # Diagrama relacional (dbdiagram.io)
│   └── mapa-navegacion.png    # Esquema de navegación (Figma)
│
├── .gitignore
└── README.md                  # Portada técnica del proyecto

---

## 🛠️ Requerimientos del Hito 1

### Requerimiento 1: Diseño de la Interfaz Gráfica (Figma)
Se estructuraron 7 vistas principales alineadas con las necesidades del cliente:
- **Vistas Públicas:** Página Principal (Home), Catálogo / Tienda, Registro de Usuario, Inicio de Sesión y Detalle de Publicación.
- **Vistas Privadas:** Mi Perfil de Usuario y Formulario de Creación/Edición de Publicación.

### Requerimiento 2: Mapa de Navegación (Rutas Públicas y Privadas)
El flujo de navegación delimita con claridad la zona pública del área protegida, utilizando una barrera de autenticación mediante inicio de sesión para el acceso al perfil y creación de publicaciones.

### Requerimiento 3: Listado de Dependencias y Tecnologías

| Capa | Dependencia | Tipo | Propósito Principal |
| :--- | :--- | :--- | :--- |
| **Frontend** | `react` / `react-dom` | Producción | Interfaz de usuario declarativa basada en componentes. |
| **Frontend** | `react-router-dom` | Producción | Gestión de enrutamiento y protección de rutas privadas. |
| **Frontend** | `axios` | Producción | Cliente HTTP para consumir los endpoints de la API. |
| **Frontend** | `bootstrap` / `react-bootstrap` | Producción | Framework de estilos responsivo. |
| **Backend** | `express` | Producción | Framework web para rutas y middlewares. |
| **Backend** | `pg` (*node-postgres*) | Producción | Cliente nativo para consultas SQL a PostgreSQL. |
| **Backend** | `jsonwebtoken` (JWT) | Producción | Autenticación stateless mediante tokens firmados. |
| **Backend** | `bcryptjs` | Producción | Hashing criptográfico de contraseñas de usuarios. |
| **Backend** | `dotenv` & `cors` | Producción | Aislamiento de variables de entorno y políticas CORS. |
| **Dev / Test** | `nodemon` | Desarrollo | Reinicio automático del servidor en desarrollo. |
| **Dev / Test** | `jest` & `supertest` | Desarrollo | Framework y suite de pruebas de integración HTTP. |

### Requerimiento 4: Modelo de Base de Datos (PostgreSQL)
Se diseñó un modelo entidad-relación relacional optimizado compuesto por 3 tablas:
- **usuarios:** Almacena las credenciales e información de perfil.
- **publicaciones:** Contiene la información de los productos del catálogo (relación `1:N` con `usuarios`).
- **favoritos:** Tabla intermedia para la relación `N:M` entre `usuarios` y `publicaciones`.

### Requerimiento 5: Contrato del API REST

#### Módulo de Autenticación (`/api/auth`)
- `POST /api/auth/register` (Público) — Registro de usuarios con contraseña hasheada.
- `POST /api/auth/login` (Público) — Autenticación y entrega del token JWT.

#### Módulo de Publicaciones (`/api/publicaciones`)
- `GET /api/publicaciones` (Público) — Obtención de todo el catálogo.
- `GET /api/publicaciones/:id` (Público) — Detalle de un producto.
- `POST /api/publicaciones` (Privado - JWT) — Creación de una publicación.
- `DELETE /api/publicaciones/:id` (Privado - JWT) — Eliminación de una publicación propia.

#### Módulo de Favoritos (`/api/favoritos`)
- `GET /api/favoritos` (Privado - JWT) — Listado de favoritos del usuario autenticado.
- `POST /api/favoritos` (Privado - JWT) — Guardar producto como favorito.
- `DELETE /api/favoritos/:id` (Privado - JWT) — Eliminar producto de favoritos.

---

## 🎨 Recursos de Diseño
- **Lienzo en Figma:** [Ver Wireframes y Mapa de Navegación en Figma](https://www.figma.com/design/Roz0E0PPsMAIva6N0mdVk2/Panader%C3%ADa-y-Pasteler%C3%ADa-Lucy?node-id=0-1&p=f&t=JHXbnrgElNAKuNIi-0)
- **Modelo ER de Base de Datos:** [Ver Diagrama en dbdiagram.io](https://dbdiagram.io/d/Tablas-Lucy-6ae56ae6f99a5c458bc1b0ff)

---

## 👤 Autor
- **Hernán Cordero Araya**
- **Programa:** Fullstack Developer — Desafío Latam
