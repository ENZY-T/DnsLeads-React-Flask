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
import NavigationBar from './components/NavigationBar';
import AdminHome from './admin/AdminHome';
import SubContractors from './admin/SubContractors';
import CreatePermanentJob from './admin/CreatePermanentJob';
import CreateQuickJob from './admin/CreateQuickJob';
import { AppContextProvider } from './Context/AppContext';
import Jobs from './admin/Jobs';
import SecureRoute from './components/SecureRoute';
import SubContractor from './admin/SubContractor';

function App() {
    return (
        <AppContextProvider>
            <div style={{ color: ThemeColors.textColor }}>
                <Router>
                    <NavigationBar />
                    <Switch>
                        {/* Public Pages */}
                        <Route path="/" exact component={HomePage} />
                        <Route path="/about-us" exact component={AboutUs} />
                        <Route path="/services" exact component={Services} />
                        <Route path="/services/details" exact component={ServiceDetails} />
                        <Route path="/products-and-equipments" exact component={ProductsAndEquipment} />
                        <Route path="/contact-us" exact component={ContactUs} />
                        <Route path="/login" exact component={Login} />
                        <Route path="/register" exact component={Register} />

                        {/* User Private Pages */}
                        <SecureRoute path="/dashboard" exact component={DashboardHome} />
                        <SecureRoute path="/my-jobs" exact component={MyJobs} />
                        <SecureRoute path="/my-jobs/:jobID" exact component={MyJob} />
                        <SecureRoute path="/permanent-jobs" exact component={PermanentJobs} />
                        <SecureRoute path="/permanent-jobs/:jobID" exact component={PermanentJob} />
                        <SecureRoute path="/quick-jobs" exact component={QuickJobs} />
                        <SecureRoute path="/quick-jobs/:jobID" exact component={QuickJob} />

                        {/* Admin Private Pages */}
                        <Route path="/admin" exact component={AdminHome} />
                        <Route path="/admin/sub-contractors" exact component={SubContractors} />
                        <Route path="/admin/sub-contractors/:userID" exact component={SubContractor} />
                        <Route path="/admin/create-permanent-job" exact component={CreatePermanentJob} />
                        <Route path="/admin/create-quick-job" exact component={CreateQuickJob} />
                        <Route path="/admin/jobs/:jobID" exact component={Jobs} />
                        <Route component={NotFound} />
                    </Switch>
                    <Footer />
                </Router>
            </div>
        </AppContextProvider>
    );
}

export default App;
