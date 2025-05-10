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
  date: string;     // YYYY-MM-DD
  mealType: string;
}

export interface DayMenu {
  menuId: number;
  menuDate: string;  
  recipes: Recipe[];
}

interface APIResponse {
  message: string;
  data: DayMenu;
}

export default function useObtenerMenuSemana() {
  const [menuData, setMenuData] = useState<DayMenu | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMenuSemana = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error('Usuario no autenticado');
      }

      const res = await axios.get<APIResponse>(
        `${process.env.EXPO_PUBLIC_API_URL}/api/menus/semana`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.data?.menuId) {
        setMenuData(res.data.data);
      } else {
        setMenuData(null);
      }
    } catch (err: any) {
      const mensaje = err.response?.data?.message || 'Error al obtener el menú';
      setError(new Error(mensaje));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    fetchMenuSemana();
  }, [fetchMenuSemana]);

  return {
    menuData,
    cargando,
    error,
    refrescarMenu: fetchMenuSemana,
  };
}
