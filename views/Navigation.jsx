import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'

// Authentication
import Login from './Authentication/Login'
import ResetPassword from './Authentication/ResetPassword'
import FirstAccess from './Authentication/FirstAccess'
import SetNewPassword from './Authentication/SetNewPassword'

// Dashboard
import Dashboard from './Dashboard/Dashboard'

// Profile
import Profile from './Profile/Profile'
import UpdatePassword from './Profile/UpdatePassword'

// Places and areas
import PlacesAndAreas from './PlacesAndAreas/PlacesAndAreas'
import PlaceDetails from './PlacesAndAreas/PlaceDetails'
import EditPlace from './PlacesAndAreas/EditPlace'
import AddPlace from './PlacesAndAreas/AddPlace'
import AddArea from './PlacesAndAreas/AddArea'
import EditArea from './PlacesAndAreas/EditArea'

// Schools
import Schools from './Schools/Schools'
import SchoolDetails from './Schools/SchoolDetails'
import AddSchool from './Schools/AddSchool'
import EditSchool from './Schools/EditSchool'

// Users
import Users from './Users/Users'
import AddUser from './Users/AddUser'
import UserDetails from './Users/UserDetails'
import EditUser from './Users/EditUser'

// Attendance
import AttendanceDetails from './Attendance/AttendanceDetails'
import AttendanceRegister from './Attendance/AttendanceRegister'
import AttendanceScan from './Attendance/AttendanceScan'
import AttendanceProximityClient from './Attendance/AttendanceProximityClient'

// Cards
import Cards from "./Cards/Cards"
import CardDetails from "./Cards/CardDetails";
import AddCard from "./Cards/AddCard";
import EditCard from "./Cards/EditCard";

export default Navigation = () => {
  const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Group navigationKey="authentication" screenOptions={{ headerShown: false, animation: 'fade_from_bottom', animationTypeForReplace: 'pop' }}>
        <Stack.Screen name="Login" component={Login} options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false, presentation: 'containedTransparentModal' }} />
        <Stack.Screen name="SetNewPassword" component={SetNewPassword} options={{ headerShown: false, presentation: 'containedTransparentModal' }} />
        <Stack.Screen name="FirstAccess" component={FirstAccess} options={{ headerShown: false }} />
      </Stack.Group>

      <Stack.Group navigationKey="dashboard" screenOptions={{ headerShown: false, animationTypeForReplace: 'push', animation: 'fade_from_bottom' }}>
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Group>

      <Stack.Group navigationKey="schools" screenOptions={{ headerShown: true, animation: 'fade_from_bottom', animationTypeForReplace: 'pop' }}>
        <Stack.Screen name="Schools" component={Schools} />
        <Stack.Screen name="SchoolDetails" component={SchoolDetails} />
        <Stack.Screen name="AddSchool" component={AddSchool} options={{ headerShown: false, presentation: 'containedTransparentModal' }} />
        <Stack.Screen name="EditSchool" component={EditSchool} options={{ headerShown: false, presentation: 'containedTransparentModal' }} />
      </Stack.Group>

      <Stack.Group navigationKey="placesAndAreas" screenOptions={{ headerShown: true, animationTypeForReplace: 'push', animation: 'fade_from_bottom' }}>
        <Stack.Screen name="PlacesAndAreas" component={PlacesAndAreas} />
        <Stack.Screen name="PlaceDetails" component={PlaceDetails} />
        <Stack.Screen name="AddPlace" component={AddPlace} options={{ headerShown: false, presentation: 'containedTransparentModal' }} />
        <Stack.Screen name="EditPlace" component={EditPlace} options={{ headerShown: false, presentation: 'containedTransparentModal' }} />
        <Stack.Screen name="AddArea" component={AddArea} options={{ headerShown: false, presentation: 'containedTransparentModal' }} />
        <Stack.Screen name="EditArea" component={EditArea} options={{ headerShown: false, presentation: 'containedTransparentModal' }} />
      </Stack.Group>

      <Stack.Group navigationKey="users" screenOptions={{ headerShown: true, animationTypeForReplace: 'push', animation: 'fade_from_bottom' }}>
        <Stack.Screen name="Users" component={Users} />
        <Stack.Screen name="UserDetails" component={UserDetails} />
        <Stack.Screen name="AddUser" component={AddUser} options={{ headerShown: false, presentation: 'containedTransparentModal' }} />
        <Stack.Screen name="EditUser" component={EditUser} options={{ headerShown: false, presentation: 'containedTransparentModal' }} />
      </Stack.Group>

      <Stack.Group navigationKey="profile" screenOptions={{ headerShown: true, animationTypeForReplace: 'push', animation: 'fade_from_bottom' }}>
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="UpdatePassword" component={UpdatePassword} options={{ headerShown: false, presentation: 'containedTransparentModal' }} />
      </Stack.Group>

      <Stack.Group navigationKey="attendance" screenOptions={{ headerShown: true, animationTypeForReplace: 'push', animation: 'fade_from_bottom' }}>
        <Stack.Screen name="AttendanceDetails" component={AttendanceDetails} />
        <Stack.Screen name="AttendanceRegister" component={AttendanceRegister} />
        <Stack.Screen name="AttendanceScan" component={AttendanceScan} options={{ headerShown: false, presentation: 'containedTransparentModal' }} />
        <Stack.Screen name="AttendanceProximityClient" component={AttendanceProximityClient} options={{ headerShown: false, presentation: 'containedTransparentModal' }} />

        {/* <Stack.Screen name="UpdatePassword" component={UpdatePassword} options={{ headerShown: false, presentation: 'containedTransparentModal' }} /> */}
      </Stack.Group>
    </Stack.Navigator>
  )
}
