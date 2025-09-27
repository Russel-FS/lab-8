import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, Avatar, Button, useTheme, ActivityIndicator, Portal, Dialog } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
import { Analisis } from '~/models/Analisis';
import { API_URL } from '~/config/api';
import { UserCircle2, Hash, FileText, DollarSign } from 'lucide-react-native';

type RootStackParamList = {
  Home: undefined;
  NuevoAnalisis: { id?: string };
  DetallesAnalisis: { id: string };
};

type DetallesAnalisisRouteProp = RouteProp<RootStackParamList, 'DetallesAnalisis'>;

const DetallesAnalisis = () => {
  const theme = useTheme();
  const route = useRoute<DetallesAnalisisRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [analisis, setAnalisis] = useState<Analisis | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const cargarAnalisis = async () => {
    try {
      const response = await fetch(`${API_URL}/analisis/${route.params.id}`);
      const data = await response.json();
      setAnalisis(data);
    } catch (error) {
      console.log('Error al cargar el analisis:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAnalisis();
  }, [route.params.id]);

  const handleEliminar = async () => {
    try {
      await fetch(`${API_URL}/analisis/${route.params.id}`, {
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

  if (!analisis) {
    return (
      <View style={styles.errorContainer}>
        <Text>No se encontró el análisis</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.avatarContainer}>
          <Avatar.Text
            size={80}
            label={analisis.nombre.substring(0, 2).toUpperCase()}
            style={styles.avatar}
          />
        </View>

        <Card.Content>
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <UserCircle2 color={theme.colors.primary} size={24} />
              <View style={styles.infoText}>
                <Text style={styles.label}>Nombre</Text>
                <Text style={styles.value}>{analisis.nombre}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Hash color={theme.colors.primary} size={24} />
              <View style={styles.infoText}>
                <Text style={styles.label}>Edad</Text>
                <Text style={styles.value}>{analisis.edad}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <FileText color={theme.colors.primary} size={24} />
              <View style={styles.infoText}>
                <Text style={styles.label}>Tipo de Análisis</Text>
                <Text style={styles.value}>Tipo {analisis.tipoAnalisis}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <DollarSign color={theme.colors.primary} size={24} />
              <View style={styles.infoText}>
                <Text style={styles.label}>Costo Base</Text>
                <Text style={styles.value}>S/. {analisis.costoBase.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <DollarSign color={theme.colors.primary} size={24} />
              <View style={styles.infoText}>
                <Text style={styles.label}>Costo Adicional</Text>
                <Text style={styles.value}>S/. {analisis.costoAdicional.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <DollarSign color={theme.colors.primary} size={24} />
              <View style={styles.infoText}>
                <Text style={styles.label}>Costo Final</Text>
                <Text style={styles.value}>S/. {analisis.costoFinal.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('NuevoAnalisis', { id: route.params.id })}
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
          <Dialog.Title>¿Desea eliminar este análisis?</Dialog.Title>
          <Dialog.Content>
            <Text>Esta acción no se puede deshacer. Se eliminará permanentemente el registro del análisis.</Text>
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

export default DetallesAnalisis;
