import axios from 'axios';
import { useEffect, useState } from 'react';

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
    const fetchReceta = async () => {
      if (!recetaId) {
        setReceta(null);
        setCargando(false);
        setError(null);
        return;
      }

      setCargando(true);
      setError(null);

      try {
        const res = await axios.get<APIResponse>(
          `http://192.168.0.33:3000/api/recetas/${recetaId}`
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
