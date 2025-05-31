import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Ionicons } from '@expo/vector-icons'

import { useTheme } from '../hooks/useTheme'

// Screens
import HomeScreen from '../screens/main/HomeScreen'
import ExploreScreen from '../screens/main/ExploreScreen'
import FavoritesScreen from '../screens/main/FavoritesScreen'
import RecentScreen from '../screens/main/RecentScreen'
import SearchScreen from '../screens/main/SearchScreen'
import PlayerScreen from '../screens/player/PlayerScreen'
import EPGScreen from '../screens/epg/EPGScreen'
import SettingsScreen from '../screens/settings/SettingsScreen'
import AboutScreen from '../screens/settings/AboutScreen'
import OnboardingScreen from '../screens/auth/OnboardingScreen'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
const Drawer = createDrawerNavigator()

// Tab Navigator
function TabNavigator() {
    const { colors } = useTheme()

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    paddingBottom: 5,
                    height: 60,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName

                    switch (route.name) {
                        case 'Home':
                            iconName = focused ? 'home' : 'home-outline'
                            break
                        case 'Explore':
                            iconName = focused ? 'compass' : 'compass-outline'
                            break
                        case 'Favorites':
                            iconName = focused ? 'heart' : 'heart-outline'
                            break
                        case 'Recent':
                            iconName = focused ? 'time' : 'time-outline'
                            break
                    }

                    return <Ionicons name={iconName} size={size} color={color} />
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ tabBarLabel: 'Inicio' }}
            />
            <Tab.Screen
                name="Explore"
                component={ExploreScreen}
                options={{ tabBarLabel: 'Explorar' }}
            />
            <Tab.Screen
                name="Favorites"
                component={FavoritesScreen}
                options={{ tabBarLabel: 'Favoritos' }}
            />
            <Tab.Screen
                name="Recent"
                component={RecentScreen}
                options={{ tabBarLabel: 'Recientes' }}
            />
        </Tab.Navigator>
    )
}

// Main Stack Navigator
function MainStackNavigator() {
    const { colors } = useTheme()

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.surface,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="MainTabs"
                component={TabNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    title: 'Buscar',
                    presentation: 'modal'
                }}
            />
            <Stack.Screen
                name="Player"
                component={PlayerScreen}
                options={{
                    headerShown: false,
                    presentation: 'fullScreenModal'
                }}
            />
            <Stack.Screen
                name="EPG"
                component={EPGScreen}
                options={{ title: 'Guía de Programación' }}
            />
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="About"
                component={AboutScreen}
                options={{ title: 'Acerca de' }}
            />
        </Stack.Navigator>
    )
}

// Root Navigator
export default function AppNavigator() {
    const { colors } = useTheme()

    return (
        <NavigationContainer
            theme={{
                colors: {
                    primary: colors.primary,
                    background: colors.background,
                    card: colors.surface,
                    text: colors.text,
                    border: colors.border,
                    notification: colors.accent,
                },
            }}
        >
            <MainStackNavigator />
        </NavigationContainer>
    )
}