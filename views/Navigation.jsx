import { createNativeStackNavigator } from "@react-navigation/native-stack"
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";

// Authentication
import Login from "./Authentication/Login";
import ResetPassword from "./Authentication/ResetPassword";
import FirstAccess from "./Authentication/FirstAccess";

// Dashboard
import Dashboard from "./Dashboard/Dashboard";
import Profile from "./Profile/Profile";
import AddUser from "./Users/AddUser";

// Places and areas
import PlacesAndAreas from "./Administration/PlacesAndAreas";
import PlaceDetails from "./Administration/PlaceDetails";
import AddPlace from "./Administration/AddPlace";

// Schools
import Schools from "./Schools/Schools";
import SchoolDetails from "./Schools/SchoolDetails";
import AddSchool from "./Schools/AddSchool";
import EditSchool from "./Schools/EditSchool";

// Users
import Users from "./Users/Users";
import SetNewPassword from "./Authentication/SetNewPassword";

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

            <Stack.Group navigationKey="schools" screenOptions={{headerShown: true, animation: "fade_from_bottom", animationTypeForReplace: "pop"}}>
                <Stack.Screen name="Schools" component={Schools}/>
                <Stack.Screen name="SchoolDetails" component={SchoolDetails}/>
                <Stack.Screen name="AddSchool" component={AddSchool} options={{headerShown: false, presentation: "containedTransparentModal"}}/>
                <Stack.Screen name="EditSchool" component={EditSchool} options={{headerShown: false, presentation: "containedTransparentModal"}}/>
            </Stack.Group>

            <Stack.Group navigationKey="placesAndAreas"screenOptions={{headerShown: true, animationTypeForReplace: "push", animation: "fade_from_bottom"}}>
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