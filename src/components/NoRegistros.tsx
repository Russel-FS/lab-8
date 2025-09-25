import { StyleSheet, View } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { UserPlus, Users } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  NuevoCliente: undefined;
  DetallesCliente: { id: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const NoRegistros = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Users 
        size={100} 
        color={theme.colors.primary} 
        style={styles.icon}
      />
      <Text variant="headlineMedium" style={styles.title}>
        Sin Clientes Registrados
      </Text>
      <Text variant="bodyLarge" style={styles.description}>
        ¡Comienza agregando tu primer cliente!
      </Text>
      <Button 
        mode="contained" 
        onPress={() => navigation.navigate('NuevoCliente')}
        style={styles.button}
        
      >
        <UserPlus size={20} color="white" style={{ marginRight: 8 }} />
        Agregar Cliente
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  icon: {
    marginBottom: 20,
    opacity: 0.9,
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  description: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  button: {
    paddingHorizontal: 20,
    borderRadius: 25,
  },
});