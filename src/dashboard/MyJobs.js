import React, { useEffect } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FlagIcon from '@mui/icons-material/Flag';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { Button } from '@mui/material';
import { Link, useHistory } from 'react-router-dom';
import { authToken, getItemFromLocalStorage, localStoreKeys } from '../allFuncs';
import { useContext } from 'react';
import { AppContext } from '../Context/AppContext';
import { useState } from 'react';
import axios from 'axios';
import { GlobalData } from '../GlobalData';
import { userOnlyWrap } from '../components/wraps';

function JobCard({ job }) {
    const { authState, setCurrentPermanentJobID } = useContext(AppContext);
    const [jobStarted, setJobStarted] = useState();
    const [jobData, setJobData] = useState();
    const authTokenData = getItemFromLocalStorage(localStoreKeys.authKey);

    const jobID = job.job_id;

    async function getMyJobCardData() {
        const result = await axios.post(
            GlobalData.baseUrl + '/api/get-duration-start-time',
            { user_id: authState.loggedUser.id, job_id: jobID },
            {
                headers: {
                    Authorization: `Bearer ${authTokenData}`,
                },
            }
        );
        console.log(result.data);
        if (result.status === 200) {
            setJobData(result.data);
        }
    }

    async function startJob() {
        if (window.confirm('Do you want to start the job?') === true) {
            let latitude = '';
            let longitude = '';
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;
                    axios
                        .post(
                            GlobalData.baseUrl + '/api/start-permanent-job',
                            { user_id: authState.loggedUser.id, job_id: jobID, start_location: `${latitude},${longitude}` },
                            {
                                headers: {
                                    Authorization: `Bearer ${authTokenData}`,
                                },
                            }
                        )
                        .then((result) => {
                            if (result.status === 200) {
                                const data = result.data;
                                alert(data.msg);
                                setCurrentPermanentJobID({ row_id: data.started_row_id, job_id: data.started_job_id });
                            }
                        });
                },
                (error) => {
                    alert(error);
                }
            );
        }
    }
    async function finishJob() {
        if (window.confirm('Do you want to finish the job?') === true) {
            let latitude = '';
            let longitude = '';
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;
                    axios
                        .post(
                            GlobalData.baseUrl + '/api/stop-permanent-job',
                            {
                                user_id: authState.loggedUser.id,
                                row_id: authState.loggedUser.current_permanent_job_row_id,
                                finish_location: `${latitude},${longitude}`,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${authTokenData}`,
                                },
                            }
                        )
                        .then((result) => {
                            if (result.status === 200) {
                                const data = result.data;
                                setCurrentPermanentJobID({ row_id: data.started_row_id, job_id: data.started_job_id });
                            }
                        });
                },
                (error) => {
                    alert(error);
                }
            );
        }
    }

    useEffect(() => {
        getMyJobCardData();
        setJobStarted(
            authState.loggedUser.current_job_id === 'empty' ? false : authState.loggedUser.current_job_id === job.job_id ? true : false
        );
    }, []);

    return (
        <div className="job-card">
            <div className="inner p-4">
                <h3>
                    <Link className="txt-theme" to={`/my-jobs/${job.job_id}`}>
                        {job.job_name}
                    </Link>
                </h3>
                <h5>
                    <LocationOnIcon />{' '}
                    <a href={job.job_location} target="_blank">
                        {job.job_name}
                    </a>
                </h5>
                {/* <h5>
                    <CalendarMonthIcon /> {job.nextWorkDate}
                </h5> */}
                {/* <h5>
                    <ScheduleIcon /> Duration : {job.job_duration}
                </h5> */}
                <h5>
                    <FlagIcon /> Job times :{' '}
                    {jobData
                        ? jobData.map((tm, indx) => (
                              <span key={indx}>
                                  {tm}
                                  <br />
                              </span>
                          ))
                        : ''}
                </h5>
                {authState.loggedUser.current_permanent_job_id === job.job_id ? (
                    <Button variant="contained" className="bg-theme" onClick={finishJob}>
                        Finished
                    </Button>
                ) : (
                    <Button variant="contained" className="m-3" onClick={startJob}>
                        Start
                    </Button>
                )}
            </div>
        </div>
    );
}

export const myJobs = [
    {
        id: '1276-5642-6541',
        topic: 'Garden Island',
        location: {
            link: 'https://goo.gl/maps/szoBR2ko4dQ4YZMR7',
            name: 'Garden Island, Port Adelaide SA 5015',
        },
        nextWorkDate: '2022/11/23',
        duration: '1hr',
        startTime: '16:30',
        started: false,
        map: (
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5616.540924708116!2d138.54294644397626!3d-34.807720884456074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ab0b95ac9f77d45%3A0x6aa3dc11b4da90bd!2sDolphin%20Sanctuary%20Kayak%20Tours!5e0!3m2!1sen!2sau!4v1669951772164!5m2!1sen!2sau"
                width="100%"
                height="450"
                allowFullscreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        ),
        details:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, id. Architecto quo nisi esse eum voluptate eos impedit illum molestiae recusandae voluptas nostrum placeat quidem, sapiente, amet odio iusto et? Ea, voluptas iste quis doloribus repellat amet pariatur, ipsa ipsum, consequatur impedit dignissimos quaerat consequuntur sit repellendus nemo dolores laudantium?',
        daysToWork: [
            {
                time: '07:00-08:00',
                days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
            },
            {
                time: '14:30-15:30',
                days: ['', '', '', '', '', 'Sa', ''],
            },
        ],
    },
    {
        id: '1256-5682-9221',
        topic: 'Caffe Buongiorno',
        location: {
            link: 'https://goo.gl/maps/xxHkRhrvJnr8UF5W6',
            name: "Caffe Buongiorno 93 Main S Rd, O'Halloran Hill SA 5158",
        },
        nextWorkDate: '2022/11/23',
        duration: '1.45hr',
        startTime: '22:30',
        started: true,
        map: (
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9691.632309369346!2d138.557079306047!3d-35.069724110129364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ab0d9d9332e8659%3A0x5a67641d1cf04b97!2sCaffe%20Buongiorno%20O&#39;Halloran%20Hill!5e0!3m2!1sen!2sau!4v1669951881314!5m2!1sen!2sau"
                width="100%"
                height="450"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
        ),
        details:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, id. Architecto quo nisi esse eum voluptate eos impedit illum molestiae recusandae voluptas nostrum placeat quidem, sapiente, amet odio iusto et? Ea, voluptas iste quis doloribus repellat amet pariatur, ipsa ipsum, consequatur impedit dignissimos quaerat consequuntur sit repellendus nemo dolores laudantium?',
        daysToWork: [
            {
                time: '22:30-00:15',
                days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
            },
        ],
    },
];

function MyJobs() {
    const { authState } = useContext(AppContext);
    // console.log(authState);
    return (
        <div className="container py-4">
            <h1 className="p-4">My Jobs</h1>
            <div className="jobs-card-container">
                {authState.loggedUser.permanent_jobs ? (
                    authState.loggedUser.permanent_jobs.length > 0 ? (
                        authState.loggedUser.permanent_jobs.map((job, index) => <JobCard job={job} key={index} />)
                    ) : (
                        <h3 className="px-4">You haven't assign for any job</h3>
                    )
                ) : (
                    <h3 className="px-4">You haven't assign for any job</h3>
                )}
            </div>
        </div>
    );
}

export default userOnlyWrap(MyJobs);
