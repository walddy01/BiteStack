// hooks/useObtenerMenuSemana.ts

import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Recipe {
  id: number;
  title: string;
  description: string;
  prep_time: number;
  servings: number;
  difficulty: string;
  date: string;     // YYYY-MM-DD
  mealType: string; // tipo_comida que devuelve la API
}

export interface DayMenu {
  menuId: number;
  menuDate: string;  // YYYY-MM-DD (lunes de la semana)
  recipes: Recipe[]; // todas las recetas de la semana, cada una con mealType
}

interface APIResponse {
  message: string;
  data: DayMenu;
}

export default function useObtenerMenuSemana(userId: number, recargarRecetas?: number) {
  const [menuData, setMenuData] = useState<DayMenu | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMenuSemana = async () => {
      setCargando(true);
      setError(null);

      try {
        const res = await axios.get<APIResponse>(
          `http://192.168.0.33:3000/api/menus/menuSemana/${userId}`
        );
        // la API devuelve DayMenu con recipes[].mealType
        // Comprobar si data es un array vacío o no es un objeto válido
        if (res.data.data?.menuId) {
          setMenuData(res.data.data);
        } else {
          setMenuData(null);
          console.warn('No se encontró menú válido:', res.data);
        }
      } catch (err: any) {
        const mensaje = err.response?.data?.message || 'Error al obtener el menú';
        setError(new Error(mensaje));
        console.error('Error al obtener menú:', mensaje);
      } finally {
        setCargando(false);
      }
    };

    fetchMenuSemana();
  }, [userId, recargarRecetas]); // Agregamos recargarRecetas como dependencia

  return {
    menuData,
    cargando,
    error,
  };
}
