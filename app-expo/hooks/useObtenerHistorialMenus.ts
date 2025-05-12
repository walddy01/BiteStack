import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface Recipe {
  id: number;
  title: string;
  description: string;
  prep_time: number;
  servings: number;
  difficulty: string;
  favorite: boolean;
  date: string;
  mealType: string;
}

export interface MenuHistorial {
  menuId: number;
  menuDate: string;
  recipes: Recipe[];
}

interface APIResponse {
  message: string;
  data: MenuHistorial[];
}

export default function useObtenerHistorialMenus() {
  const [menus, setMenus] = useState<MenuHistorial[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refrescar = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error('Usuario no autenticado para obtener historial de menús.');
      }

      const res = await axios.get<APIResponse>(
        `${process.env.EXPO_PUBLIC_API_URL}/api/menus/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(res.data.data)) {
        setMenus(res.data.data);
      } else {
        setMenus([]);
      }
    } catch (err: any) {
      const mensaje =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Error al obtener el historial de menús';
      setError(new Error(mensaje));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    refrescar();
  }, [refrescar]);

  return {
    menus,
    cargando,
    error,
    refrescar,
  };
}
