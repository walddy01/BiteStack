import axios from "axios";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const [session, setSession] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setCargando(false);
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const globalLoadingState = cargando;
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
      setCargando(globalLoadingState);
    }
  };

  const signOut = async () => {
    const globalLoadingState = cargando;
    setCargando(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
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
