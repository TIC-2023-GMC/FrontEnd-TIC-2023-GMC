import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AdoptionScreen, AdoptionScreenForm } from '../Screens/Adoption';
import { StyleSheet } from 'react-native';
import { MaterialIcons, Feather, Octicons } from '@expo/vector-icons';
import { ExperienceScreen, ExperienceScreenForm } from '../Screens/Experience';
import { OrganizationScreen } from '../Screens/Organization';
import { IconButton, useTheme } from 'react-native-paper';
import AddTabBarButton from '../components/AddTabBarButton';
import { FavoriteScreen } from '../Screens/Favorite';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export function AddNavigationStack() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false
			}}
		>
			<Stack.Screen name="Agregar Adopción" component={AdoptionScreenForm} />
			<Stack.Screen name="Agregar Experiencia" component={ExperienceScreenForm} />
		</Stack.Navigator>
	);
}

const Tab = createBottomTabNavigator();

export function TabsNavigation() {
	const theme = useTheme();
	const [adoptionsVisibleFilter, setAdoptionsVisibleFilter] = useState<boolean>(false);
	const [experiencesVisibleFilter, setExperienceVisibleFilter] = useState<boolean>(false);

	const styles = StyleSheet.create({
		tabBar: {
			position: 'absolute',
			elevation: 0,
			backgroundColor: theme.colors.primary,
			height: 'auto'
		},
		tab: {
			justifyContent: 'center',
			alignItems: 'center',
			paddingVertical: 10
		}
	});
	return (
		<Tab.Navigator
			backBehavior="initialRoute"
			initialRouteName="Adopciones"
			screenOptions={() => ({
				tabBarStyle: styles.tabBar,
				tabBarItemStyle: styles.tab,
				tabBarActiveTintColor: theme.colors.tertiary,
				tabBarInactiveTintColor: theme.colors.secondary,
				tabBarActiveBackgroundColor: 'rgba(0,0,0,0.5)',
				tabBarHideOnKeyboard: true,
				headerLeft: (props) => (
					<IconButton
						icon="controller-classic"
						iconColor={theme.colors.secondary}
						size={40}
						{...props}
						onPress={() => console.log('')}
					/>
				),
				headerStyle: {
					backgroundColor: theme.colors.primary
				},
				headerTitleStyle: {
					color: theme.colors.secondary,
					fontWeight: 'bold',
					fontSize: 24
				},
				headerTitleAlign: 'center'
			})}
		>
			<Tab.Screen
				name="Adopciones"
				options={{
					tabBarIcon: (props) => {
						return <MaterialIcons {...props} name="pets" size={30} />;
					},

					headerRight: (props) => (
						<IconButton
							icon="filter"
							iconColor={theme.colors.secondary}
							size={30}
							{...props}
							onPress={() => {
								setAdoptionsVisibleFilter(true);
							}}
						/>
					)
				}}
			>
				{(props) => (
					<AdoptionScreen
						{...props}
						visibleFilter={adoptionsVisibleFilter}
						setVisibleFilter={setAdoptionsVisibleFilter}
					/>
				)}
			</Tab.Screen>
			<Tab.Screen
				name="Experiencias"
				options={{
					tabBarIcon: (props) => {
						return <Feather {...props} name="message-square" size={30} />;
					},
					headerRight: (props) => (
						<IconButton
							icon="filter"
							iconColor={theme.colors.secondary}
							size={30}
							{...props}
							onPress={() => {
								setExperienceVisibleFilter(true);
							}}
						/>
					)
				}}
			>
				{(props) => (
					<ExperienceScreen
						{...props}
						visibleFilter={experiencesVisibleFilter}
						setVisibleFilter={setExperienceVisibleFilter}
					/>
				)}
			</Tab.Screen>

			<Tab.Screen
				component={AddNavigationStack}
				name="Agregar Publicación"
				options={{
					tabBarButton: (props) => {
						return <AddTabBarButton {...props} />;
					}
				}}
			/>
			<Tab.Screen
				name="Organizaciones"
				component={OrganizationScreen}
				options={{
					tabBarIcon: (props) => {
						return <Octicons {...props} name="organization" size={30} />;
					}
				}}
			/>
			<Tab.Screen
				name="Perfil"
				component={FavoriteScreen}
				options={{
					tabBarIcon: (props) => {
						return <Octicons {...props} name="person-fill" size={30} />;
					}
				}}
			/>
		</Tab.Navigator>
	);
}
