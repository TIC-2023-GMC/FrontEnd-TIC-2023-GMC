// import { render, within } from '@testing-library/react-native';
// import React from 'react';
// import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';
// import 'reflect-metadata';
// import { container } from 'tsyringe';
// import { ListOrganizationUseCase } from '../application/hooks';
// import { OrganizationScreen } from '../infrastructure/react-native/Screens/Organization/OrganizationScreen';
// import { AxiosOrganizationRepository } from '../infrastructure/repositories';
// /**
//  * @jest-environment node
//  */
// jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

// jest.mock('@react-navigation/bottom-tabs', () => ({
// 	useBottomTabBarHeight: jest.fn(() => 50) // Reemplaza con el valor que necesites
// }));

// describe('OrganizationScreen component', () => {
// 	it('should render OrganizationCard components', async () => {
// 		container.register('OrganizationRepository', { useClass: AxiosOrganizationRepository });

// 		// Mock de useQueryOrganization
// 		const mockUseQueryOrganization = jest.fn(() => ({
// 			data: {
// 				pages: [
// 					[
// 						[
// 							{
// 								_id: '1',
// 								name: 'Organization 1',
// 								description: 'Descripción de la organización 1',
// 								photo: {
// 									img_path: 'https://www.example.com/photo1.jpg'
// 								},
// 								external_links: {
// 									facebook: 'https://www.facebook.com/org1',
// 									instagram: 'https://www.instagram.com/org1',
// 									twitter: 'https://twitter.com/org1',
// 									website: 'https://www.org1.com'
// 								}
// 							},
// 							{
// 								_id: '2',
// 								name: 'Organization 2',
// 								description: 'Descripción de la organización 2',
// 								photo: {
// 									img_path: 'https://www.example.com/photo2.jpg'
// 								},
// 								external_links: {
// 									facebook: 'https://www.facebook.com/org2',
// 									instagram: 'https://www.instagram.com/org2',
// 									twitter: 'https://twitter.com/org2',
// 									website: 'https://www.org2.com'
// 								}
// 							}
// 						],
// 						1
// 					]
// 				]
// 			},
// 			hasNextPage: true,
// 			fetchNextPage: jest.fn(),
// 			refetch: jest.fn(),
// 			isFetchingNextPage: false,
// 			isLoading: false,
// 			isFetching: false,
// 			error: null,
// 			isError: false,
// 			isSuccess: true
// 		}));

// 		ListOrganizationUseCase.prototype.useQueryOrganization = mockUseQueryOrganization as never;

// 		// Renderiza el componente
// 		const screen = await render(<OrganizationScreen />);
// 		console.log(screen.debug());

// 		const { getByTestId } = screen;
// 		await screen.findByTestId('organization-list');

// 		// Verifica que las tarjetas de organización se rendericen
// 		const organizationFlat = getByTestId('organization-list');
// 		const organizationCard1 = within(organizationFlat).queryByText('Organization 1');
// 		const organizationCard2 = within(organizationFlat).queryByText('Organization 2');

// 		expect(organizationCard1).toBeDefined();
// 		expect(organizationCard2).toBeDefined();

// 		// Verifica que useQueryOrganization se haya llamado
// 		expect(mockUseQueryOrganization).toHaveBeenCalled();
// 	});
// });
