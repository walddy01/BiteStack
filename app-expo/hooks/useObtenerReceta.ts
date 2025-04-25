import { useEffect, useState } from 'react';
import axios from 'axios';


export default function useObtenerReceta(idUsuario: number) {
  const [receta, setReceta] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  useEffect(() => {
    
  }, [idUsuario]);
  
  return {
    receta,
    cargando,
    error
  };
}
