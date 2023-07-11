import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AddAdoptionScreen, AdoptionScreen } from '../Screens/Adoption';
import { StyleSheet } from 'react-native';
import { MaterialIcons, Feather, Octicons } from '@expo/vector-icons';
import { ExperienceScreen } from '../Screens/Experience';
import { OrganizationScreen } from '../Screens/Organization';
import { useTheme } from 'react-native-paper';
import AddTabBarButton from '../components/AddTabBarButton';

const Tab = createBottomTabNavigator();

export function TabsNavigation() {
	const theme = useTheme();
	const styles = StyleSheet.create({
		tabBar: {
			position: 'absolute',
			elevation: 0,
			backgroundColor: theme.colors.primary,
			height: 65
		},
		tab: {
			justifyContent: 'center',
			alignItems: 'center',
			paddingVertical: 10
		}
	});
	return (
		<Tab.Navigator
			screenOptions={{
				tabBarStyle: styles.tabBar,
				tabBarItemStyle: styles.tab,
				tabBarActiveTintColor: theme.colors.tertiary,
				tabBarInactiveTintColor: theme.colors.secondary,
				tabBarActiveBackgroundColor: 'rgba(0,0,0,0.5)'
			}}
		>
			<Tab.Screen
				name="Adoption"
				component={AdoptionScreen}
				options={{
					tabBarIcon: (props) => {
						return <MaterialIcons {...props} name="pets" size={30} />;
					}
				}}
			/>
			<Tab.Screen
				name="Experience"
				component={ExperienceScreen}
				options={{
					tabBarIcon: (props) => {
						return <Feather {...props} name="message-square" size={30} />;
					}
				}}
			/>
			<Tab.Screen
				name="AddAdoption"
				component={AddAdoptionScreen}
				options={{
					tabBarButton: (props) => {
						return <AddTabBarButton {...props}></AddTabBarButton>;
					}
				}}
			/>
			<Tab.Screen
				name="Organization"
				component={AdoptionScreen}
				options={{
					tabBarIcon: (props) => {
						return <Octicons {...props} name="organization" size={30} />;
					}
				}}
			/>
			<Tab.Screen
				name="Favoritos"
				component={OrganizationScreen}
				options={{
					tabBarIcon: (props) => {
						return <Octicons {...props} name="bookmark" size={30} />;
					}
				}}
			/>
		</Tab.Navigator>
	);
}
