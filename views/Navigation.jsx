import { createNativeStackNavigator } from "@react-navigation/native-stack"
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";

// Authentication
import Login from "./Authentication/Login";
import ResetPassword from "./Authentication/ResetPassword";

// Dashboard
import Dashboard from "./Dashboard/Dashboard";
import Profile from "./Profile/Profile";
import AddUser from "./Users/AddUser";

// Administration
import PlacesAndAreas from "./Administration/PlacesAndAreas";

// Users
import Users from "./Users/Users";
import PlaceDetails from "./Administration/PlaceDetails";
import AddPlace from "./Administration/AddPlace";
import SetNewPassword from "./Authentication/SetNewPassword";
import FirstAccess from "./Authentication/FirstAccess";

export default Navigation = () => {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Group navigationKey="authentication" screenOptions={{headerShown: false, animation: "fade_from_bottom", animationTypeForReplace: "pop"}}>
                <Stack.Screen name="Login" component={Login} options={{animation: "fade_from_bottom"}}/>
                <Stack.Screen name="ResetPassword" component={ResetPassword} options={{headerShown: false, presentation: "containedTransparentModal"}}/>
                <Stack.Screen name="SetNewPassword" component={SetNewPassword} options={{headerShown: false, presentation: "containedTransparentModal"}}/>
                <Stack.Screen name="FirstAccess" component={FirstAccess} options={{headerShown: false}}/>
            </Stack.Group>
            
            <Stack.Group navigationKey="dashboard" screenOptions={{headerShown: false, animationTypeForReplace: "push", animation: "fade_from_bottom"}}>
                <Stack.Screen name="Dashboard" component={Dashboard}/>
            </Stack.Group>

            <Stack.Group navigationKey="Administration"screenOptions={{headerShown: true, animationTypeForReplace: "push", animation: "fade_from_bottom"}}>
                <Stack.Screen name="PlacesAndAreas" component={PlacesAndAreas}/>
                <Stack.Screen name="PlaceDetails" component={PlaceDetails}/>
                <Stack.Screen name="AddPlace" component={AddPlace} options={{headerShown: false, presentation: "containedTransparentModal"}}/>
            </Stack.Group>

            <Stack.Group navigationKey="UsersAdmon" screenOptions={{headerShown: true, animationTypeForReplace: "push", animation: "fade_from_bottom"}}>
                <Stack.Screen name="Users" component={Users}/>
                <Stack.Screen name="AddUser" component={AddUser} options={{headerShown: false, presentation: "containedTransparentModal"}}/>
            </Stack.Group>

            <Stack.Group navigationKey="Profile" screenOptions={{headerShown: true, animationTypeForReplace: "push", animation: "fade_from_bottom"}}>
                <Stack.Screen name="Profile" component={Profile}/>
            </Stack.Group>
        </Stack.Navigator>
    )
}