import './CSS/App.scss';
import './CSS/dashboard.css';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { ThemeColors } from './Styling/Colors';
import AboutUs from './pages/AboutUs';
import Footer from './components/Footer';
import Services from './pages/Services';
import NavBar from './components/NavBar';
import ServiceDetails from './pages/ServiceDetails';
import NotFound from './pages/NotFound';
import ProductsAndEquipment from './pages/ProductsAndEquipment';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardHome from './dashboard/DashboardHome';
import MyJobs from './dashboard/MyJobs';
import MyJob from './dashboard/MyJob';
import PermanentJobs from './dashboard/PermanentJobs';
import PermanentJob from './dashboard/PermanentJob';
import QuickJobs from './dashboard/QuickJobs';
import QuickJob from './dashboard/QuickJob';
import AdminHome from './admin/AdminHome';
import { AppContextProvider } from './Context/AppContext';

function App() {
	return (
		<AppContextProvider>
			<div style={{ color: ThemeColors.textColor }}>
				<Router>
					<NavBar />
					<Switch>
						<Route path='/' exact component={HomePage} />
						<Route path='/about-us' exact component={AboutUs} />
						<Route path='/services' exact component={Services} />
						<Route path='/services/details' exact component={ServiceDetails} />
						<Route path='/products-and-equipments' exact component={ProductsAndEquipment} />
						<Route path='/contact-us' exact component={ContactUs} />
						<Route path='/login' exact component={Login} />
						<Route path='/register' exact component={Register} />
						{/* dashboard */}
						<Route path='/dashboard' exact component={DashboardHome} />
						<Route path='/my-jobs' exact component={MyJobs} />
						<Route path='/my-jobs/:jobID' exact component={MyJob} />
						<Route path='/permanent-jobs' exact component={PermanentJobs} />
						<Route path='/permanent-jobs/:jobID' exact component={PermanentJob} />
						<Route path='/quick-jobs' exact component={QuickJobs} />
						<Route path='/quick-jobs/:jobID' exact component={QuickJob} />
						{/* Admin dashboard */}
						<Route path='/admin' exact component={AdminHome} />
						<Route component={NotFound} />
					</Switch>
					<Footer />
				</Router>
			</div>
		</AppContextProvider>
	);
}

export default App;
