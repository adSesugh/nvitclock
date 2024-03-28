import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreenV1 from '@/screens/sign-in/LoginScreenV1'
import HomeScreen from '@/screens/student/HomeScreen'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import VerificationScreen from '@/screens/sign-in/VerificationScreen'
import StaffHome from '@/screens/staff/StaffHome'
import ScannerScreen from '@/screens/staff/ScannerScreen'
import { backgroundColor } from '@/constants/Colors'


const Stack = createNativeStackNavigator()

const MainNavigation = () => {
    const auth = useSelector((state: RootState) => state.auth)
    
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName={auth.role === 'user' ? 'staff' : 'home'}
        >
            <Stack.Screen 
                name='home' 
                component={HomeScreen} 
                options={{
                    headerShown: false
                }} 
            />
            <Stack.Screen 
                name='staff' 
                component={StaffHome}
                options={{
                    headerTitle: 'Dashboard',
                    headerTitleAlign: 'center',
                    contentStyle: {
                        backgroundColor: `${backgroundColor}`
                    }
                }}
            />
            <Stack.Screen 
                name='scanner' 
                component={ScannerScreen}
                options={{
                    headerTitle: 'Scanner',
                    headerTitleAlign: 'center'
                }} 
            />
        </Stack.Navigator>
    )
}

const AuthNavigation = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName={'login'}
        >
            <Stack.Screen name='loginV1' component={LoginScreenV1} />
            <Stack.Screen name='verifier' component={VerificationScreen} />
        </Stack.Navigator>
    )
}

const Navigation = () => {
    const auth = useSelector((state: RootState) => state.auth)
    
    return auth.isLoggedIn && auth.token ? <MainNavigation /> : <AuthNavigation />
}

export default Navigation