import { useState } from 'react';
import axios from 'axios';

interface comidasActivas {
    desayuno: boolean;
    almuerzo: boolean;
    cena: boolean;
}

export default function useGenerarMenu() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<null | Error>(null);
  const [respuesta, setRespuesta] = useState(null);

  const generar = async (idUsuario: number, comidasActivas: comidasActivas) => {
    setCargando(true);
    setError(null);

    try {
      const res = await axios.post(`http://192.168.0.33:3000/api/menus/generarMenu/${idUsuario}`, comidasActivas);
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