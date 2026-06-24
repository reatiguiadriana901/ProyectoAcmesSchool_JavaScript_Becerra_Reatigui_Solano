import { getStudentByIdNumber } from '../utils/storage.js';

/**
 * Busca un estudiante por su número de identificación.
 * @returns {object|null} El estudiante si existe, null si no.
 */
export function verificarEstudiante(identificacion) {
  if (!identificacion) return null;
  return getStudentByIdNumber(identificacion);
}
