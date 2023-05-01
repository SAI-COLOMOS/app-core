import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ApplicationProvider } from "./ApplicationContext"
import { CacheProvider } from "./Contexts/CacheContext"

// Authentication
import Login from "./Authentication/Login"
import ResetPassword from "./Authentication/ResetPassword"
import FirstAccess from "./Authentication/FirstAccess"
import SetNewPassword from "./Authentication/SetNewPassword"

// Dashboard
import Dashboard from "./Dashboard/Dashboard"

// Events
import Events from "./Events/Events"
import EventDetails from "./Events/EventDetails"
import AddEvent from "./Events/AddEvent"
import EditEvent from "./Events/EditEvent"
import AddAttendee from "./Events/AddAttendee"

// Profile
import Profile from "./Profile/Profile"
import UpdatePassword from "./Profile/UpdatePassword"

// Places and areas
import PlacesAndAreas from "./PlacesAndAreas/PlacesAndAreas"
import PlaceDetails from "./PlacesAndAreas/PlaceDetails"
import EditPlace from "./PlacesAndAreas/EditPlace"
import AddPlace from "./PlacesAndAreas/AddPlace"
import AddArea from "./PlacesAndAreas/AddArea"
import EditArea from "./PlacesAndAreas/EditArea"

// Schools
import Schools from "./Schools/Schools"
import SchoolDetails from "./Schools/SchoolDetails"
import AddSchool from "./Schools/AddSchool"
import EditSchool from "./Schools/EditSchool"

// Users
import Users from "./Users/Users"
import AddUser from "./Users/AddUser"
import UserDetails, { CardProvider } from "./Users/UserDetails"
import EditUser from "./Users/EditUser"

// Attendance
import AttendanceDetails from "./Attendance/AttendanceDetails"
import TakeAttendance from "./Attendance/TakeAttendance"
import ScanAttendance from "./Attendance/ScanAttendance"
import AttendanceProximityClient from "./Attendance/AttendanceProximityClient"
import ShowAttendanceCode from "./Attendance/ShowAttendanceCode"
import EditAttendance from "./Attendance/EditAttendance"

// Cards
import Cards from "./Cards/Cards"
import CardDetails from "./Cards/CardDetails"
import AddCard from "./Cards/AddCard"
import EditCard from "./Cards/EditCard"
import UserProgress from "./Cards/UserProgress"

// Forms
import Forms from "./Forms/Forms"
import FormDetails from "./Forms/FormDetails"
import AddForm from "./Forms/AddForm"
import EditForm from "./Forms/EditForm"

// Survey
import ApplySurvey from "./Surveys/ApplySurvey"
import SurveyResume from "./Surveys/SurveyResume"
import AddSurvey from "./Surveys/AddSurvey"
import SurveyAnswers from "./Surveys/SurveyAnswers"
import ProximityReceptor from "./Attendance/Proximity/ProximityReceptor"

export default Navigation = () => {
  const Stack = createNativeStackNavigator()

  return (
    <ApplicationProvider>
      <CacheProvider>
        <CardProvider>
          <Stack.Navigator initialRouteName="Login">
            {/*Authentication */}
            <Stack.Group
              navigationKey="authentication"
              screenOptions={{ headerShown: false, animation: "fade_from_bottom", animationTypeForReplace: "pop" }}
            >
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ animation: "fade_from_bottom" }}
              />
              <Stack.Screen
                name="ResetPassword"
                component={ResetPassword}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />
              <Stack.Screen
                name="SetNewPassword"
                component={SetNewPassword}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />
              <Stack.Screen
                name="FirstAccess"
                component={FirstAccess}
                options={{ headerShown: false }}
              />
            </Stack.Group>

            {/* Dashboard */}
            <Stack.Group
              navigationKey="dashboard"
              screenOptions={{ headerShown: false, animationTypeForReplace: "push", animation: "fade_from_bottom" }}
            >
              <Stack.Screen
                name="Dashboard"
                component={Dashboard}
              />
            </Stack.Group>

            {/* Schools */}
            <Stack.Group
              navigationKey="schools"
              screenOptions={{ headerShown: true, animation: "fade_from_bottom", animationTypeForReplace: "pop" }}
            >
              <Stack.Screen
                name="Schools"
                component={Schools}
              />
              <Stack.Screen
                name="SchoolDetails"
                component={SchoolDetails}
              />
              <Stack.Screen
                name="AddSchool"
                component={AddSchool}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />
              <Stack.Screen
                name="EditSchool"
                component={EditSchool}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />
            </Stack.Group>

            {/* Events */}
            <Stack.Group
              navigationKey="events"
              screenOptions={{ headerShown: true, animationTypeForReplace: "push", animation: "fade_from_bottom" }}
            >
              <Stack.Screen
                name="Events"
                component={Events}
              />
              <Stack.Screen
                name="EventDetails"
                component={EventDetails}
              />
              <Stack.Screen
                name="AddEvent"
                component={AddEvent}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />
              <Stack.Screen
                name="EditEvent"
                component={EditEvent}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />
              <Stack.Screen
                name="AddAttendee"
                component={AddAttendee}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />
            </Stack.Group>

            {/* Places and areas */}
            <Stack.Group
              navigationKey="placesAndAreas"
              screenOptions={{ headerShown: true, animationTypeForReplace: "push", animation: "fade_from_bottom" }}
            >
              <Stack.Screen
                name="PlacesAndAreas"
                component={PlacesAndAreas}
              />
              <Stack.Screen
                name="PlaceDetails"
                component={PlaceDetails}
              />
              <Stack.Screen
                name="AddPlace"
                component={AddPlace}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />
              <Stack.Screen
                name="EditPlace"
                component={EditPlace}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />
              <Stack.Screen
                name="AddArea"
                component={AddArea}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />
              <Stack.Screen
                name="EditArea"
                component={EditArea}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />
            </Stack.Group>

            {/* Profile */}
            <Stack.Group
              navigationKey="profile"
              screenOptions={{ headerShown: true, animationTypeForReplace: "push", animation: "fade_from_bottom" }}
            >
              <Stack.Screen
                name="Profile"
                component={Profile}
              />
              <Stack.Screen
                name="UpdatePassword"
                component={UpdatePassword}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />
            </Stack.Group>

            {/* Users */}
            <Stack.Group
              navigationKey="users"
              screenOptions={{ headerShown: true, animationTypeForReplace: "push", animation: "fade_from_bottom" }}
            >
              <Stack.Screen
                name="Users"
                component={Users}
              />
              <Stack.Screen
                name="UserDetails"
                component={UserDetails}
              />
              <Stack.Screen
                name="AddUser"
                component={AddUser}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />
              <Stack.Screen
                name="EditUser"
                component={EditUser}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />
            </Stack.Group>

            {/* Cards */}
            <Stack.Group
              navigationKey="cards"
              screenOptions={{ headerShown: true, animationTypeForReplace: "push", animation: "fade_from_bottom" }}
            >
              <Stack.Screen
                name="Cards"
                component={Cards}
              />
              <Stack.Screen
                name="CardDetails"
                component={CardDetails}
              />
              <Stack.Screen
                name="UserProgress"
                component={UserProgress}
              />
              <Stack.Screen
                name="EditCard"
                component={EditCard}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />
              <Stack.Screen
                name="AddCard"
                component={AddCard}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />
            </Stack.Group>

            {/* Attendance */}
            <Stack.Group
              navigationKey="attendance"
              screenOptions={{ headerShown: true, animationTypeForReplace: "push", animation: "fade_from_bottom" }}
            >
              <Stack.Screen
                name="AttendanceDetails"
                component={AttendanceDetails}
              />
              <Stack.Screen
                name="EditAttendance"
                component={EditAttendance}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />
              <Stack.Screen
                name="TakeAttendance"
                component={TakeAttendance}
              />
              <Stack.Screen
                name="ScanAttendance"
                component={ScanAttendance}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />
              <Stack.Screen
                name="AttendanceProximityClient"
                component={AttendanceProximityClient}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />
              <Stack.Screen
                name="ShowAttendanceCode"
                component={ShowAttendanceCode}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />

              <Stack.Screen
                name="ProximityReceptor"
                component={ProximityReceptor}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />
            </Stack.Group>

            {/* Forms */}
            <Stack.Group
              navigationKey="Forms"
              screenOptions={{ headerShown: true, animationTypeForReplace: "push", animation: "fade_from_bottom" }}
            >
              <Stack.Screen
                name="Forms"
                component={Forms}
              />
              <Stack.Screen
                name="FormDetails"
                component={FormDetails}
              />
              <Stack.Screen
                name="AddForm"
                component={AddForm}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />
              <Stack.Screen
                name="EditForm"
                component={EditForm}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />
            </Stack.Group>

            {/* Surveys */}
            <Stack.Group
              navigationKey="Surveys"
              screenOptions={{ headerShown: true, animationTypeForReplace: "push", animation: "fade_from_bottom" }}
            >
              <Stack.Screen
                name="AddSurvey"
                component={AddSurvey}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />

              <Stack.Screen
                name="ApplySurvey"
                component={ApplySurvey}
              />

              <Stack.Screen
                name="SurveyAnswers"
                component={SurveyAnswers}
              />

              <Stack.Screen
                name="SurveyResume"
                component={SurveyResume}
                options={{ headerShown: false, presentation: "containedTransparentModal" }}
              />
            </Stack.Group>
          </Stack.Navigator>
        </CardProvider>
      </CacheProvider>
    </ApplicationProvider>
  )
}
