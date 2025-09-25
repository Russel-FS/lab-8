import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, Avatar, Button, useTheme, ActivityIndicator, Portal, Dialog } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
import { Mail, Phone, Building2, UserCircle2 } from 'lucide-react-native';
import { Cliente } from '~/models/Cliente';
import { API_URL } from '~/config/api';

type RootStackParamList = {
  Home: undefined;
  NuevoCliente: { id?: string };
  DetallesCliente: { id: string };
};

type DetallesClienteRouteProp = RouteProp<RootStackParamList, 'DetallesCliente'>;

const DetallesCliente = () => {
  const theme = useTheme();
  const route = useRoute<DetallesClienteRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const cargarCliente = async () => {
    try {
      const response = await fetch(`${API_URL}/clientes/${route.params.id}`);
      const data = await response.json();
      setCliente(data);
    } catch (error) {
      console.log('Error al cargar el cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCliente();
  }, [route.params.id]);

  const handleEliminar = async () => {
    try {
      await fetch(`${API_URL}/clientes/${route.params.id}`, {
        method: 'DELETE'
      });
      navigation.navigate('Home');
    } catch (error) {
      console.log('Error al eliminar:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!cliente) {
    return (
      <View style={styles.errorContainer}>
        <Text>No se encontró el cliente</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.avatarContainer}>
          <Avatar.Text
            size={80}
            label={cliente.nombre.substring(0, 2).toUpperCase()}
            style={styles.avatar}
          />
        </View>

        <Card.Content>
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <UserCircle2 color={theme.colors.primary} size={24} />
              <View style={styles.infoText}>
                <Text style={styles.label}>Nombre</Text>
                <Text style={styles.value}>{cliente.nombre}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Building2 color={theme.colors.primary} size={24} />
              <View style={styles.infoText}>
                <Text style={styles.label}>Empresa</Text>
                <Text style={styles.value}>{cliente.empresa}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Phone color={theme.colors.primary} size={24} />
              <View style={styles.infoText}>
                <Text style={styles.label}>Teléfono</Text>
                <Text style={styles.value}>{cliente.telefono}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Mail color={theme.colors.primary} size={24} />
              <View style={styles.infoText}>
                <Text style={styles.label}>Correo</Text>
                <Text style={styles.value}>{cliente.correo}</Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('NuevoCliente', { id: route.params.id })}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
        >
          Editar
        </Button>
        <Button 
          mode="contained" 
          onPress={() => setShowDeleteDialog(true)}
          style={[styles.button, styles.deleteButton]}
        >
          Eliminar
        </Button>
      </View>

      <Portal>
        <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
          <Dialog.Title>¿Desea eliminar este cliente?</Dialog.Title>
          <Dialog.Content>
            <Text>Esta acción no se puede deshacer. Se eliminará permanentemente el registro del cliente.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>Cancelar</Button>
            <Button onPress={() => {
              setShowDeleteDialog(false);
              handleEliminar();
            }}>Eliminar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  avatar: {
    elevation: 4,
  },
  infoSection: {
    marginTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    marginLeft: 15,
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
});

export default DetallesCliente;