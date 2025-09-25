import { StyleSheet, View } from 'react-native';
import { TextInput, Button, Portal, Dialog, Paragraph, ActivityIndicator } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { API_URL } from '~/config/api';

type RootStackParamList = {
  Home: undefined;
  NuevoCliente: { id?: string };
  DetallesCliente: { id: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const NuevoCliente = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'NuevoCliente'>>();
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [alerta, setAlerta] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEditing = route.params?.id !== undefined;

  useEffect(() => {
    if (route.params?.id) {
      cargarDatosCliente();
    }
  }, [route.params?.id]);

  const cargarDatosCliente = async () => {
    if (!route.params?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/clientes/${route.params.id}`);
      const cliente = await response.json();
      setNombre(cliente.nombre);
      setTelefono(cliente.telefono);
      setCorreo(cliente.correo);
      setEmpresa(cliente.empresa);
    } catch (error) {
      console.log('Error al cargar el cliente:', error);
      setAlerta(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => { 
    if ([nombre, telefono, correo, empresa].includes('')) {
      setAlerta(true);
      return;
    }

    try {
      const url = isEditing 
        ? `${API_URL}/clientes/${route.params?.id}`
        : `${API_URL}/clientes`;
        
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          telefono,
          correo,
          empresa
        })
      });

      if (response.ok) { 
        setNombre('');
        setTelefono('');
        setCorreo('');
        setEmpresa('');
         
        navigation.navigate('Home');
      }
    } catch (error) {
      console.log('Error al guardar el cliente:', error);
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
        label="Nombre"
        placeholder="Escribe tu nombre"
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        label="Teléfono"
        placeholder="Escribe tu teléfono"
        keyboardType="numeric"
        style={styles.input}
        value={telefono}
        onChangeText={setTelefono}
      />
      <TextInput
        label="Correo"
        placeholder="Escribe tu correo"
        keyboardType="email-address"
        style={styles.input}
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
      />
      <TextInput
        label="Empresa"
        placeholder="Nombre de la empresa"
        style={styles.input}
        value={empresa}
        onChangeText={setEmpresa}
      />

      <Button 
        mode="contained" 
        onPress={handleSubmit}
        style={styles.button}
      >
        {isEditing ? 'Guardar Cambios' : 'Guardar Cliente'}
      </Button>

      <Portal>
        <Dialog visible={alerta} onDismiss={() => setAlerta(false)}>
          <Dialog.Title>Error</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Todos los campos son obligatorios</Paragraph>
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
  button: {
    marginTop: 20,
    paddingVertical: 6,
    backgroundColor: '#f4511e',
  },
});

export default NuevoCliente;