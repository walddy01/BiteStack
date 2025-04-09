import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native'
import { useState } from 'react'
import { styles } from '../../utils/styles';
import Preferencias from '@/components/Preferencias';
import SliderRecetas from '@/components/SliderRecetas';

export default function Index() {
  const [editarPreferencias, setEditarPreferencias] = useState(false)

  const [comidasActivas, setComidasActivas] = useState({
    desayuno: true,
    almuerzo: true,
    cena: true,
  })
  
  const [preferencias, setPreferencias] = useState({
    dieta: 'Alta en proteínas',
    calorias: '450',
    alergias: '',
    porciones: '1',
    preferencias: '',
  })
  
  const [preferenciasOriginales, setPreferenciasOriginales] = useState(preferencias)
  
  const handleChange = (campo: string, valor: string) => {
    setPreferencias((prevState) => ({
      ...prevState,
      [campo]: valor,
    }))
  }
  
  const guardarPreferencias = () => {
    setPreferenciasOriginales(preferencias)
    setEditarPreferencias(false)
  }
  
  const cancelarPreferencias = () => {
    setPreferencias(preferenciasOriginales)
    setEditarPreferencias(false)
  }

  const generarMenu = () => {
    alert(JSON.stringify(preferencias))
  }
  
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

          <SliderRecetas />

        </ScrollView>
      </SafeAreaView>
    </>
  )
}