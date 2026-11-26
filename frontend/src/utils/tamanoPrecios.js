export function formatearCLP(valor) {
  const numero = Number(valor) || 0;
  return `$${numero.toLocaleString('es-CL')}`;
}

function parsearMontoCLP(textoMonto) {
  const limpio = String(textoMonto || '').replace(/[^\d]/g, '');
  return limpio ? Number(limpio) : null;
}

/**
 * Extrae opciones de tamaño y precio desde `producto.desc`.
 * Soporta formatos como:
 * - "Chico (10 pers.): $25.000 | Grande (20 pers.): $43.000"
 * - "Medio (30 pers.): $44.000."
 * - "Chico: $1.890 | Grande: $3.100."
 */
export function extraerOpcionesTamano(producto) {
  if (!producto) return [];

  const descripcion = producto.desc || producto.descripcion || '';
  const precioBase = Number(producto.price ?? producto.precio) || 0;

  const regex =
    /((?:Tama\u00f1o\s+)?(?:Chico|Mediano|Medio|Grande)(?:\s*\([^)]+\))?|\d+\s*pers\.)\s*:\s*\$?\s*([\d.]+)/gi;

  const encontradas = [];
  const vistas = new Set();

  let match;
  while ((match = regex.exec(descripcion)) !== null) {
    const etiquetaRaw = match[1].trim().replace(/\s+/g, ' ');
    const monto = parsearMontoCLP(match[2]);

    if (!monto) continue;

    const etiqueta = etiquetaRaw.replace(/^Tama\u00f1o\s+/i, '');
    const clave = etiqueta.toLowerCase();

    if (!vistas.has(clave)) {
      vistas.add(clave);
      encontradas.push({
        etiqueta,
        precio: monto,
      });
    }
  }

  if (encontradas.length === 0) {
    return [];
  }

  const tienePrecioBase = encontradas.some((op) => Number(op.precio) === precioBase);
  if (!tienePrecioBase && precioBase > 0) {
    encontradas.unshift({
      etiqueta: 'Mediano',
      precio: precioBase,
    });
  }

  return encontradas;
}

export function obtenerIndiceDefecto(opciones, precioBase) {
  if (!opciones || opciones.length === 0) return 0;

  const idxPorPrecio = opciones.findIndex(
    (op) => Number(op.precio) === Number(precioBase)
  );
  if (idxPorPrecio !== -1) return idxPorPrecio;

  const idxMedio = opciones.findIndex((op) =>
    /mediano|medio/i.test(op.etiqueta)
  );
  if (idxMedio !== -1) return idxMedio;

  return Math.floor(opciones.length / 2);
}