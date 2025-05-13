import axios from 'axios';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Ingredient {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  note: string;
}

interface Recipe {
  id: number;
  title: string;
  description: string;
  prep_time: number;
  servings: number;
  difficulty: string;
  favorite: boolean;
  instructions: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  date: string;
  mealType: string;
  ingredients: Ingredient[];
}

interface Menu {
  id: number;
  menuDate: string;
  recipes: Recipe[];
}

interface APIResponse {
  message: string;
  data: Menu;
}

export default function useObtenerMenu(menuId: number) {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!menuId) {
      setMenu(null);
      setCargando(false);
      setError(null);
      return;
    }

    const fetchMenu = async () => {
      setCargando(true);
      setError(null);

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;

        if (!token) {
          throw new Error('Usuario no autenticado para obtener menú.');
        }

        const res = await axios.get<APIResponse>(
          `${process.env.EXPO_PUBLIC_API_URL}/api/menus/${menuId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.data) {
          setMenu(res.data.data);
        } else {
          setMenu(null);
          console.warn('No se encontró el menú:', res.data);
        }
      } catch (err: any) {
        const mensaje = err.response?.data?.message || 'Error al obtener el menú';
        setError(new Error(mensaje));
        console.error('Error al obtener menú:', mensaje);
      } finally {
        setCargando(false);
      }
    };

    fetchMenu();
  }, [menuId]);

  return {
    menu,
    cargando,
    error,
  };
}