import './App.scss';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import { ThemeColors } from './Styling/Colors';

function App() {
	return (
		<div style={{ color: ThemeColors.textColor }}>
			<Navbar />
			<Routes>
				<Route path='/' element={<HomePage />} />

				<Route path='*' element={<Navigate to={'/'} />} />
			</Routes>
		</div>
	);
}

export default App;
