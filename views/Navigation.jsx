import { createNativeStackNavigator } from "@react-navigation/native-stack"
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";

// Authentication
import Login from "./Authentication/Login";
import ResetPassword from "./Authentication/ResetPassword";

// Dashboard
import Dashboard from "./Dashboard/Dashboard";
import AddUser from "./Users/AddUser";

// Users
import Users from "./Users/Users";

export default Navigation = () => {
    const Stack = createNativeStackNavigator()   

    return (
        <Stack.Navigator>
            <Stack.Group navigationKey="authentication" screenOptions={{headerShown: false, animationTypeForReplace: "pop"}}>
                <Stack.Screen name="Login" component={Login} options={{animation: "fade_from_bottom"}}/>
                <Stack.Screen name="ResetPassword" component={ResetPassword} options={{animation: "fade_from_bottom"}}/>
            </Stack.Group>
            
            <Stack.Group navigationKey="dashboard" screenOptions={{headerShown: false, animationTypeForReplace: "push", animation: "fade_from_bottom"}}>
                <Stack.Screen name="Dashboard" component={Dashboard}/>
            </Stack.Group>

            <Stack.Group navigationKey="UsersAdmon" screenOptions={{headerShown: true, animationTypeForReplace: "push", animation: "fade_from_bottom"}}>
                <Stack.Screen name="Users" component={Users}/>
                <Stack.Screen name="AddUser" component={AddUser} options={{headerShown: false, presentation: "transparentModal"}}/>
            </Stack.Group>
        </Stack.Navigator>
    )
}