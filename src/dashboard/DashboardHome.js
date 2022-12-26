import React, { useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useHistory } from 'react-router-dom';
import { authToken, reqToBackend } from '../allFuncs';

const optionsMonth = {
    chart: {
        background: '#ffffff',
        foreColor: '#2767cd',
    },
    xaxis: {
        categories: [
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23',
            '24',
            '25',
            '26',
            '27',
            '28',
            '29',
            '30',
        ],
        labels: {
            show: true,
            rotate: -90,
        },
    },
};
const seriesMonth = [
    {
        name: 'Earnings',
        data: [
            160,
            86,
            96,
            120,
            144,
            194,
            98,
            124,
            100,
            168,
            98,
            86,
            96,
            120,
            144,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
        ],
    },
];
const optionsYear = {
    chart: {
        background: '#ffffff',
        foreColor: '#2767cd',
    },
    xaxis: {
        categories: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        labels: {
            show: true,
            rotate: -90,
        },
    },
};
const seriesYear = [
    {
        name: 'Earnings',
        data: [3500, 2350, 4000, 3600, 5000, 3560, 4200, 5200, 2800, 3850, null, null],
    },
];

function EarningChartCard({ type, topic, options, series }) {
    return (
        <div className="my-card hm-400 my-3 p-3">
            <h3>{topic} A$</h3>
            <div>
                <Chart type={type} options={options} series={series} height="400" width="100%" />
            </div>
        </div>
    );
}

function TimeSheet() {
    return (
        <div className="timesheet-container my-3">
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Place</th>
                            <th scope="col">Hours</th>
                            <th scope="col">Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>2022/11/18</td>
                            <td>Garden Island</td>
                            <td>1hr</td>
                            <td>A$25.00</td>
                        </tr>
                        <tr>
                            <td>2022/11/18</td>
                            <td>Garden Island</td>
                            <td>1hr</td>
                            <td>A$25.00</td>
                        </tr>
                        <tr>
                            <td>2022/11/18</td>
                            <td>Garden Island</td>
                            <td>1hr</td>
                            <td>A$25.00</td>
                        </tr>
                        <tr>
                            <td>2022/11/18</td>
                            <td>Garden Island</td>
                            <td>1hr</td>
                            <td>A$25.00</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function DashboardHome() {
    const history = useHistory();
    useEffect(() => {
        authToken(history);
    }, []);
    return (
        <div className="container py-5">
            <h1>Earnings</h1>
            <div className="card-container">
                {/* <EarningChartCard type="bar" topic="2022" options={optionsYear} series={seriesYear} />
                <EarningChartCard type="line" topic="September" options={optionsMonth} series={seriesMonth} /> */}
            </div>
            <TimeSheet />
        </div>
    );
}

export default DashboardHome;
