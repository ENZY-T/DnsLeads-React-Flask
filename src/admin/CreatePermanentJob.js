import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { adminWrap } from './component/adminWrap';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

function SelectDaysHaveToWork({ setAllDaysData, allDaysData }) {
	const [mo, setMo] = useState(false);
	const [tu, setTu] = useState(false);
	const [we, setWe] = useState(false);
	const [th, setTh] = useState(false);
	const [fr, setFr] = useState(false);
	const [sa, setSa] = useState(false);
	const [su, setSu] = useState(false);

	return (
		<table className='select-days-to-work'>
			<thead>
				<tr>
					<td>
						<label htmlFor='monday'>Mo</label>
					</td>
					<td>
						<label htmlFor='tuesday'>Tu</label>
					</td>
					<td>
						<label htmlFor='wednesday'>We</label>
					</td>
					<td>
						<label htmlFor='thursday'>Th</label>
					</td>
					<td>
						<label htmlFor='friday'>Fr</label>
					</td>
					<td>
						<label htmlFor='saturday'>Sa</label>
					</td>
					<td>
						<label htmlFor='sunday'>Su</label>
					</td>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>
						<input
							type='checkbox'
							id='monday'
							value={mo}
							onChange={(e) => {
								setMo(e.target.checked);
								setAllDaysData({
									...allDaysData,
									monday: mo,
								});
							}}
						/>
					</td>
					<td>
						<input
							type='checkbox'
							id='tuesday'
							value={tu}
							onChange={(e) => {
								setTu(e.target.checked);
								setAllDaysData({
									...allDaysData,
									tuesday: tu,
								});
							}}
						/>
					</td>
					<td>
						<input
							type='checkbox'
							id='wednesday'
							value={we}
							onChange={(e) => {
								setWe(e.target.checked);
								setAllDaysData({
									...allDaysData,
									wednesday: we,
								});
							}}
						/>
					</td>
					<td>
						<input
							type='checkbox'
							id='thursday'
							value={th}
							onChange={(e) => {
								setTh(e.target.checked);
								setAllDaysData({
									...allDaysData,
									thursday: th,
								});
							}}
						/>
					</td>
					<td>
						<input
							type='checkbox'
							id='friday'
							value={fr}
							onChange={(e) => {
								setFr(e.target.checked);
								setAllDaysData({
									...allDaysData,
									friday: fr,
								});
							}}
						/>
					</td>
					<td>
						<input
							type='checkbox'
							id='saturday'
							value={sa}
							onChange={(e) => {
								setSa(e.target.checked);
								setAllDaysData({
									...allDaysData,
									saturday: sa,
								});
							}}
						/>
					</td>
					<td>
						<input
							type='checkbox'
							id='sunday'
							value={su}
							onChange={(e) => {
								setSu(e.target.checked);
								setAllDaysData({
									...allDaysData,
									sunday: su,
								});
							}}
						/>
					</td>
				</tr>
			</tbody>
		</table>
	);
}

function SelectTime({ hr, setHr, min, setMin, day, setDay }) {
	let hrs = [];
	let mins = [];

	for (let i = 0; i < 60; i++) {
		mins.push(i.toString().padStart(2, '0'));
	}

	for (let i = 0; i < 24; i++) {
		hrs.push(i.toString().padStart(2, '0'));
	}

	return (
		<div className='time-date-line mb-3'>
			<h5 className='w-100'>Select Time Duration</h5>
			<FormControl variant='filled' className='fw-33 my-2 mr-2'>
				<InputLabel id=''>Hr</InputLabel>
				<Select
					labelId=''
					id='demo-simple-select-filled'
					value={hr}
					onChange={(e) => setHr(e.target.value)}
					name='account_type'
				>
					<MenuItem value=''>
						<em>Hours</em>
					</MenuItem>
					{hrs.map((thr, indx) => (
						<MenuItem key={indx} value={thr}>
							{thr}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<FormControl variant='filled' className='fw-33 my-2'>
				<InputLabel id=''>Min</InputLabel>
				<Select
					labelId=''
					id='demo-simple-select-filled'
					value={min}
					onChange={(e) => setMin(e.target.value)}
					name='account_type'
					required={true}
				>
					<MenuItem value=''>
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

	const [allDaysData, setAllDaysData] = useState({
		monday: false,
		tuesday: false,
		wednesday: false,
		thursday: false,
		friday: false,
		saturday: false,
		sunday: false,
	});

	function handleCreateJob() {
		console.log(allDaysData);
	}

	return (
		<div>
			<h3>Create Permanent Job</h3>
			<div>
				<TextField className='w-100 my-3' label='Job Title' variant='filled' />
				<TextField className='w-100 my-3' label='Job Address' variant='filled' />
				<SelectTime hr={hr} setHr={setHr} min={min} setMin={setMin} day={day} setDay={setDay} />
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<TimePicker
						label='Select Start Time'
						value={value}
						onChange={(newValue) => {
							setValue(newValue);
						}}
						renderInput={(params) => <TextField {...params} />}
					/>
				</LocalizationProvider>
				<br />
				<TextField className='w-100 my-3' label='Job Description' variant='filled' />
				<SelectDaysHaveToWork setAllDaysData={setAllDaysData} allDaysData={allDaysData} />
				<Button variant='contained' className='mt-3' onClick={handleCreateJob}>
					Create Job
				</Button>
			</div>
		</div>
	);
}

export default adminWrap(CreatePermanentJob);
