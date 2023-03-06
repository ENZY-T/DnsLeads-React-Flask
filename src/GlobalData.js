import LocationCityIcon from '@mui/icons-material/LocationCity';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FaxIcon from '@mui/icons-material/Fax';
import WindowIcon from '@mui/icons-material/Window';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NoteAltIcon from '@mui/icons-material/NoteAlt';

import { ThemeColors } from './Styling/Colors';

import sdt1 from './img/sdt1.jpg';
import sdt2 from './img/sdt2.jpg';
import sdt3 from './img/sdt3.jpg';
import sdt4 from './img/sdt4.jpg';
import sdt5 from './img/sdt5.jpg';
import sdt6 from './img/sdt6.jpg';

import cn1 from './img/cn1.jpg';
import cn2 from './img/cn2.png';
import cn3 from './img/cn3.png';
import cn4 from './img/cn4.jpg';
import cn5 from './img/cn5.jpg';
import cn6 from './img/cn6.jpg';
import cn7 from './img/cn7.jpg';
import cn8 from './img/cn8.png';
import cn9 from './img/cn9.png';

import eq1 from './img/equipments/eq1.jpg';
import eq2 from './img/equipments/eq2.jpg';
import eq3 from './img/equipments/eq3.jpg';
import eq4 from './img/equipments/eq4.jpg';
import eq5 from './img/equipments/eq5.jpg';
import eq6 from './img/equipments/eq6.jpg';
import eq7 from './img/equipments/eq7.jpg';
import eq8 from './img/equipments/eq8.jpg';
import eq9 from './img/equipments/eq9.jpg';
import eq10 from './img/equipments/eq10.jpg';
import eq11 from './img/equipments/eq11.jpg';
import eq12 from './img/equipments/eq12.jpg';
import eq13 from './img/equipments/eq13.jpg';

export const GlobalData = {
    CompanyDetails: {
        name: 'DNS Leads Services Pty Ltd',
        ABN: '77608871085',
        Tel: '+61 4 5065 4356',
        fax: '+61 8 7225 9002',
        bankDetails: {
            accountName: 'DNS Leads Services',
            bsb: '065102',
            accountNo: '10383660',
        },
        Address: {
            street: '08 Brett Street',
            place: 'Melrose Park',
            city: ', Adelaide',
            postalCode: '5039',
            country: ', SA',
        },
        web: 'www.dnsleads.com.au',
        email: ['info@dnsleads.com.au', 'dush@dnsleads.com.au'],
        logo: require('./img/logo.png'),
    },
    media: {
        home: {
            slides: [
                {
                    id: 1,
                    image: require('./img/home-swiper-slide-3.jpg'),
                    text1: 'COMPREHENSIVE',
                    text2: 'SOLUTIONS ',
                    subText:
                        'The use of modern tools and machinery is essentially aimed at maintaining cost effective, hazard free, environment friendly services for its clients',
                },
                {
                    id: 2,
                    image: require('./img/home-swiper-slide-1.jpg'),
                    text1: 'HIGHEST QUALITY',
                    text2: 'STANDARDS',
                    subText: 'The personnel we employ are professionally trained to work and meet the highest quality standards',
                },
                {
                    id: 3,
                    image: require('./img/home-swiper-slide-2.jpg'),
                    text1: 'MODERN',
                    text2: 'TOOLS AND MACHINERY',
                    subText:
                        'The use of modern tools and machinery is essentially aimed at maintaining cost effective, hazard free, environment friendly services for its clients',
                },
            ],
            who_we_are: require('./img/home_who_we_are.jpg'),
        },
    },
    baseUrl: process.env.NODE_ENV === 'production' ? 'https://whonear.xyz' : 'http://192.168.2.6:5000',
    // baseUrl: 'http://whonear.xyz',
    // baseUrl: 'https://whonear.xyz',

    services: [
        {
            id: 1,
            title: 'BUILDING CLEANING',
            icon: <LocationCityIcon style={{ fontSize: 50, color: ThemeColors.red }} />,
            description:
                'Builders cleaning is done at both residential and commercial sites to provide newly built or renovated properties a finished look and a suitability for occupancy',
        },
        {
            id: 2,
            title: 'RETAIL CLEANING',
            icon: <StorefrontIcon style={{ fontSize: 50, color: ThemeColors.red }} />,
            description:
                'We carry out retail cleaning to avoid dirty distractions and provide a clean retail environment for customer attraction',
        },
        {
            id: 3,
            title: 'OFFICE CLEANING',
            icon: <FaxIcon style={{ fontSize: 50, color: ThemeColors.red }} />,
            description:
                'We understand a clean working environment contributes to a healthy and productive service of the employees and creates a good first impression on people who visit the offices',
        },
    ],
};

export const pagesData = [
    {
        name: 'HOME',
        link: '/',
    },
    {
        name: 'SERVICES',
        link: '/services',
    },
    {
        name: 'PRODUCTS & EQUIPMENT',
        link: '/products-and-equipments',
    },
    {
        name: 'GALLERY',
        link: '/gallery',
    },
    {
        name: 'ABOUT US',
        link: '/about-us',
    },
    {
        name: 'CONTACT US',
        link: '/contact-us',
    },
];

export const services = [
	{
		title: 'BUILDING CLEANING',
		id: 'building-cleaning',
		icon: <LocationCityIcon style={{ fontSize: 50, color: ThemeColors.red }} />,
		description:
			'Builders cleaning is done at both residential and commercial sites to provide newly built or renovated properties a finished look and a suitability for occupancy',
	},
	{
		title: 'RETAIL CLEANING',
		id: 'retail-cleaning',
		icon: <StorefrontIcon style={{ fontSize: 50, color: ThemeColors.red }} />,
		description:
			'We carry out retail cleaning to avoid dirty distractions and provide a clean retail environment for customer attraction',
	},
	{
		title: 'OFFICE CLEANING',
		id: 'office-cleaning',
		icon: <FaxIcon style={{ fontSize: 50, color: ThemeColors.red }} />,
		description:
			'We understand a clean working environment contributes to a healthy and productive service of the employees and creates a good first impression on people who visit the offices',
	},
	{
		title: 'WINDOW CLEANING',
		id: 'window-cleaning',
		icon: <WindowIcon style={{ fontSize: 50, color: ThemeColors.red }} />,
		description:
			'Since professional window cleaning takes precision and expertise, our window cleaners are all specially trained for their services and equipped with modern tools.',
	},
	{
		title: 'CARPET CLEANING',
		id: 'carpet-cleaning',
		icon: <DashboardIcon style={{ fontSize: 50, color: ThemeColors.red }} />,
		description: 'Our professionally trained team clean carpets for a healthier working or living environment.',
	},
	{
		title: 'EXIT/END OF LEASE/PRE-SALE CLEANING',
		id: 'pre-end-sale-cleaning',
		icon: <NoteAltIcon style={{ fontSize: 50, color: ThemeColors.red }} />,
		description:
			'Our exit clean / End of a lease or pre-sale cleaning service is carried out for both domestic and commercial cleaning services.',
	},
];

export const serviceDetails = [
	{
		id: 'building-cleaning',
		left: {
			type: 'img',
			data: sdt1,
		},
		right: {
			type: 'data',
			data: {
				icon: <LocationCityIcon style={{ fontSize: 100, color: ThemeColors.red }} />,
				topic: 'BUILDERS CLEANING',
				para: 'Builders cleaning is done at both residential and commercial sites to provide newly built or renovated properties a finished look and a suitability for occupancy. It saves builders valuable time and manpower on post-construction cleaning. Our builders clean takes place after construction, and remains an essential step before selling, renting, leasing or moving in. Our team will quickly and thoroughly remove all rubbish, residue, debris and other signs of construction, leaving the property ready for occupancy. Our services for builders clean are perfect for Builders and Construction Companies, Property Developers, Shopfitters, Homes.',
			},
		},
	},
	{
		id: 'retail-cleaning',
		left: {
			type: 'img',
			data: sdt2,
		},
		right: {
			type: 'data',
			data: {
				icon: <StorefrontIcon style={{ fontSize: 100, color: ThemeColors.red }} />,
				topic: 'RETAIL CLEANING',
				para: 'We carry out retail cleaning to avoid dirty distractions and provide a clean retail environment for customer attraction. We utilize a team of professionals with specialized training for maintaining a flawless retail environment. Merchandise of our clients is treated with the greatest care, and store spaces receive the attention they deserve in accordance with customized needs. Our experienced cleaning professionals are capable of working with a consistent service delivery to keep floors, windows and surfaces clean even in high volume customer traffic. We offer services to the retail sectors such as supermarkets, various kinds of stores, sporting venues, salons and spas, cafes, restaurants, and pubs. Said services may include Checkout / service desk cleaning, Restroom cleaning, Providing and restocking washroom supplies, Sanitising, Dusting, Staffroom / kitchen cleaning, Window Cleaning, Waste removal, Carpet care – more than just vacuuming, we also do spot cleaning and full carpet cleaning, Floorcare – strip and sealing/buffing, High-pressure cleaning, and General Maintenance.',
			},
		},
	},
	{
		id: 'office-cleaning',
		left: {
			type: 'img',
			data: sdt3,
		},
		right: {
			type: 'data',
			data: {
				icon: <FaxIcon style={{ fontSize: 100, color: ThemeColors.red }} />,
				topic: 'OFFICE CLEANING',
				para: 'We understand a clean working environment contributes to a healthy and productive service of the employees and creates a good first impression on people who visit the offices. Our thorough office cleaning will assure a clean and immaculate office.  DNS can provide a consistent and high-quality service delivery to offices of varying sizes on basis of once off, daily, weekly, fortnightly or any other routine. It is best suited for Office cleaning, Warehouse, and Industrial cleaning, Hard floor maintenance, Upholstery cleaning, Machine scrubbing of floor surfaces, and High-pressure cleaning.',
			},
		},
	},
	{
		id: 'window-cleaning',
		left: {
			type: 'img',
			data: sdt4,
		},
		right: {
			type: 'data',
			data: {
				icon: <WindowIcon style={{ fontSize: 100, color: ThemeColors.red }} />,
				topic: 'WINDOW CLEANING',
				para: 'Since professional window cleaning takes precision and expertise, our window cleaners are all specially trained for their services and equipped with modern tools. We undertake windows and glass cleaning regardless of the size of the site and provide a quality service for the customers.',
			},
		},
	},
	{
		id: 'carpet-cleaning',
		left: {
			type: 'img',
			data: sdt5,
		},
		right: {
			type: 'data',
			data: {
				icon: <DashboardIcon style={{ fontSize: 100, color: ThemeColors.red }} />,
				topic: 'CARPET CLEANING',
				para: 'Our professionally trained team clean carpets for a healthier working or living environment. It will help to prevent health issues such as allergies, asthmas, and other respiratory problems. Also, it will help our customers in the corporate sector to provide a clean and tidy environment for their clients and employees. Our team will remove all stains and will freshen up carpets without disrupting daily routines. We provide carpet cleaning services for all corporate businesses and domestic sites.',
			},
		},
	},
	{
		id: 'pre-end-sale-cleaning',
		left: {
			type: 'img',
			data: sdt6,
		},
		right: {
			type: 'data',
			data: {
				icon: <NoteAltIcon style={{ fontSize: 100, color: ThemeColors.red }} />,
				topic: 'EXIT/END OF LEASE/PRE-SALE CLEANING',
				para: 'Our exit clean / End of the lease or pre-sale cleaning service is carried out for both domestic and commercial cleaning services and it is specially organized to fulfill the requirements of various kinds of customers such as tenants, landlords and agencies and organizations. Our specialized team will help them safely get deposits back or welcome new tenants or owners to properties.',
			},
		},
	},
];

export const allProducts = [
	{
		name: 'Ph7',
		img: cn1,
		details:
			'pH-7 is a neutral detergent that has a multitude of applications for cleaning hard surfaces. pH-7 has been specially formulated to be environmentally preferable.',
		to: 'https://agar.com.au/product/ph-7/',
	},
	{
		name: 'Spruce',
		img: cn2,
		details:
			'Spruce is an all-purpose cleaner that rapidly penetrates and removes light to medium soil loads from all washable hard surfaces. It is a water-based detergent that has been formulated to produce the lowest possible impacts on both people and the environment, whilst facilitating highly effective and productive cleaning.',
		to: 'https://agar.com.au/product/spruce/',
	},
	{
		name: 'Kuranda',
		img: cn3,
		details:
			'KURANDA is a specially formulated environmentally preferable commercial-grade disinfectant that is boosted with a detergent for a powerful cleaning action. It leaves surfaces clean, disinfected and perfumed with a fresh floral fragrance.',
		to: 'https://agar.com.au/product/kuranda/',
	},
	{
		name: 'Citra-Mist',
		img: cn4,
		details:
			'CITRA-MIST is a spray and wipe cleaner for all hard surfaces. It has been specially formulated to be environmentally preferable.',
		to: 'https://agar.com.au/product/citra-mist/',
	},
	{
		name: 'Fresco',
		img: cn5,
		details:
			'FRESCO is an all in one washroom cleaner for showers, toilets and ceramic tiles. It has been specially formulated to be environmentally preferable.',
		to: 'https://agar.com.au/product/fresco/',
	},
	{
		name: 'Sequal',
		img: cn6,
		details:
			'SEQUAL is a powerful cleaner for toilets and urinals. It is a thickened product that clings to vertical surfaces. SEQUAL has been specially formulated to be environmentally preferable.',
		to: 'https://agar.com.au/product/sequal/',
	},
	{
		name: 'Shower-Star',
		img: cn7,
		details:
			'Shower Star is a concentrated bathroom cleaner with naturally occurring mildew and mould killers in the formula.',
		to: 'https://agar.com.au/product/shower-star/',
	},
	{
		name: 'Bellevue',
		img: cn8,
		details:
			'BELLEVUE is a glass cleaner that rapidly penetrates and removes light to medium soil loads from windows and mirrors. It is a waterbased detergent that has been formulated to produce the lowest possible impacts on both people and the environment, whilst facilitating highly effective and productive cleaning.',
		to: 'https://agar.com.au/product/bellevue/',
	},
	{
		name: 'Enyclean',
		img: cn9,
		details:
			'Enyclean is a heavy duty detergent with environmentally preferable ingredients. It is a fast acting, powerful cleaner for a broad range of cleaning applications.',
		to: 'https://agar.com.au/product/enyclean/',
	},
];

export const allEquipments = [
	{
		name: 'Vaccume Cleaner',
		img: eq1,
	},
	{
		name: 'Vaccume Cleaner',
		img: eq2,
	},
	{
		name: 'Vaccume Cleaner',
		img: eq3,
	},
	{
		name: 'Vaccume Cleaner',
		img: eq4,
	},
	{
		name: 'Vaccume Cleaner',
		img: eq5,
	},
	{
		name: 'Vaccume Cleaner',
		img: eq6,
	},
	{
		name: 'Vaccume Cleaner',
		img: eq7,
	},
	{
		name: 'Vaccume Cleaner',
		img: eq8,
	},
	{
		name: 'Vaccume Cleaner',
		img: eq9,
	},
	{
		name: 'Vaccume Cleaner',
		img: eq10,
	},
	{
		name: 'Vaccume Cleaner',
		img: eq11,
	},
	{
		name: 'Vaccume Cleaner',
		img: eq12,
	},
	{
		name: 'Vaccume Cleaner',
		img: eq13,
	},
];

export const bankList = [
	'AMP Bank',
	'Australian Military Bank',
	'Australian Mutual Bank',
	'Australian Settlements Limited',
	'Australian Unity Bank Ltd',
	'Bank Australia',
	'BankFirst',
	'Bank of Melbourne',
	'Bank of Queensland',
	'BankSA',
	'BankVic',
	'Bankwest',
	'Bendigo & Adelaide Bank',
	'Beyond Bank Australia',
	'Commonwealth Bank',
	'Defence Bank',
	'Gateway Bank',
	'G&C Mutual Bank',
	'Greater Bank',
	'Heritage Bank',
	'Hume Bank',
	'IMB Bank',
	'Macquarie Bank',
	'ME Bank',
	'MyState Bank',
	'National Australia Bank',
	'Newcastle Permanent Building Society',
	'P&N Bank',
	'Police Bank',
	'QBank',
	'Qudos Bank',
	'RACQ Bank',
	'Regional Australia Bank',
	'Rural Bank',
	'St George Bank',
	'Suncorp Bank',
	'Teachers Mutual Bank',
	'Tyro Payments',
	'UBank',
	'Unity Bank',
	'Westpac',
];
