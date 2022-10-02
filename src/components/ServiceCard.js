import * as React from 'react';
import { ThemeColors } from '../Styling/Colors';

export default function ServiceCard({ serviceItem }) {
	return (
		<div
			className='mx-3 my-3 card rounded-0 p-4 d-flex flex-column align-items-center justify-content-between'
			style={{ width: 340 }}
		>
			<div className='mb-3 d-flex flex-column align-items-center'>
				<div className='my-3'>{serviceItem.icon}</div>
				<p className='my-3 fs-3 text-justify'>{serviceItem.title}</p>
				<p className='text-justify text-center' style={{ color: ThemeColors.textColor_fade }}>
					{serviceItem.description}
				</p>
			</div>
			<div>
				<button className='btn btn-sm btn-outline-secondary rounded-0 mx-auto px-3 py-1'>Read More</button>
			</div>
		</div>
	);
}
