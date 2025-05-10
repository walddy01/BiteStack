// Index.tsx
import { useEffect, useState } from 'react'
import { ActivityIndicator, SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native'
import { styles } from '../../styles/styles'
import AlertPersonalizado from '@/components/AlertPersonalizado'
import Preferencias from '@/components/Preferencias'
import SliderRecetas from '@/components/SliderRecetas'
import useActualizarPreferencias from '@/hooks/useActualizarPreferencias'
import { useAuth } from '@/hooks/useAuth'
import useGenerarMenu from '@/hooks/useGenerarMenu'
import useObtenerPreferencias from '@/hooks/useObtenerPreferencias'
import useObtenerMenuSemana from '@/hooks/useObtenerMenuSemana'
import { colors } from '../../styles/colors'

export default function Index() {
  const { session } = useAuth()
  const [editarPreferencias, setEditarPreferencias] = useState(false)

  // estados para AlertPersonalizado
  const [alertaVisible, setAlertaVisible] = useState(false)
  const [alertaMensaje, setAlertaMensaje] = useState('')
  const [alertaTipo, setAlertaTipo] = useState<'exito' | 'error' | 'info'>('info')

  // para activar/desactivar comidas
  const [comidasActivas, setComidasActivas] = useState({
    desayuno: true,
    almuerzo: true,
    cena: true,
  })

  // preferencias y su copia original
  const [preferencias, setPreferencias] = useState({
    dieta: 'Alta en proteínas',
    calorias: 450,
    alergias: '',
    porciones: 1,
    preferencias_adicionales: '',
  })
  const [preferenciasOriginales, setPreferenciasOriginales] = useState(preferencias)

  // hook para obtener prefs de BD
  const {
    preferencias: preferenciasDB,
    cargando: cargandoObtenerPrefs,
    error: errorObtenerPrefs,
  } = useObtenerPreferencias()

  useEffect(() => {
    if (preferenciasDB) {
      setPreferencias(preferenciasDB)
      setPreferenciasOriginales(preferenciasDB)
    }
  }, [preferenciasDB])

  // hook para actualizar prefs
  const {
    actualizar: actualizarPrefs,
  } = useActualizarPreferencias()

  const handleChange = (campo: string, valor: string) => {
    setPreferencias(prev => ({ ...prev, [campo]: valor }))
  }

  const guardarPreferencias = () => {
    const prefsConvertidas = {
      ...preferencias,
      calorias:
        String(preferencias.calorias).trim() === ''
          ? 1
          : Number(preferencias.calorias),
      porciones:
        String(preferencias.porciones).trim() === '' ||
        Number(preferencias.porciones) === 0
          ? 1
          : Number(preferencias.porciones),
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

  // hook para generar menú
  const {
    generar,
    cargando: cargandoGenerarMenu,
    error: errorGenerarMenu,
    respuesta: respuestaGenerarMenu,
  } = useGenerarMenu()

  // hook para obtener menú y refrescarlo
  const {
    menuData,
    cargando: cargandoMenu,
    error: errorMenu,
    refrescarMenu,
  } = useObtenerMenuSemana()

  const generarMenu = async () => {
    try {
      const result = await generar(comidasActivas)
      if (result) {
        await refrescarMenu()
      }
    } catch (err) {
      console.error('Error al generar menú:', err)
    }
  }

  // alerta mientras esté generando
  useEffect(() => {
    if (cargandoGenerarMenu) {
      setAlertaMensaje('Generando menú...')
      setAlertaTipo('info')
      setAlertaVisible(true)
    }
  }, [cargandoGenerarMenu])

  // alerta si hay error al generar
  useEffect(() => {
    if (errorGenerarMenu) {
      setAlertaMensaje(errorGenerarMenu.message)
      setAlertaTipo('error')
      setAlertaVisible(true)
    }
  }, [errorGenerarMenu])

  // alerta solo cuando llega respuesta válida
  useEffect(() => {
    if (respuestaGenerarMenu) {
      setAlertaMensaje('Menú generado con éxito')
      setAlertaTipo('exito')
      setAlertaVisible(true)
    }
  }, [respuestaGenerarMenu])

  // carga primeras prefs
  if (cargandoObtenerPrefs) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.text, { marginTop: 10 }]}>Cargando preferencias...</Text>
      </View>
    )
  }

  // si no hay sesión
  if (!session && !cargandoObtenerPrefs) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white }}>
        <Text style={[styles.text, styles.bold, { color: colors.red, marginBottom: 10 }]}>
          Error de Autenticación
        </Text>
        <Text style={[styles.text, { textAlign: 'center', paddingHorizontal: 20 }]}>
          No estás autenticado. Por favor, inicia sesión para continuar.
        </Text>
      </View>
    )
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.title}>Tu Plan Semanal</Text>
            <Text style={styles.subtitle}>
              Buenos días, {session?.user?.user_metadata?.nombre}
            </Text>
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

          <SliderRecetas
            menuData={menuData}
            cargandoMenu={cargandoMenu}
            errorMenu={errorMenu}
          />

        </ScrollView>

        <AlertPersonalizado
          visible={alertaVisible}
          mensaje={alertaMensaje}
          tipo={alertaTipo}
          onClose={() => setAlertaVisible(false)}
        />
      </SafeAreaView>
    </>
  )
}
