import axios from "axios";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// Hook personalizado para autenticación
export function useAuth() {
  const [session, setSession] = useState<any>(null);
  const [cargando, setCargando] = useState(true); // Iniciar como true
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // getSession para una carga inicial potencialmente más rápida de la sesión.
    // onAuthStateChange se encargará de poner cargando a false y actualizar la sesión.
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      // No ponemos cargando a false aquí; dejamos que el listener lo haga
      // para asegurar que tengamos el estado de sesión más actualizado.
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setCargando(false); // Marcar la carga inicial como completa aquí.
        // if (currentSession) {
        //   console.log("Access Token:", currentSession.access_token);
        // }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    // Guardamos el estado de carga global para restaurarlo después
    const globalLoadingState = cargando;
    setCargando(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
      // setSession ya se actualiza por onAuthStateChange
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setCargando(globalLoadingState); // Restaurar estado de carga global
    }
  };

  const signOut = async () => {
    const globalLoadingState = cargando;
    setCargando(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
      // setSession ya se actualiza por onAuthStateChange
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCargando(globalLoadingState);
    }
  };

  const signUpApi = async (payload: {
    email: string;
    password: string;
    nombre: string;
    apellidos: string;
    dieta?: string;
    porciones?: number;
    preferencias_adicionales?: string;
  }) => {
    const globalLoadingState = cargando;
    setCargando(true);
    setError(null);
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/usuarios/registro`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Aquí no hay cambio de sesión directo, así que no esperamos onAuthStateChange
      return response.data;
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError(err.message);
      }
      return null;
    } finally {
      setCargando(globalLoadingState);
    }
  };

  return { session, cargando, error, signIn, signOut, signUpApi };
}
