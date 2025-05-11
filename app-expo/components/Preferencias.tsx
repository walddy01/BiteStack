import { Check, Pencil, WandSparkles, X } from 'lucide-react-native';
import { Pressable, Text, TextInput, View } from 'react-native';
import { colors } from '../styles/colors';
import { styles as globalStyles } from '../styles/globalStyles'; // Estilos globales generales
import { styles as componentStyles } from '../styles/components/Preferencias.styles'; // Estilos específicos del componente

interface Props {
	preferencias: {
		dieta: string;
		calorias: number;
		alergias: string;
		porciones: number;
		preferencias_adicionales: string;
	};
	editarPreferencias: boolean;
	setPreferenciasOriginales: (preferencias: Props['preferencias']) => void;
	setEditarPreferencias: (editar: boolean) => void;
	handleChange: (field: string, value: string) => void;
	cancelarPreferencias: () => void;
	guardarPreferencias: () => void;
	comidasActivas: { desayuno: boolean; almuerzo: boolean; cena: boolean };
	setComidasActivas: (
		value: (prevState: {
			desayuno: boolean;
			almuerzo: boolean;
			cena: boolean;
		}) => { desayuno: boolean; almuerzo: boolean; cena: boolean },
	) => void;
	generarMenu: () => void;
}

export default function Preferencias({
	preferencias,
	editarPreferencias,
	setPreferenciasOriginales,
	setEditarPreferencias,
	handleChange,
	cancelarPreferencias,
	guardarPreferencias,
	comidasActivas,
	setComidasActivas,
	generarMenu,
}: Props) {
	const alternarComida = (comida: 'desayuno' | 'almuerzo' | 'cena') => {
		setComidasActivas((prevComidas) => ({
			...prevComidas,
			[comida]: !prevComidas[comida],
		}));
	};

	return (
		<>
			<View style={componentStyles.preferencesCard}>
				<View style={componentStyles.preferencesHeader}>
					<Text style={[globalStyles.text, globalStyles.bold]}>Tus Preferencias</Text>

					{!editarPreferencias ? (
						<Pressable
							style={componentStyles.editButton}
							onPress={() => {
								setPreferenciasOriginales(preferencias);
								setEditarPreferencias(true);
							}}
						>
							<Pencil color={colors.white} size={15} />
							<Text style={[globalStyles.text, globalStyles.light]}>Editar</Text>
						</Pressable>
					) : (
						<View style={{ flexDirection: 'row', gap: 6 }}>
							<Pressable
								style={componentStyles.cancelButton}
								onPress={cancelarPreferencias}
							>
								<X color={colors.red} size={20} />
							</Pressable>
							<Pressable
								style={componentStyles.saveButton}
								onPress={guardarPreferencias}
							>
								<Check color={colors.white} size={20} />
							</Pressable>
						</View>
					)}
				</View>

				{/* PREFERENCIAS DE COMIDAS */}
				{editarPreferencias ? (
					<View style={componentStyles.preferencesDetails}>
						<View style={componentStyles.preferenceItem}>
							<Text style={[globalStyles.text, componentStyles.preferenceLabel, { color: colors.gray }]}>Dieta</Text>
							<TextInput
								style={componentStyles.preferenceInput}
								value={preferencias.dieta}
								onChangeText={(text) => handleChange('dieta', text)}
							/>
						</View>
						<View style={componentStyles.preferenceItem}>
							<Text style={[globalStyles.text, componentStyles.preferenceLabel, { color: colors.gray }]}>
								Calorías
							</Text>
							<TextInput
								style={componentStyles.preferenceInput}
								value={String(preferencias.calorias)}
								keyboardType="numeric"
								onChangeText={(text) => handleChange('calorias', text)}
							/>
						</View>
						<View style={componentStyles.preferenceItem}>
							<Text style={[globalStyles.text, componentStyles.preferenceLabel, { color: colors.gray }]}>
								Alergias
							</Text>
							<TextInput
								style={componentStyles.preferenceInput}
								value={preferencias.alergias}
								onChangeText={(text) => handleChange('alergias', text)}
							/>
						</View>
						<View style={componentStyles.preferenceItem}>
							<Text style={[globalStyles.text, componentStyles.preferenceLabel, { color: colors.gray }]}>
								Porciones
							</Text>
							<TextInput
								style={componentStyles.preferenceInput}
								value={String(preferencias.porciones)}
                keyboardType="numeric"
								onChangeText={(text) => handleChange('porciones', text)}
							/>
						</View>
						<View style={[componentStyles.preferenceItem, componentStyles.textAreaContainer]}>
							<Text style={[globalStyles.text, componentStyles.preferenceLabel, { color: colors.gray }]}>
								Preferencias Adicionales
							</Text>
							<TextInput
								style={componentStyles.textArea}
								multiline={true}
								numberOfLines={4}
								placeholder="Escribe aquí tus preferencias adicionales..."
								value={preferencias.preferencias_adicionales}
								onChangeText={(text) => handleChange('preferencias_adicionales', text)}
							/>
						</View>
					</View>
				) : (
					<View style={componentStyles.preferencesDetails}>
						<View style={componentStyles.preferenceItem}>
							<Text style={[globalStyles.text, componentStyles.preferenceLabel, { color: colors.gray }]}>Dieta</Text>
							<Text style={[globalStyles.text, componentStyles.preferenceValue, { color: colors.black }]}>
								{preferencias.dieta}
							</Text>
						</View>
						<View style={componentStyles.preferenceItem}>
							<Text style={[globalStyles.text, componentStyles.preferenceLabel, { color: colors.gray }]}>
								Calorías
							</Text>
							<Text style={[globalStyles.text, componentStyles.preferenceValue, { color: colors.black }]}>
								{preferencias.calorias}{' '}
								{preferencias.calorias !== 0 ? 'kcal' : ''}
							</Text>
						</View>
						<View style={componentStyles.preferenceItem}>
							<Text style={[globalStyles.text, componentStyles.preferenceLabel, { color: colors.gray }]}>
								Alergias
							</Text>
							<Text style={[globalStyles.text, componentStyles.preferenceValue, { color: colors.black }]}>
								{preferencias.alergias !== '' && preferencias.alergias !== null
									? preferencias.alergias
									: 'Ninguna'}
							</Text>
						</View>
						<View style={componentStyles.preferenceItem}>
							<Text style={[globalStyles.text, componentStyles.preferenceLabel, { color: colors.gray }]}>
								Porciones
							</Text>
							<Text style={[globalStyles.text, componentStyles.preferenceValue, { color: colors.black }]}>
								{preferencias.porciones}
							</Text>
						</View>
					</View>
				)}

				{/* BOTONES DE COMIDAS */}
				<View style={componentStyles.comidasContainer}>
					<Pressable
						style={[
							componentStyles.comidasButton,
							comidasActivas.desayuno && componentStyles.comidasButtonActive,
						]}
						onPress={() => alternarComida('desayuno')}
					>
						<Text
							style={[
								globalStyles.text,
								comidasActivas.desayuno ? globalStyles.light : globalStyles.dark,
							]}
						>
							Desayuno
						</Text>
					</Pressable>

					<Pressable
						style={[
							componentStyles.comidasButton,
							comidasActivas.almuerzo && componentStyles.comidasButtonActive,
						]}
						onPress={() => alternarComida('almuerzo')}
					>
						<Text
							style={[
								globalStyles.text,
								comidasActivas.almuerzo ? globalStyles.light : globalStyles.dark,
							]}
						>
							Almuerzo
						</Text>
					</Pressable>

					<Pressable
						style={[
							componentStyles.comidasButton,
							comidasActivas.cena && componentStyles.comidasButtonActive,
						]}
						onPress={() => alternarComida('cena')}
					>
						<Text
							style={[
								globalStyles.text,
								comidasActivas.cena ? globalStyles.light : globalStyles.dark,
							]}
						>
							Cena
						</Text>
					</Pressable>
				</View>
			</View>

			{/* BOTÓN DE GENERAR MENÚ */}
			{!editarPreferencias && (
				<View style={componentStyles.generarContainer}>
					<Pressable style={componentStyles.generarButton} onPress={generarMenu}>
						<WandSparkles color={colors.white} size={20} />
						<Text style={[globalStyles.text, globalStyles.light, globalStyles.bold]}>
							Generar Nuevo Menú Semanal
						</Text>
					</Pressable>
				</View>
			)}
		</>
	);
}