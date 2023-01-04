import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { adminWrap } from './component/adminWrap';
import { useRef } from 'react';
import axios from 'axios';
import { GlobalData } from '../GlobalData';

function SelectDaysHaveToWork({ setAllDaysData, allDaysData }) {
    const [mo, setMo] = useState(false);
    const [tu, setTu] = useState(false);
    const [we, setWe] = useState(false);
    const [th, setTh] = useState(false);
    const [fr, setFr] = useState(false);
    const [sa, setSa] = useState(false);
    const [su, setSu] = useState(false);

    const [s_time, set_s_time] = useState(allDaysData.s_time);
    const [e_time, set_e_time] = useState(allDaysData.e_time);

    return (
        <div>
            <table className="select-days-to-work">
                <thead>
                    <tr>
                        <td style={{ width: '200px' }}>
                            <label htmlFor="time">Time</label>
                        </td>
                        <td>
                            <label htmlFor="monday">Mo</label>
                        </td>
                        <td>
                            <label htmlFor="tuesday">Tu</label>
                        </td>
                        <td>
                            <label htmlFor="wednesday">We</label>
                        </td>
                        <td>
                            <label htmlFor="thursday">Th</label>
                        </td>
                        <td>
                            <label htmlFor="friday">Fr</label>
                        </td>
                        <td>
                            <label htmlFor="saturday">Sa</label>
                        </td>
                        <td>
                            <label htmlFor="sunday">Su</label>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div className="d-flex">
                                <input
                                    type="time"
                                    style={{ margin: '0' }}
                                    name="start_time"
                                    onChange={(e) => set_s_time(e.target.value)}
                                    value={s_time}
                                    required
                                />
                                <div>to</div>
                                <input
                                    type="time"
                                    style={{ margin: '0' }}
                                    name="end_time"
                                    onChange={(e) => set_e_time(e.target.value)}
                                    value={e_time}
                                    required
                                />
                            </div>
                        </td>
                        <td>
                            <input type="checkbox" id="monday" name="monday" />
                        </td>
                        <td>
                            <input type="checkbox" id="tuesday" name="tuesday" />
                        </td>
                        <td>
                            <input type="checkbox" id="wednesday" name="wednesday" />
                        </td>
                        <td>
                            <input type="checkbox" id="thursday" name="thursday" />
                        </td>
                        <td>
                            <input type="checkbox" id="friday" name="friday" />
                        </td>
                        <td>
                            <input type="checkbox" id="saturday" name="saturday" />
                        </td>
                        <td>
                            <input type="checkbox" id="sunday" name="sunday" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

function SelectTime({ hr, setHr, min, setMin }) {
    let hrs = [];
    let mins = [];

    for (let i = 0; i < 60; i++) {
        mins.push(i.toString().padStart(2, '0'));
    }

    for (let i = 0; i < 24; i++) {
        hrs.push(i.toString().padStart(2, '0'));
    }

    return (
        <div className="time-date-line mb-3">
            {/* <h5 className="w-100">Select Time Duration</h5> */}
            <FormControl variant="filled" className="fw-33 my-2 mr-2" style={{ minWidth: '70px' }}>
                <InputLabel id="">Hr</InputLabel>
                <Select
                    labelId=""
                    id="demo-simple-select-filled"
                    value={hr}
                    required
                    onChange={(e) => setHr(e.target.value)}
                    name="duration_hrs"
                >
                    <MenuItem value="">
                        <em>Hours</em>
                    </MenuItem>
                    {hrs.map((thr, indx) => (
                        <MenuItem key={indx} value={thr}>
                            {thr}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl variant="filled" className="fw-33 my-2" style={{ minWidth: '70px' }}>
                <InputLabel id="">Min</InputLabel>
                <Select
                    labelId=""
                    id="demo-simple-select-filled"
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                    name="duration_mins"
                    required={true}
                >
                    <MenuItem value="">
                        <em>Min</em>
                    </MenuItem>
                    {mins.map((tmin, indx) => (
                        <MenuItem key={indx} value={tmin}>
                            {tmin}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

function CreatePermanentJob() {
    const [hr, setHr] = useState('');
    const [min, setMin] = useState('');
    const [day, setDay] = useState(null);
    const [value, setValue] = useState(null);

    const formRef = useRef(null);

    const currentHour = new Date().getHours();
    const currentMin = new Date().getMinutes();

    const [allDaysData, setAllDaysData] = useState({
        s_time: `${currentHour}:${currentMin}`,
        e_time: `${currentHour + 2}:${currentMin}`,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
    });

    async function handleCreateJob(e) {
        e.preventDefault();
        const formData = new FormData(formRef.current);
        const result = await axios.post(GlobalData.baseUrl + '/api/admin/create-permanent-job', formData);
        if (result.data.status === 'error') {
            alert(result.data.msg);
        } else {
            alert(result.data.msg);
            // formRef.current.reset();
        }
    }

    return (
        <div>
            <h3>Create Permanent Job</h3>
            <div>
                <form ref={formRef} onSubmit={handleCreateJob}>
                    <TextField required className="w-100 my-3" label="Job Title" name="job_title" variant="filled" />
                    <TextField required className="w-100 my-3" label="Job Address" name="job_address" variant="filled" />
                    <TextField
                        required
                        className="w-100 my-3"
                        label="Payment per fortnight"
                        name="payment_per_fortnight"
                        type="number"
                        variant="filled"
                    />
                    <h6>Job Time Duration</h6>
                    {/* <SelectTime hr={hr} setHr={setHr} min={min} setMin={setMin} /> */}
                    <TextField required className="w-100 my-3" name="job_description" label="Job Description" variant="filled" />
                    <SelectDaysHaveToWork setAllDaysData={setAllDaysData} allDaysData={allDaysData} />
                    <Button type="submit" variant="contained" className="mt-3" onClick={handleCreateJob}>
                        Create Job
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default adminWrap(CreatePermanentJob);
