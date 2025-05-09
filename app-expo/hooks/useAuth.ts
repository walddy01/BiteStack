import axios from "axios";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// Hook personalizado para autenticación
export function useAuth() {
  const [session, setSession] = useState<any>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, ses) => {
        setSession(ses);
        if (ses) {
          console.log("Access Token:", ses.access_token);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setCargando(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setCargando(false);
    }
  };

  const signOut = async () => {
    setCargando(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  // Ahora usando axios para el registro
  const signUpApi = async (payload: {
    email: string;
    password: string;
    nombre: string;
    apellidos: string;
    dieta?: string;
    porciones?: number;
    preferencias_adicionales?: string;
  }) => {
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
      return response.data;
    } catch (err: any) {
      // axios maneja los errores diferente a fetch
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError(err.message);
      }
      return null;
    } finally {
      setCargando(false);
    }
  };

  return { session, cargando, error, signIn, signOut, signUpApi };
}
