import axios from 'axios';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface Preferencias {
  dieta: string;
  calorias: number;
  alergias: string;
  porciones: number;
  preferencias_adicionales: string;
}

export default function useActualizarPreferencias() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<null | Error>(null);
  const [respuesta, setRespuesta] = useState(null);

  const actualizar = async (preferencias: Preferencias) => {
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

      const res = await axios.patch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/usuarios/perfil`,
        preferencias,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRespuesta(res.data);
      return res.data;
    } catch (err: any) {
      const mensaje = err.response?.data?.error || err.message || 'Error al actualizar preferencias';
      setError(new Error(mensaje));
      console.error('Error al actualizar preferencias:', mensaje);
    } finally {
      setCargando(false);
    }
  };

  return {
    actualizar,
    cargando,
    error,
    respuesta,
  };
}
