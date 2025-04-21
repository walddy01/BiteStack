import { useState } from 'react';
import axios from 'axios';

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
      const res = await axios.patch('http://192.168.0.33:3000/api/usuarios/1', preferencias);
      setRespuesta(res.data);
      return res.data;
    } catch (err: any) {
      setError(err);
      console.error('Error al actualizar preferencias:', err);
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
