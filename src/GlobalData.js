import LocationCityIcon from '@mui/icons-material/LocationCity';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FaxIcon from '@mui/icons-material/Fax';
import { ThemeColors } from './Styling/Colors';

export const GlobalData = {
	media: {
		home: {
			slides: [
				{
					image: require('./img/home-swiper-slide-3.jpg'),
					text1: 'COMPREHENSIVE',
					text2: 'SOLUTIONS ',
					subText:
						'The use of modern tools and machinery is essentially aimed at maintaining cost effective, hazard free, environment friendly services for its clients',
				},
				{
					image: require('./img/home-swiper-slide-1.jpg'),
					text1: 'HIGHEST QUALITY',
					text2: 'STANDARDS',
					subText: 'The personnel we employ are professionally trained to work and meet the highest quality standards',
				},
				{
					image: require('./img/home-swiper-slide-2.jpg'),
					text1: 'MODERN',
					text2: 'TOOLS AND MACHINERY',
					subText:
						'The use of modern tools and machinery is essentially aimed at maintaining cost effective, hazard free, environment friendly services for its clients',
				},
			],
			who_we_are: require('./img/home_who_we_are.jpg'),
		},
		logo: require('./img/logo.png'),
	},

	services: [
		{
			title: 'BUILDING CLEANING',
			icon: <LocationCityIcon style={{ fontSize: 50, color: ThemeColors.red }} />,
			description:
				'Builders cleaning is done at both residential and commercial sites to provide newly built or renovated properties a finished look and a suitability for occupancy',
		},
		{
			title: 'RETAIL CLEANING',
			icon: <StorefrontIcon style={{ fontSize: 50, color: ThemeColors.red }} />,
			description:
				'We carry out retail cleaning to avoid dirty distractions and provide a clean retail environment for customer attraction',
		},
		{
			title: 'OFFICE CLEANING',
			icon: <FaxIcon style={{ fontSize: 50, color: ThemeColors.red }} />,
			description:
				'We understand a clean working environment contributes to a healthy and productive service of the employees and creates a good first impression on people who visit the offices',
		},
	],
};
