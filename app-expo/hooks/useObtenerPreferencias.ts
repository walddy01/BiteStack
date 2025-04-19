import { useEffect, useState } from 'react';
import axios from 'axios';

interface Preferencias {
  dieta: string;
  calorias: number;
  alergias: string;
  porciones: number;
  preferencias: string;
}

export default function useObtenerPreferencias(idUsuario: number) {
  const [preferencias, setPreferencias] = useState<Preferencias | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  useEffect(() => {
    const fetchPreferencias = async () => {
      setCargando(true);
      setError(null);
      
      try {
        const res = await axios.get(`http://192.168.0.33:3000/api/usuarios/${idUsuario}`);
        const prefs = {
          alergias: res.data.data.allergies,
          calorias: res.data.data.calories,
          dieta: res.data.data.diet,
          porciones: res.data.data.servings,
          preferencias: res.data.data.additionalPreferences
        };
        setPreferencias(prefs);
        return res.data;
      } catch (err: any) {
        setError(err);
        console.error('Error al obtener preferencias:', err);
      } finally {
        setCargando(false);
      }
    };
    
    fetchPreferencias();
  }, [idUsuario]);
  
  return {
    preferencias,
    cargando,
    error
  };
}
