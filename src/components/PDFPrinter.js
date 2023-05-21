import React, { forwardRef, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import Invoice from './Invoice';

const PDFPrinter = ({ children, printPdfFlag, setPrintPdfFlag }) => {
	const componentRef = useRef();
	useEffect(() => {
		if (printPdfFlag) {
			handlePrint();
		}
		return () => {
			setPrintPdfFlag(false);
		};
	}, [printPdfFlag]);

	let handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});

	return (
		<div>
			<div className='container p-5' ref={componentRef}>
				{children}
			</div>
		</div>
	);
};

export default PDFPrinter;
