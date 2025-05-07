import { Check, Pencil, WandSparkles, X } from 'lucide-react-native';
import { Pressable, Text, TextInput, View } from 'react-native';
import { colors } from '../styles/colors';
import { styles } from '../styles/styles';

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
			<View style={styles.preferencesCard}>
				<View style={styles.preferencesHeader}>
					<Text style={[styles.text, styles.bold]}>Tus Preferencias</Text>

					{!editarPreferencias ? (
						<Pressable
							style={styles.editButton}
							onPress={() => {
								setPreferenciasOriginales(preferencias);
								setEditarPreferencias(true);
							}}
						>
							<Pencil color={colors.white} size={15} />
							<Text style={[styles.text, styles.light]}>Editar</Text>
						</Pressable>
					) : (
						<View style={{ flexDirection: 'row', gap: 6 }}>
							<Pressable
								style={styles.cancelButton}
								onPress={cancelarPreferencias}
							>
								<X color={colors.red} size={20} />
							</Pressable>
							<Pressable
								style={styles.saveButton}
								onPress={guardarPreferencias}
							>
								<Check color={colors.white} size={20} />
							</Pressable>
						</View>
					)}
				</View>

				{/* PREFERENCIAS DE COMIDAS */}
				{editarPreferencias ? (
					<View style={styles.preferencesDetails}>
						<View style={styles.preferenceItem}>
							<Text style={[styles.preferenceLabel, styles.text]}>Dieta</Text>
							<TextInput
								style={styles.preferenceInput}
								value={preferencias.dieta}
								onChangeText={(text) => handleChange('dieta', text)}
							/>
						</View>
						<View style={styles.preferenceItem}>
							<Text style={[styles.preferenceLabel, styles.text]}>
								Calorías
							</Text>
							<TextInput
								style={styles.preferenceInput}
								value={String(preferencias.calorias)}
								keyboardType="numeric"
								onChangeText={(text) => handleChange('calorias', text)}
							/>
						</View>
						<View style={styles.preferenceItem}>
							<Text style={[styles.preferenceLabel, styles.text]}>
								Alergias
							</Text>
							<TextInput
								style={styles.preferenceInput}
								value={preferencias.alergias}
								onChangeText={(text) => handleChange('alergias', text)}
							/>
						</View>
						<View style={styles.preferenceItem}>
							<Text style={[styles.preferenceLabel, styles.text]}>
								Porciones
							</Text>
							<TextInput
								style={styles.preferenceInput}
								value={String(preferencias.porciones)}
                keyboardType="numeric"
								onChangeText={(text) => handleChange('porciones', text)}
							/>
						</View>
						<View style={[styles.preferenceItem, styles.textAreaContainer]}>
							<Text style={[styles.preferenceLabel, styles.text]}>
								Preferencias Adicionales
							</Text>
							<TextInput
								style={styles.textArea}
								multiline={true}
								numberOfLines={4}
								textAlignVertical="top"
								placeholder="Escribe aquí tus preferencias adicionales..."
								value={preferencias.preferencias_adicionales}
								onChangeText={(text) => handleChange('preferencias_adicionales', text)}
							/>
						</View>
					</View>
				) : (
					<View style={styles.preferencesDetails}>
						<View style={styles.preferenceItem}>
							<Text style={[styles.preferenceLabel, styles.text]}>Dieta</Text>
							<Text style={[styles.preferenceValue, styles.text]}>
								{preferencias.dieta}
							</Text>
						</View>
						<View style={styles.preferenceItem}>
							<Text style={[styles.preferenceLabel, styles.text]}>
								Calorías
							</Text>
							<Text style={[styles.preferenceValue, styles.text]}>
								{preferencias.calorias}{' '}
								{preferencias.calorias !== 0 ? 'kcal' : ''}
							</Text>
						</View>
						<View style={styles.preferenceItem}>
							<Text style={[styles.preferenceLabel, styles.text]}>
								Alergias
							</Text>
							<Text style={[styles.preferenceValue, styles.text]}>
								{preferencias.alergias !== '' && preferencias.alergias !== null
									? preferencias.alergias
									: 'Ninguna'}
							</Text>
						</View>
						<View style={styles.preferenceItem}>
							<Text style={[styles.preferenceLabel, styles.text]}>
								Porciones
							</Text>
							<Text style={[styles.preferenceValue, styles.text]}>
								{preferencias.porciones}
							</Text>
						</View>
					</View>
				)}

				{/* BOTONES DE COMIDAS */}
				<View style={styles.comidasContainer}>
					<Pressable
						style={[
							styles.comidasButton,
							comidasActivas.desayuno && styles.comidasButtonActive,
						]}
						onPress={() => alternarComida('desayuno')}
					>
						<Text
							style={[
								styles.text,
								comidasActivas.desayuno ? styles.light : styles.dark,
							]}
						>
							Desayuno
						</Text>
					</Pressable>

					<Pressable
						style={[
							styles.comidasButton,
							comidasActivas.almuerzo && styles.comidasButtonActive,
						]}
						onPress={() => alternarComida('almuerzo')}
					>
						<Text
							style={[
								styles.text,
								comidasActivas.almuerzo ? styles.light : styles.dark,
							]}
						>
							Almuerzo
						</Text>
					</Pressable>

					<Pressable
						style={[
							styles.comidasButton,
							comidasActivas.cena && styles.comidasButtonActive,
						]}
						onPress={() => alternarComida('cena')}
					>
						<Text
							style={[
								styles.text,
								comidasActivas.cena ? styles.light : styles.dark,
							]}
						>
							Cena
						</Text>
					</Pressable>
				</View>
			</View>

			{/* BOTÓN DE GENERAR MENÚ */}
			{!editarPreferencias && (
				<View style={styles.generarContainer}>
					<Pressable style={styles.generarButton} onPress={generarMenu}>
						<WandSparkles color={colors.white} size={20} />
						<Text style={[styles.text, styles.light, styles.bold]}>
							Generar Nuevo Menú Semanal
						</Text>
					</Pressable>
				</View>
			)}
		</>
	);
}