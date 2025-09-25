import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PlusCircle, ChevronLeft } from 'lucide-react-native';

type RootStackParamList = {
  Home: undefined;
  NuevoCliente: undefined;
  DetallesCliente: { id: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const Barra = () => {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();
  const route = useRoute();

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
      {route.name !== 'Home' && (
        <Appbar.Action 
          icon={() => <ChevronLeft color="white" size={24} />}
          onPress={() => navigation.goBack()}
        />
      )}
      <Appbar.Content 
        title={route.name === 'NuevoCliente' ? 'Nuevo Cliente' : 'Lista de Clientes'} 
      />
      {route.name === 'Home' && (
        <Appbar.Action 
          icon={() => <PlusCircle color="white" size={24} />}
          onPress={() => navigation.navigate('NuevoCliente')} 
        />
      )}
    </Appbar.Header>
  );
};