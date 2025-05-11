import axios from 'axios';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface RegenerarRecetaPayload {
  userPrompt: string;
}

interface Ingrediente {
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

interface Receta {
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
  ingredients: Ingrediente[];
  schedules: Schedule[];
}

export default function useRegenerarReceta() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<null | Error>(null);
  const [respuesta, setRespuesta] = useState<Receta | null>(null);

  const regenerar = async (
    idReceta: number,
    payload: RegenerarRecetaPayload
  ) => {
    setCargando(true);
    setError(null);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        setError(new Error('Usuario no autenticado'));
        setCargando(false);
        return null;
      }

      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/recetas/regenerar/${idReceta}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRespuesta(res.data.data);
      return res.data.data;
    } catch (err: any) {
      const mensaje =
        err.response?.data?.error ||
        err.message ||
        'Error al regenerar la receta';
      setError(new Error(mensaje));
      console.error('Error al regenerar receta:', mensaje);
      return null;
    } finally {
      setCargando(false);
    }
  };

  return {
    regenerar,
    cargando,
    error,
    respuesta,
  };
}
