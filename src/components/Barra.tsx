import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PlusCircle, ChevronLeft } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

type RootStackParamList = {
  Home: undefined;
  NuevoAnalisis: undefined;
  DetallesAnalisis: { id: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const Barra = () => {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();
  const route = useRoute();

  const getTitle = () => {
    switch (route.name) {
      case 'Home':
        return 'Inicio';
      case 'NuevoAnalisis':
        return 'Nuevo Análisis';
      case 'DetallesAnalisis':
        return 'Detalles del Análisis';
      default:
        return 'App';
    }
  };

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
      {route.name !== 'Home' && (
        <Appbar.Action 
          icon={() => <ChevronLeft color="white" size={24} />}
          onPress={() => navigation.goBack()}
        />
 
      )}
      <Appbar.Content   color='white' title={getTitle()} />
      {route.name === 'Home' && (
        <Appbar.Action 
          icon={() => <PlusCircle color="white" size={24} />}
          onPress={() => navigation.navigate('NuevoAnalisis')} 
        />
      )}
    </Appbar.Header>
  );
};


 