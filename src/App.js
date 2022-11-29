import './App.scss';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Navigate, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
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

function App() {
    return (
        <div style={{ color: ThemeColors.textColor }}>
            <Router>
                <NavBar />
                <Switch>
                    <Route path="/" exact component={HomePage} />
                    <Route path="/about-us" exact component={AboutUs} />
                    <Route path="/services" exact component={Services} />
                    <Route path="/services/details" exact component={ServiceDetails} />
                    <Route path="/products-and-equipments" exact component={ProductsAndEquipment} />
                    <Route path="/contact-us" exact component={ContactUs} />
                    <Route component={NotFound} />
                </Switch>
                <Footer />
            </Router>
        </div>
    );
}

export default App;
