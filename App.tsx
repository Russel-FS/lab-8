import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import DetallesAnalisis from './src/DetallesAnalisis';
import { Home } from './src/Home'; 
import NuevoAnalisis from './src/NuevoAnalisis';
import { Barra } from './src/components/Barra';

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
            header: (props) => <Barra   />,
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={Home} 
          />
          <Stack.Screen 
            name="NuevoAnalisis" 
            component={NuevoAnalisis}
          />
          <Stack.Screen 
            name="DetallesAnalisis" 
            component={DetallesAnalisis}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;