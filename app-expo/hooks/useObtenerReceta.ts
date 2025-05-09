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

interface Schedule {
  date: string;
  mealType: string;
}

export interface FullRecipe {
  recipe: {
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
  };
  ingredients: Ingredient[];
  schedules: Schedule[];
}

interface APIResponse {
  message: string;
  data: {
    recipe: FullRecipe['recipe'];
    ingredients: FullRecipe['ingredients'];
    schedules: FullRecipe['schedules'];
  };
}

export default function useObtenerReceta(recetaId: number) {
  const [receta, setReceta] = useState<FullRecipe | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  useEffect(() => {
    if (!recetaId) {
      setReceta(null);
      setCargando(false);
      setError(null);
      return;
    }

    const fetchReceta = async () => {
      setCargando(true);
      setError(null);

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;

        if (!token) {
          setError(new Error('Usuario no autenticado para obtener receta.'));
          setReceta(null);
          setCargando(false);
          return;
        }

        const res = await axios.get<APIResponse>(
          `${process.env.EXPO_PUBLIC_API_URL}/api/recetas/${recetaId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.data) {
          setReceta(res.data.data as FullRecipe);
        } else {
          setReceta(null);
          console.warn('No se encontró receta válida:', res.data);
        }
      } catch (err: any) {
        const mensaje = err.response?.data?.message || 'Error al obtener la receta';
        setError(new Error(mensaje));
        console.error('Error al obtener receta:', mensaje);
      } finally {
        setCargando(false);
      }
    };

    fetchReceta();
  }, [recetaId]);

  return {
    receta,
    cargando,
    error,
  };
}
