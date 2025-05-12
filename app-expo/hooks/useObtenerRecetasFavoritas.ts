import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface Ingredient {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  note: string;
}

interface Schedule {
  date: string;
  mealType: string;
}

export interface FullRecipe {
  id: number;
  title: string;
  description: string;
  number_of_servings: number;
  difficulty: string;
  prep_time: number;
  instructions: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  favorite: boolean;
  ingredients: Ingredient[];
  schedules: Schedule[];
}

interface APIResponse {
  message: string;
  data: FullRecipe[];
}

export default function useObtenerRecetasFavoritas() {
  const [recetas, setRecetas] = useState<FullRecipe[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecetasFavoritas = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error('Usuario no autenticado para obtener recetas favoritas.');
      }

      const res = await axios.get<APIResponse>(
        `${process.env.EXPO_PUBLIC_API_URL}/api/recetas/favoritas`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(res.data.data)) {
        setRecetas(res.data.data);
      } else {
        setRecetas([]);
      }
    } catch (err: any) {
      const mensaje =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Error al obtener las recetas favoritas';
      setError(new Error(mensaje));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    fetchRecetasFavoritas();
  }, [fetchRecetasFavoritas]);

  return {
    recetas,
    cargando,
    error,
    refrescar: fetchRecetasFavoritas,
  };
}
