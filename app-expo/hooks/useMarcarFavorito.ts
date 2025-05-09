import axios from 'axios';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface APIResponse {
  message: string;
}

export default function useMarcarFavorito() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<null | Error>(null);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState<string | null>(null);

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
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        setError(new Error('Usuario no autenticado'));
        setCargando(false);
        return;
      }

      const res = await axios.patch<APIResponse>(
        `${process.env.EXPO_PUBLIC_API_URL}/api/recetas/favorito/${recetaId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
