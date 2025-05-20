import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

export interface Ingrediente {
  id: number;
  name: string;
  acquired: boolean;
}

export interface ListaCompra {
  shoppingListId: number;
  date: string;
  ingredients: Ingrediente[];
}

export const useObtenerListasCompra = () => {
  const [listasCompra, setListasCompra] = useState<ListaCompra[]>([]);
  const [cargando, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth(); // Obtener la sesión para el token

  const fetchListasCompra = useCallback(async () => {
    if (!session?.access_token) {
      setError("Usuario no autenticado.");
      setLoading(false);
      setListasCompra([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<{ message: string, data: ListaCompra[] }>(
        `${process.env.EXPO_PUBLIC_API_URL}/api/menus/listascompra`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );
      setListasCompra(response.data.data);
    } catch (err: any) {
      const mensaje =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Ocurrió un error desconocido';
      console.error("Error en useObtenerListasCompra:", err.response?.data || err);
      setError(mensaje);
      setListasCompra([]);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchListasCompra();
    } else {
      setListasCompra([]);
      setLoading(false);
      setError("Usuario no autenticado.");
    }
  }, [session, fetchListasCompra]);

  return { listasCompra, cargando, error, refetch: fetchListasCompra };
};
