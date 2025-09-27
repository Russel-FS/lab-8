import { StyleSheet, View } from 'react-native';
import { TextInput, Button, Portal, Dialog, Paragraph, ActivityIndicator, RadioButton, Text } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { API_URL } from '~/config/api';

type RootStackParamList = {
  Home: undefined;
  NuevoAnalisis: { id?: string };
  DetallesAnalisis: { id: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const NuevoAnalisis = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'NuevoAnalisis'>>();
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [tipoAnalisis, setTipoAnalisis] = useState('1');
  const [alerta, setAlerta] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEditing = route.params?.id !== undefined;

  useEffect(() => {
    if (route.params?.id) {
      cargarDatosAnalisis();
    }
  }, [route.params?.id]);

  const cargarDatosAnalisis = async () => {
    if (!route.params?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/analisis/${route.params.id}`);
      const analisis = await response.json();
      setNombre(analisis.nombre);
      setEdad(analisis.edad.toString());
      setTipoAnalisis(analisis.tipoAnalisis.toString());
    } catch (error) {
      console.log('Error al cargar el analisis:', error);
      setAlerta(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => { 
    if ([nombre, edad, tipoAnalisis].includes('')) {
      setAlerta(true);
      return;
    }

    const edadNum = parseInt(edad, 10);
    if (isNaN(edadNum) || edadNum <= 0) {
        setAlerta(true);
        return;
    }

    let costoBase = 0;
    switch (tipoAnalisis) {
      case '1':
        costoBase = 25;
        break;
      case '2':
        costoBase = 36;
        break;
      case '3':
        costoBase = 50;
        break;
    }

    let costoAdicional = 0;
    if (edadNum >= 14 && edadNum <= 22) {
      costoAdicional = costoBase * 0.10;
    }

    const costoFinal = costoBase + costoAdicional;

    try {
      const url = isEditing 
        ? `${API_URL}/analisis/${route.params?.id}`
        : `${API_URL}/analisis`;
        
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          edad: edadNum,
          tipoAnalisis: parseInt(tipoAnalisis, 10),
          costoBase,
          costoAdicional,
          costoFinal
        })
      });

      if (response.ok) { 
        setNombre('');
        setEdad('');
        setTipoAnalisis('1');
         
        navigation.navigate('Home');
      }
    } catch (error) {
      console.log('Error al guardar el analisis:', error);
      setAlerta(true);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        label="Nombre del Paciente"
        placeholder="Escribe el nombre"
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        label="Edad"
        placeholder="Escribe la edad"
        keyboardType="numeric"
        style={styles.input}
        value={edad}
        onChangeText={setEdad}
      />

      <View style={styles.input}>
        <Text style={styles.label}>Tipo de Análisis</Text>
        <RadioButton.Group onValueChange={newValue => setTipoAnalisis(newValue)} value={tipoAnalisis}>
          <View style={styles.radioButtonContainer}>
            <RadioButton.Item label="Tipo 1 (S/. 25)" value="1" />
            <RadioButton.Item label="Tipo 2 (S/. 36)" value="2" />
            <RadioButton.Item label="Tipo 3 (S/. 50)" value="3" />
          </View>
        </RadioButton.Group>
      </View>

      <Button 
        mode="contained" 
        onPress={handleSubmit}
        style={styles.button}
      >
        {isEditing ? 'Guardar Cambios' : 'Guardar Análisis'}
      </Button>

      <Portal>
        <Dialog visible={alerta} onDismiss={() => setAlerta(false)}>
          <Dialog.Title>Error</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Todos los campos son obligatorios y la edad debe ser un número válido.</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setAlerta(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  radioButtonContainer: {
    flexDirection: 'column',
  },
  button: {
    marginTop: 20,
    paddingVertical: 6,
    backgroundColor: '#f4511e',
  },
});

export default NuevoAnalisis;
