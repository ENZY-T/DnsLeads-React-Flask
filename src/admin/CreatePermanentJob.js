import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { adminWrap } from './component/adminWrap';
import { useRef } from 'react';
import axios from 'axios';
import { GlobalData } from '../GlobalData';
import { adminOnlyWrap } from '../components/wraps';
import { getItemFromLocalStorage, localStoreKeys } from '../allFuncs';
import { Add as AddIcon } from '@mui/icons-material';

function CheckBoxCell({ dayCell, absday, dayTimeLines, setDayTimeLines, dayTimeLineIndx, dayCellIndx }) {
    function cellClicked() {
        setDayTimeLines((prevVal) => {
            if (prevVal[dayTimeLineIndx].days[dayCellIndx] === absday) {
                prevVal[dayTimeLineIndx].days[dayCellIndx] = '';
            } else {
                prevVal[dayTimeLineIndx].days[dayCellIndx] = absday;
            }
            return [...prevVal];
        });
        console.log(dayTimeLines);
    }
    return (
        <td>
            <input type="checkbox" value={absday} onChange={cellClicked} />
        </td>
    );
}

function DayTimeLine({ dayTimeLines, setDayTimeLines, dayTimeLine, dayTimeLineIndx }) {
    const daysArr = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    function timeOnChangeS(e) {
        setDayTimeLines((prevVal) => {
            let st = prevVal[dayTimeLineIndx].time.split('-');
            prevVal[dayTimeLineIndx].time = e.target.value + '-' + st[1];
            return [...prevVal];
        });
        console.log(setDayTimeLines);
    }
    function timeOnChangeE(e) {
        setDayTimeLines((prevVal) => {
            let st = prevVal[dayTimeLineIndx].time.split('-');
            prevVal[dayTimeLineIndx].time = st[0] + '-' + e.target.value;
            return [...prevVal];
        });
        console.log(setDayTimeLines);
    }
    return (
        <tr>
            <td>
                <div className="d-flex">
                    <input type="time" style={{ margin: '1px' }} onChange={timeOnChangeS} />
                    <div>to</div>
                    <input type="time" style={{ margin: '1px' }} onChange={timeOnChangeE} />
                </div>
            </td>
            {dayTimeLine.days.map((dayCell, indx) => (
                <CheckBoxCell
                    dayCellIndx={indx}
                    dayCell={dayCell}
                    absday={daysArr[indx]}
                    key={indx}
                    dayTimeLines={dayTimeLines}
                    setDayTimeLines={setDayTimeLines}
                    dayTimeLineIndx={dayTimeLineIndx}
                />
            ))}
        </tr>
    );
}

function SelectDaysHaveToWork({ dayTimeLines, setDayTimeLines, initdaytime }) {
    function addNewDayTimeLine() {
        setDayTimeLines([...dayTimeLines, initdaytime]);
    }

    return (
        <div>
            <table className="select-days-to-work">
                <thead>
                    <tr>
                        <td style={{ width: '200px' }}>
                            <label>Time</label>
                        </td>
                        <td>
                            <label>Mo</label>
                        </td>
                        <td>
                            <label>Tu</label>
                        </td>
                        <td>
                            <label>We</label>
                        </td>
                        <td>
                            <label>Th</label>
                        </td>
                        <td>
                            <label>Fr</label>
                        </td>
                        <td>
                            <label>Sa</label>
                        </td>
                        <td>
                            <label>Su</label>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {dayTimeLines
                        ? dayTimeLines.map((dayTimeLine, indx) => (
                              <DayTimeLine
                                  dayTimeLines={dayTimeLines}
                                  setDayTimeLines={setDayTimeLines}
                                  dayTimeLine={dayTimeLine}
                                  dayTimeLineIndx={indx}
                                  key={indx}
                              />
                          ))
                        : ''}
                    <tr>
                        <td colSpan="8">
                            <Button className="w-100" onClick={addNewDayTimeLine}>
                                <AddIcon />
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

function CreatePermanentJob() {
    const formRef = useRef(null);
    const initdaytime = {
        time: '00:00-00:00',
        days: ['', '', '', '', '', '', ''],
    };

    const [dayTimeLines, setDayTimeLines] = useState([initdaytime]);

    async function handleCreateJob(e) {
        e.preventDefault();
        const accessToken = getItemFromLocalStorage(localStoreKeys.authKey);
        const formData = new FormData(formRef.current);
        formData.append('timeline_data', JSON.stringify(dayTimeLines));
        const result = await axios.post(GlobalData.baseUrl + '/api/admin/create-permanent-job', formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
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
                        label="Sub-Contractors Count for Job"
                        name="job_need_count"
                        type="number"
                        variant="filled"
                        min="1"
                    />
                    <TextField required className="w-100 my-3" label="Pay per Hr for me" name="pay_per_hr" variant="filled" type="number" />
                    <TextField
                        required
                        className="w-100 my-3"
                        label="Pay per Hr for Sub-contractor"
                        name="pay_per_hr_sub_contractor"
                        variant="filled"
                        type="number"
                    />
                    <h6>Job Time Duration</h6>
                    {/* <SelectTime hr={hr} setHr={setHr} min={min} setMin={setMin} /> */}
                    <TextField required className="w-100 my-3" name="job_description" label="Job Description" variant="filled" />
                    <SelectDaysHaveToWork dayTimeLines={dayTimeLines} setDayTimeLines={setDayTimeLines} initdaytime={initdaytime} />
                    <Button type="submit" variant="contained" className="mt-3" onClick={handleCreateJob}>
                        Create Job
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default adminOnlyWrap(adminWrap(CreatePermanentJob));
