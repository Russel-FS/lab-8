import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, ActivityIndicator, useTheme } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { API_URL } from '~/config/api';
import { Analisis } from '~/models/Analisis';
import { NoRegistros } from '~/components/NoRegistros';

type RootStackParamList = {
  Home: undefined;
  NuevoAnalisis: undefined;
  DetallesAnalisis: { id: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const Home = () => {
  const navigation = useNavigation<NavigationProp>();
  const [analisis, setAnalisis] = useState<Analisis[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const cargarAnalisis = async () => {
    try {
      const response = await fetch(`${API_URL}/analisis`);
      const data = await response.json();
      setAnalisis(data);
    } catch (error) {
      console.log('Error al cargar los analisis:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      cargarAnalisis();
    }, [])
  );

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
        data={analisis}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('DetallesAnalisis', { id: item.id.toString() })}
          >
            <Card style={styles.card} mode="outlined">
              <Card.Title
                title={item.nombre}
                subtitle={`Edad: ${item.edad}`}
                left={(props) => (
                  <Avatar.Text
                    {...props}
                    label={item.nombre.substring(0, 2).toUpperCase()}
                    color="white"
                    
                  />
                )}
              />
              <Card.Content style={styles.cardContent}>
                <View style={styles.infoItem}>
                    <Text variant="bodyMedium" style={styles.infoLabel}>Costo Adicional: </Text>
                    <Text variant="bodyMedium" style={styles.infoText}>S/. {item.costoAdicional.toFixed(2)}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text variant="bodyMedium" style={styles.infoLabel}>Costo Final: </Text>
                    <Text variant="bodyMedium" style={styles.infoText}>S/. {item.costoFinal.toFixed(2)}</Text>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
      />
      {analisis.length === 0 && !loading && <NoRegistros />}
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
  infoItem: {
    flexDirection: 'row',
    marginTop: 4,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  infoText: {
    marginLeft: 4,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});