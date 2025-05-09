import axios from 'axios';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface comidasActivas {
  desayuno: boolean;
  almuerzo: boolean;
  cena: boolean;
}

export default function useGenerarMenu() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<null | Error>(null);
  const [respuesta, setRespuesta] = useState(null);

  const generar = async (comidasActivas: comidasActivas) => {
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

      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/menus/generar`,
        comidasActivas,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRespuesta(res.data);
      return res.data;
    } catch (err: any) {
      const mensaje = err.response?.data?.error || 'Error desconocido';
      setError(new Error(mensaje));
      console.error('Error al generar el menú:', mensaje);
    } finally {
      setCargando(false);
    }
  };

  return {
    generar,
    cargando,
    error,
    respuesta,
  };
}
