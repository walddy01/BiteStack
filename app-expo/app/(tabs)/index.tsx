import { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native'
import { styles } from '../../styles/styles'

import Preferencias from '@/components/Preferencias'
import SliderRecetas from '@/components/SliderRecetas'
import useActualizarPreferencias from '@/hooks/useActualizarPreferencias'
import useGenerarMenu from '@/hooks/useGenerarMenu'
import useObtenerPreferencias from '@/hooks/useObtenerPreferencias'

export default function Index() {
  const [recargarRecetas, setRecargarRecetas] = useState(0);
  const [editarPreferencias, setEditarPreferencias] = useState(false)

  const [comidasActivas, setComidasActivas] = useState({
    desayuno: true,
    almuerzo: true,
    cena: true,
  })

  const [preferencias, setPreferencias] = useState({
    dieta: 'Alta en proteínas',
    calorias: 450,
    alergias: '',
    porciones: 1,
    preferencias_adicionales: '',
  })

  const [preferenciasOriginales, setPreferenciasOriginales] = useState(preferencias)

  const {
    preferencias: preferenciasDB,
    cargando: cargandoObtenerPrefs,
    error: errorObtenerPrefs
  } = useObtenerPreferencias(1)

  useEffect(() => {
    if (preferenciasDB) {
      setPreferencias(preferenciasDB)
      setPreferenciasOriginales(preferenciasDB)
    }
  }, [preferenciasDB])

  const {
    actualizar: actualizarPrefs,
    cargando: cargandoActualizarPrefs,
    error: errorActualizarPrefs,
    respuesta: respuestaActualizarPrefs
  } = useActualizarPreferencias()

  const handleChange = (campo: string, valor: string) => {
    setPreferencias((prevState) => ({
      ...prevState,
      [campo]: valor,
    }))
  }

  const guardarPreferencias = () => {
    const prefsConvertidas = {
      ...preferencias,
      calorias: String(preferencias.calorias).trim() === '' ? 1 : Number(preferencias.calorias),
      porciones: String(preferencias.porciones).trim() === '' || Number(preferencias.porciones) === 0 ? 1 : Number(preferencias.porciones),
    }

    setPreferenciasOriginales(prefsConvertidas)
    setPreferencias(prefsConvertidas)
    actualizarPrefs(prefsConvertidas)
    setEditarPreferencias(false)
  }

  const cancelarPreferencias = () => {
    setPreferencias(preferenciasOriginales)
    setEditarPreferencias(false)
  }

  const {generar, cargando: cargandoGenerarMenu, error: errorGenerarMenu, respuesta: respuestaGenerarMenu} = useGenerarMenu()
  
  const generarMenu = async () => {
    console.log(comidasActivas)
    try {
      await generar(1, comidasActivas);
      // Forzar actualización del SliderRecetas
      setRecargarRecetas(prev => prev + 1);
    } catch (error) {
      console.error('Error al generar menú:', error);
    }
  };
  
  useEffect(() => {
    if (cargandoGenerarMenu) {
      alert('Generando menú...');
    }
  }, [cargandoGenerarMenu]);
  
  useEffect(() => {
    if (errorGenerarMenu) {
      alert(errorGenerarMenu.message)
    }
  }, [errorGenerarMenu])  

  useEffect(() => {
    if (respuestaGenerarMenu) {
      alert('Menú generado con éxito');
      console.log(respuestaGenerarMenu);
    }
  }, [respuestaGenerarMenu]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.title}>Tu Plan Semanal</Text>
            <Text style={styles.subtitle}>Buenos días, walddy</Text>
          </View>

          <Preferencias
            preferencias={preferencias}
            editarPreferencias={editarPreferencias}
            setPreferenciasOriginales={setPreferenciasOriginales}
            cancelarPreferencias={cancelarPreferencias}
            guardarPreferencias={guardarPreferencias}
            setEditarPreferencias={setEditarPreferencias}
            handleChange={handleChange}
            comidasActivas={comidasActivas}
            setComidasActivas={setComidasActivas}
            generarMenu={generarMenu}
          />

          <SliderRecetas userId={1} recargarRecetas={recargarRecetas} />

        </ScrollView>
      </SafeAreaView>
    </>
  )
}
