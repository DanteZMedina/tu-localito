// helpers-inventario.js
import { inventario } from './stock-productos.js';

// Obtener lista de departamentos únicos
function getDepartamentos() {
  debugger
  return inventario.map(dep => dep.departamento);
}

function capitalize(word) {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// Obtener lista de categorías por departamento
function getCategorias(nombreDepartamento) {
  const dep = inventario.find(d => d.departamento === nombreDepartamento);
  if (!dep) return [];
  return dep.categorias.map(cat => cat.nombre);
}

export { getDepartamentos, getCategorias, capitalize };
