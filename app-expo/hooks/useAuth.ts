import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const [session, setSession] = useState<any>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, ses) => setSession(ses)
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
      const response = await fetch(
        `http://192.168.0.33:3000/api/usuarios/registro`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrar usuario");
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setCargando(false);
    }
  };

  return { session, cargando, error, signIn, signOut, signUpApi };
}
