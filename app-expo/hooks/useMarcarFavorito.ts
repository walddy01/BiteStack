import axios from 'axios';
import { useState } from 'react';

interface APIResponse {
  message: string;
}

export default function useMarcarFavorito() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<null | Error>(null);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState<string | null>(
    null
  );

  const marcarFavorito = async (recetaId: number) => {
    if (!recetaId) {
      setError(new Error('Se requiere el ID de la receta para marcarla como favorita.'));
      setMensajeConfirmacion(null);
      return;
    }

    setCargando(true);
    setError(null);
    setMensajeConfirmacion(null);

    try {
      // Asumo que la API de marcar/desmarcar favorito también es un endpoint GET
      // y que el estado (marcar/desmarcar) se gestiona en el backend
      const res = await axios.get<APIResponse>(
        `http://192.168.0.33:3000/api/recetas/favorito/${recetaId}`
      );

      setMensajeConfirmacion(res.data.message);
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al actualizar el estado de favorito';
      setError(new Error(mensaje));
      console.error('Error al marcar/desmarcar receta como favorita:', mensaje);
    } finally {
      setCargando(false);
    }
  };

  return {
    marcarFavorito,
    cargando,
    error,
    mensajeConfirmacion,
  };
}
