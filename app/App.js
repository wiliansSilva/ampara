import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// importe suas telas
import LoginScreen from './auth/Login';
import Onboarding from '../src/screens/Onboarding';
import SupportedPerson from '../src/screens/supportedPerson/SupportedPerson'
import SuccesPerson from '../src/screens/supportedPerson/Conclusion'
import MyWishes from '../src/screens/supportedPerson/MyWishes'

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Onboarding" component={Onboarding} />
                <Stack.Screen name="SupportedPersons" component={SupportedPerson} />
                <Stack.Screen name="SuccesPersons" component={SuccesPerson} />
                <Stack.Screen name="Wishe" component={MyWishes} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
