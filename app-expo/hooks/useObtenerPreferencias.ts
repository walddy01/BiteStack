import axios from 'axios';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Preferencias {
  dieta: string;
  calorias: number;
  alergias: string;
  porciones: number;
  preferencias_adicionales: string;
}

export default function useObtenerPreferencias() {
  const [preferencias, setPreferencias] = useState<Preferencias | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  useEffect(() => {
    const fetchPreferencias = async () => {
      setCargando(true);
      setError(null);

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;

        if (!token) {
          setError(new Error('Usuario no autenticado'));
          setCargando(false);
          return;
        }

        const res = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/usuarios/perfil`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const prefs = {
          alergias: res.data.data.allergies,
          calorias: res.data.data.calories,
          dieta: res.data.data.diet,
          porciones: res.data.data.servings,
          preferencias_adicionales: res.data.data.additionalPreferences,
        };
        setPreferencias(prefs);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Error al obtener preferencias';
        setError(new Error(errorMessage));
        console.error('Error al obtener preferencias:', errorMessage);
      } finally {
        setCargando(false);
      }
    };

    fetchPreferencias();
  }, []); // Sin dependencias, se ejecuta una vez al montar

  return {
    preferencias,
    cargando,
    error,
  };
}
