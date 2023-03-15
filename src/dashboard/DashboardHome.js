import axios from 'axios';
import '../CSS/dashboard.scss';
import React, { useContext, useEffect, useState } from 'react';
// import Chart from 'react-apexcharts';
import { useHistory } from 'react-router-dom';
import { allMonths, allYears, SelectOptions } from '../admin/Jobs';
import { getItemFromLocalStorage, localStoreKeys } from '../allFuncs';
// import { authToken, reqToBackend } from '../allFuncs';
import { userOnlyWrap } from '../components/wraps';
import { AppContext } from '../Context/AppContext';
import { GlobalData } from '../GlobalData';
// import { AppContext } from '../Context/AppContext';

// const optionsMonth = {
// 	chart: {
// 		background: '#ffffff',
// 		foreColor: '#2767cd',
// 	},
// 	xaxis: {
// 		categories: [
// 			'01',
// 			'02',
// 			'03',
// 			'04',
// 			'05',
// 			'06',
// 			'07',
// 			'08',
// 			'09',
// 			'10',
// 			'11',
// 			'12',
// 			'13',
// 			'14',
// 			'15',
// 			'16',
// 			'17',
// 			'18',
// 			'19',
// 			'20',
// 			'21',
// 			'22',
// 			'23',
// 			'24',
// 			'25',
// 			'26',
// 			'27',
// 			'28',
// 			'29',
// 			'30',
// 		],
// 		labels: {
// 			show: true,
// 			rotate: -90,
// 		},
// 	},
// };
// const seriesMonth = [
// 	{
// 		name: 'Earnings',
// 		data: [
// 			160,
// 			86,
// 			96,
// 			120,
// 			144,
// 			194,
// 			98,
// 			124,
// 			100,
// 			168,
// 			98,
// 			86,
// 			96,
// 			120,
// 			144,
// 			null,
// 			null,
// 			null,
// 			null,
// 			null,
// 			null,
// 			null,
// 			null,
// 			null,
// 			null,
// 			null,
// 			null,
// 			null,
// 			null,
// 			null,
// 		],
// 	},
// ];
// const optionsYear = {
// 	chart: {
// 		background: '#ffffff',
// 		foreColor: '#2767cd',
// 	},
// 	xaxis: {
// 		categories: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
// 		labels: {
// 			show: true,
// 			rotate: -90,
// 		},
// 	},
// };
// const seriesYear = [
// 	{
// 		name: 'Earnings',
// 		data: [3500, 2350, 4000, 3600, 5000, 3560, 4200, 5200, 2800, 3850, null, null],
// 	},
// ];

// function EarningChartCard({ type, topic, options, series }) {
// 	return (
// 		<div className='my-card hm-400 my-3 p-3'>
// 			<h3>{topic} A$</h3>
// 			<div>
// 				<Chart type={type} options={options} series={series} height='400' width='100%' />
// 			</div>
// 		</div>
// 	);
// }

function TimeSheet() {
	const authTokenData = getItemFromLocalStorage(localStoreKeys.authKey);
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth();

	const { authState } = useContext(AppContext);

	const [selectedYear, setSelectedYear] = useState(currentYear);
	const [selectedMonth, setSelectedMonth] = useState((currentMonth + 1).toString().padStart(2, '0'));
	const [jobData, setJobData] = useState([]);

	async function loadTimeCurrentMonthTimeData() {
		const sendData = {
			user_id: authState.loggedUser.id,
			year: currentYear,
			month: (currentMonth + 1).toString().padStart(2, '0'),
		};
		const result = await axios.post(GlobalData.baseUrl + '/api/get-job-data-to-time', sendData, {
			headers: {
				Authorization: `Bearer ${authTokenData}`,
			},
		});
		if (result.status === 200) {
			setJobData(result.data);
		}
	}

	async function loadTimeCurrentMonthTimeDataYear(year) {
		const sendData = {
			user_id: authState.loggedUser.id,
			year: year,
			month: selectedMonth,
		};
		const result = await axios.post(GlobalData.baseUrl + '/api/get-job-data-to-time', sendData, {
			headers: {
				Authorization: `Bearer ${authTokenData}`,
			},
		});
		if (result.status === 200) {
			setJobData(result.data);
		}
	}

	async function loadTimeCurrentMonthTimeDataMonth(month) {
		const sendData = {
			user_id: authState.loggedUser.id,
			year: selectedYear,
			month: month,
		};
		const result = await axios.post(GlobalData.baseUrl + '/api/get-job-data-to-time', sendData, {
			headers: {
				Authorization: `Bearer ${authTokenData}`,
			},
		});
		if (result.status === 200) {
			setJobData(result.data);
		}
	}

	useEffect(() => {
		loadTimeCurrentMonthTimeData();
	}, []);

	return (
		<div className='timesheet-container my-3'>
			<div>
				<SelectOptions
					setSelectedData={setSelectedYear}
					selectedData={selectedYear}
					inputLabel='Year'
					dropList={allYears}
					ifOnChange={loadTimeCurrentMonthTimeDataYear}
				/>
				<SelectOptions
					setSelectedData={setSelectedMonth}
					selectedData={selectedMonth}
					inputLabel='Month'
					dropList={allMonths}
					ifOnChange={loadTimeCurrentMonthTimeDataMonth}
				/>
				{/* <span style={{ width: '10px' }}></span> */}
				{/* <Button>Download </Button> */}
			</div>
			<br />
			<div className='table-responsive'>
				<table className='table table-bordered'>
					<thead>
						<tr>
							<th scope='col'>Date</th>
							<th scope='col'>Place</th>
							<th scope='col'>Hours</th>
							<th scope='col'>Payment</th>
						</tr>
					</thead>
					{jobData ? (
						<tbody>
							{jobData.map((jbData, indx) => (
								<tr key={indx}>
									<td>{jbData.date}</td>
									<td>{jbData.place}</td>
									<td>{jbData.duration} hr</td>
									<td>A$ {jbData.payment}</td>
								</tr>
							))}
						</tbody>
					) : (
						''
					)}
				</table>
			</div>
		</div>
	);
}

function DashboardHome() {
	return (
		<div className='container py-5'>
			<h1>Earnings as Sub-Contractor</h1>
			<div className='card-container'>
				{/* <EarningChartCard type="bar" topic="2022" options={optionsYear} series={seriesYear} />
                <EarningChartCard type="line" topic="September" options={optionsMonth} series={seriesMonth} /> */}
			</div>
			<TimeSheet />
		</div>
	);
}

export default userOnlyWrap(DashboardHome);
