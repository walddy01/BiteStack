import useMarcarFavorito from '@/hooks/useMarcarFavorito';
import useObtenerReceta from '@/hooks/useObtenerReceta';
import useRegenerarReceta from '@/hooks/useRegenerarReceta';
import { colors } from '@/styles/colors';
import { radius, shadow, spacing, typography } from '@/styles/globalStyles';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  ChefHat,
  Clock,
  Cookie,
  Droplets,
  Dumbbell,
  Flame,
  Heart,
  RefreshCw,
  Users,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetalleRecetaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recetaId = parseInt(id, 10);

  // Hooks
  const { receta: recetaApi, cargando, error } = useObtenerReceta(recetaId);
  const { marcarFavorito } = useMarcarFavorito();
  const {
    regenerar,
    cargando: cargandoRegenerar,
    error: errorRegenerar,
  } = useRegenerarReceta();

  // Estado local para la receta (permite actualizar tras regenerar)
  const [receta, setReceta] = useState<typeof recetaApi | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');

  // Sincroniza la receta local con la de la API al cargar
  useEffect(() => {
    if (recetaApi) {
      setReceta(recetaApi);
      setIsFavorite(recetaApi.recipe.favorite);
    }
  }, [recetaApi]);

  // Actualiza favorito localmente y en backend
  const toggleFavorite = async () => {
    setIsFavorite((prev) => !prev);
    try {
      await marcarFavorito(recetaId);
    } catch (error) {
      setIsFavorite((prev) => !prev);
      console.error('Error al marcar como favorito:', error);
    }
  };

  // Regenerar receta y actualizar estado local
  const handleRegenerar = async () => {
    if (!userPrompt.trim()) {
      // Opcional: mostrar alerta si el prompt está vacío
      alert('Por favor, ingresa un prompt para regenerar la receta.');
      return;
    }
    setModalVisible(false);
    const nuevaReceta = await regenerar(recetaId, { userPrompt });
    if (nuevaReceta) {
      setReceta(nuevaReceta);
      setIsFavorite(nuevaReceta.recipe.favorite);
    }
    setUserPrompt(''); // Limpiar el prompt después de usarlo
  };

  const openRegenerateModal = () => {
    setModalVisible(true);
  };

  if (cargando || cargandoRegenerar) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.text, { marginTop: spacing.md }]}>
          {cargandoRegenerar ? 'Regenerando receta...' : 'Cargando receta...'}
        </Text>
      </View>
    );
  }

  if (error || errorRegenerar) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.text, { color: colors.red }]}>
          Error: {error?.message || errorRegenerar?.message}
        </Text>
      </View>
    );
  }

  if (!receta) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.text}>No se encontró la receta.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView
        style={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={colors.black} />
            </TouchableOpacity>
            <View style={styles.rightHeaderActions}>
              <TouchableOpacity
                style={styles.regenerateButton}
                onPress={openRegenerateModal}
                disabled={cargandoRegenerar}
              >
                <RefreshCw
                  size={24}
                  color={cargandoRegenerar ? colors.gray : colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.favoriteButton,
                  isFavorite && styles.favoriteButtonActive,
                ]}
                onPress={toggleFavorite}
              >
                <Heart
                  size={24}
                  color={isFavorite ? colors.white : colors.red}
                  fill={isFavorite ? colors.red : 'none'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
            setUserPrompt(''); // Limpiar el prompt si se cierra el modal
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Describe cómo te gustaría regenerar la receta:
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={setUserPrompt}
                value={userPrompt}
                placeholder="Ej: más picante, menos ingredientes..."
                multiline
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    setUserPrompt(''); // Limpiar el prompt
                  }}
                >
                  <Text style={styles.textStyleCancel}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonSubmit]}
                  onPress={handleRegenerar}
                  disabled={cargandoRegenerar || !userPrompt.trim()}
                >
                  <Text style={styles.textStyle}>Regenerar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.content}>
          <View style={styles.cabeceraReceta}>
            <Text style={styles.tituloReceta}>{receta.recipe.title}</Text>
            <Text style={styles.descripcionReceta}>
              {receta.recipe.description}
            </Text>
          </View>

          <View style={styles.contenedorMeta}>
            <View style={styles.itemMeta}>
              <Clock size={20} color={colors.primary} strokeWidth={2} />
              <Text style={styles.etiquetaMeta}>Tiempo</Text>
              <Text style={styles.valorMeta}>
                {receta.recipe.prep_time} min
              </Text>
            </View>
            <View style={styles.itemMeta}>
              <Users size={20} color={colors.primary} strokeWidth={2} />
              <Text style={styles.etiquetaMeta}>Porciones</Text>
              <Text style={styles.valorMeta}>
                {receta.recipe.number_of_servings}
              </Text>
            </View>
            <View style={styles.itemMeta}>
              <ChefHat size={20} color={colors.primary} strokeWidth={2} />
              <Text style={styles.etiquetaMeta}>Dificultad</Text>
              <Text style={styles.valorMeta}>{receta.recipe.difficulty}</Text>
            </View>
          </View>

          <View style={styles.seccion}>
            <Text style={styles.tituloSeccion}>Información Nutricional</Text>
            <View style={styles.gridNutricion}>
              <View style={styles.itemNutricion}>
                <Flame size={24} color={colors.primary} strokeWidth={2} />
                <Text style={styles.valorNutricion}>
                  {receta.recipe.calories}
                </Text>
                <Text style={styles.etiquetaNutricion}>Calorías</Text>
              </View>
              <View style={styles.itemNutricion}>
                <Dumbbell size={24} color={colors.primary} strokeWidth={2} />
                <Text style={styles.valorNutricion}>
                  {receta.recipe.protein}g
                </Text>
                <Text style={styles.etiquetaNutricion}>Proteínas</Text>
              </View>
              <View style={styles.itemNutricion}>
                <Cookie size={24} color={colors.primary} strokeWidth={2} />
                <Text style={styles.valorNutricion}>
                  {receta.recipe.carbohydrates}g
                </Text>
                <Text style={styles.etiquetaNutricion}>Carbohidratos</Text>
              </View>
              <View style={styles.itemNutricion}>
                <Droplets size={24} color={colors.primary} strokeWidth={2} />
                <Text style={styles.valorNutricion}>
                  {receta.recipe.fat}g
                </Text>
                <Text style={styles.etiquetaNutricion}>Grasas</Text>
              </View>
            </View>
          </View>

          <View style={styles.seccion}>
            <Text style={styles.tituloSeccion}>Ingredientes</Text>
            <View style={styles.listaIngredientes}>
              {receta.ingredients.map((ingrediente, index) => (
                <View key={index} style={styles.itemIngrediente}>
                  <View style={styles.puntoIngrediente} />
                  <Text style={styles.textoIngrediente}>
                    {ingrediente.quantity} {ingrediente.unit} de{' '}
                    {ingrediente.name}
                    {ingrediente.note ? ` (${ingrediente.note})` : ''}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.seccion, styles.seccionUltima]}>
            <Text style={styles.tituloSeccion}>Preparación</Text>
            <View style={styles.contenedorPreparacion}>
              {receta.recipe.instructions.split('\n').map((paso, index) => (
                <View key={index} style={styles.pasoPreparacion}>
                  <View style={styles.numeroPaso}>
                    <Text style={styles.textoNumeroPaso}>{index + 1}</Text>
                  </View>
                  <Text style={styles.textoPaso}>{paso}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollViewContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: typography.body1,
    color: colors.black,
  },
  header: {
    padding: spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.lighterGray,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  regenerateButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.lighterGray,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.lightRed,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: colors.red,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  cabeceraReceta: {
    paddingBottom: spacing.lg,
  },
  tituloReceta: {
    fontSize: typography.h1,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.sm,
  },
  descripcionReceta: {
    fontSize: typography.body1,
    color: colors.gray,
    lineHeight: typography.body1 * 1.4,
  },
  contenedorMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    marginBottom: spacing.xl,
    ...shadow.sm,
    borderWidth: 0.5,
    borderColor: 'rgba(200, 200, 200, 0.5)',
  },
  itemMeta: {
    alignItems: 'center',
    flex: 1,
  },
  etiquetaMeta: {
    fontSize: typography.caption,
    color: colors.gray,
    marginTop: spacing.xs,
  },
  valorMeta: {
    fontSize: typography.body1,
    fontWeight: '600',
    color: colors.black,
    marginTop: spacing.xs,
  },
  seccion: {
    marginBottom: spacing.xl,
  },
  seccionUltima: {
    paddingBottom: spacing.xxl,
  },
  tituloSeccion: {
    fontSize: typography.h2,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.md,
  },
  gridNutricion: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  itemNutricion: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadow.sm,
    borderWidth: 0.5,
    borderColor: 'rgba(200, 200, 200, 0.5)',
  },
  valorNutricion: {
    fontSize: typography.h2,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: spacing.xs,
  },
  etiquetaNutricion: {
    fontSize: typography.body2,
    color: colors.gray,
  },
  listaIngredientes: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    ...shadow.sm,
    borderWidth: 0.5,
    borderColor: 'rgba(200, 200, 200, 0.5)',
  },
  itemIngrediente: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  puntoIngrediente: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: spacing.md,
  },
  textoIngrediente: {
    flex: 1,
    fontSize: typography.body1,
    color: colors.black,
  },
  contenedorPreparacion: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    ...shadow.sm,
    borderWidth: 0.5,
    borderColor: 'rgba(200, 200, 200, 0.5)',
  },
  pasoPreparacion: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    alignItems: 'flex-start',
  },
  numeroPaso: {
    width: 28,
    height: 28,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    marginTop: spacing.xs,
  },
  textoNumeroPaso: {
    color: colors.white,
    fontSize: typography.body2,
    fontWeight: '600',
  },
  textoPaso: {
    flex: 1,
    fontSize: typography.body1,
    color: colors.black,
    lineHeight: typography.body1 * 1.4,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadow.md,
    width: '90%',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  modalText: {
    fontSize: typography.body1,
    marginBottom: spacing.md,
    textAlign: 'center',
    color: colors.black,
  },
  input: {
    fontSize: typography.body1,
    height: 100,
    borderColor: colors.lightGray,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    textAlignVertical: 'top',
    width: '100%',
    backgroundColor: colors.lighterGray,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    elevation: 2,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: 'transparent',
    borderColor: colors.gray,
    borderWidth: 1,
    elevation: 0,
    marginRight: spacing.sm,
  },
  buttonSubmit: {
    backgroundColor: colors.primary,
  },
  textStyle: {
    fontSize: typography.body1,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  textStyleCancel: {
    fontSize: typography.body1,
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
  },
});
