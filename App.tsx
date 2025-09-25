import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import DetallesCliente from '~/DetallesCliente';
import { Home } from '~/Home'; 
import NuevoCliente from '~/NuevoCliente';
import { Barra } from '~/components/Barra';

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#f4511e',
    secondary: '#f4511e',
  },
};

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            header: () => <Barra />,
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={Home} 
          />
          <Stack.Screen 
            name="NuevoCliente" 
            component={NuevoCliente}
          />
          <Stack.Screen 
            name="DetallesCliente" 
            component={DetallesCliente}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;