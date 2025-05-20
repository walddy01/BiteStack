import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

export const useAlternarAdquiridoIngrediente = () => {
  const [cargando, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const alternarAdquirido = useCallback(async (idLista: number, idIngrediente: number) => {
    if (!session?.access_token) {
      setError("Usuario no autenticado.");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.patch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/menus/listascompra/adquirido/${idLista}/${idIngrediente}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      setLoading(false);
      return true;
    } catch (err: any) {
      const mensaje =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Ocurrió un error desconocido al alternar el estado';
      console.error("Error en useAlternarAdquiridoIngrediente:", err.response?.data || err);
      setError(mensaje);
      setLoading(false);
      return false;
    }
  }, [session]);

  return { alternarAdquirido, cargando, error };
};
