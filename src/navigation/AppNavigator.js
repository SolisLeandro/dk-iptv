import { DefaultTheme, DarkTheme, NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Platform } from 'react-native'

import { useTheme } from '../hooks/useTheme'

// Screens
import HomeScreen from '../screens/main/HomeScreen'
import ExploreScreen from '../screens/main/ExploreScreen'
import FavoritesScreen from '../screens/main/FavoritesScreen'
import SearchScreen from '../screens/main/SearchScreen'
import PlayerScreen from '../screens/player/PlayerScreen'
import EPGScreen from '../screens/epg/EPGScreen'
import SettingsScreen from '../screens/settings/SettingsScreen'
import AboutScreen from '../screens/settings/AboutScreen'
import OnboardingScreen from '../screens/auth/OnboardingScreen'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

// Tab Navigator con Safe Area corregido
function TabNavigator() {
    const { colors } = useTheme()
    const insets = useSafeAreaInsets()

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    paddingBottom: Platform.OS === 'android' ? insets.bottom + 8 : insets.bottom,
                    paddingTop: 8,
                    height: Platform.OS === 'android' 
                        ? 60 + insets.bottom 
                        : 85,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginTop: 4,
                },
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
                        case 'Settings':
                            iconName = focused ? 'settings' : 'settings-outline'
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
                name="Settings"
                component={SettingsScreen}
                options={{ tabBarLabel: 'Configuración' }}
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
                name="About"
                component={AboutScreen}
                options={{ title: 'Acerca de' }}
            />
        </Stack.Navigator>
    )
}

// Root Navigator
export default function AppNavigator() {
    const { colors, isDark } = useTheme()

    const baseTheme = isDark ? DarkTheme : DefaultTheme
    const theme = {
        ...baseTheme,
        colors: {
            ...baseTheme.colors,
            ...colors,
        },
    }

    return (
        <NavigationContainer theme={theme}>
            <MainStackNavigator />
        </NavigationContainer>
    )
}