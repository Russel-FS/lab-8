import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, ActivityIndicator, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { API_URL } from '~/config/api';
import { Cliente } from '~/models/Cliente';
import { Mail, Phone } from 'lucide-react-native';
import { NoRegistros } from '~/components/NoRegistros';

type RootStackParamList = {
  Home: undefined;
  NuevoCliente: undefined;
  DetallesCliente: { id: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const Home = () => {
  const navigation = useNavigation<NavigationProp>();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const cargarClientes = async () => {
    try {
      const response = await fetch(`${API_URL}/clientes`);
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.log('Error al cargar los clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('DetallesCliente', { id: item.id.toString() })}
          >
            <Card style={styles.card} mode="outlined">
              <Card.Title
                title={item.nombre}
                subtitle={item.empresa}
                left={(props) => (
                  <Avatar.Text
                    {...props}
                    label={item.nombre.substring(0, 2).toUpperCase()}
                    color="white"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                )}
              />
              <Card.Content style={styles.cardContent}>
                <View style={styles.contactInfo}>
                  <View style={styles.contactItem}>
                    <Phone size={16} color={theme.colors.primary} />
                    <Text variant="bodyMedium" style={styles.contactText}>
                      {item.telefono}
                    </Text>
                  </View>
                  <View style={styles.contactItem}>
                    <Mail size={16} color={theme.colors.primary} />
                    <Text variant="bodyMedium" style={styles.contactText}>
                      {item.correo}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
      />
      {clientes.length === 0 && !loading && <NoRegistros />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  contactInfo: {
    marginTop: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  contactText: {
    marginLeft: 8,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});
