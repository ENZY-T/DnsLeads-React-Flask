import React, { useEffect, useRef, useState } from 'react';
import './Invoice.scss';
import Logo from './Logo';
import PDFPrinter from './PDFPrinter';

const Invoice = ({
	invoiceNo = 'XXX-222',
	items = [
		{ description: 'Domain registration', qyt: 1, unitPrice: 10 },
		{ description: 'Web hosting', qyt: 3, unitPrice: 15 },
		{ description: 'Software development', qyt: null, unitPrice: 2000 },
		{ description: 'Consulting', qyt: '1 year', unitPrice: 500 },
	],
	receiver = { name: 'Alex Doe', address: 'Street, City, State, Country', tel: '111-111-111' },
	gstRate = 20,
}) => {
	const [printPdfFlag, setPrintPdfFlag] = useState(false);
	const [subTotal, setSubTotal] = useState(0);
	const [gst, setGst] = useState(0);

	useEffect(() => {
		let tempSubTotal = 0;
		items.map((item) => {
			tempSubTotal += item.unitPrice * item.qyt || item.unitPrice;
		});
		setSubTotal(tempSubTotal);
		let tempGst = (subTotal / 100) * gstRate;
		setGst(tempGst);
	}, [subTotal]);

	const handlePrintClick = () => {
		setPrintPdfFlag(true);
	};
	return (
		<div className='container px-5'>
			<div className='container px-5'>
				<div className='page-content container'>
					<div className='invoice-header text-blue-d2 my-3'>
						<h1 className='display-6'>
							Invoice
							<small className='page-info'>
								<i className='fa fa-angle-double-right text-80 mx-2'></i>
								{invoiceNo}
							</small>
						</h1>

						<div className='page-tools'>
							<div className='action-buttons'>
								<button
									className='btn bg-white btn-light mx-1px text-95'
									href='#'
									data-title='PDF'
									onClick={handlePrintClick}
								>
									<i className='mr-1 fa fa-file-pdf-o text-danger-m1 text-120 w-2'></i>
									Print PDF
								</button>
							</div>
						</div>
					</div>

					<div className='container px-0'>
						<div className='row mt-4'>
							<div className='col-12 col-lg-12'>
								{/* Invoice Content */}
								<PDFPrinter printPdfFlag={printPdfFlag} setPrintPdfFlag={setPrintPdfFlag}>
									<div className='row'>
										<div className='col-12'>
											<div className='text-center text-150'>
												<Logo height={70} />
												<div className='display-6'>DNS LEADS SERVICES</div>
											</div>
										</div>
									</div>

									<hr className='row brc-default-l1 mx-n1 mb-4' />

									<div className='row'>
										<div className='col-sm-6'>
											<div>
												<div className='mt-1 mb-1 text-secondary-m1 text-600 text-125'>To:</div>
												<div className='text-600 text-110 text-blue align-middle'>{receiver.name}</div>
											</div>
											<div className='text-grey-m2'>
												{receiver.address.split(',')?.map((part, index, parts) => {
													if (index % 2 !== 0) {
														return;
													}
													return (
														<div key={index}>
															{part}
															{parts[index + 1] && ','} {parts[index + 1]}
														</div>
													);
												})}
												<div className='my-1'>
													<i className='fa fa-phone fa-flip-horizontal text-secondary'></i>{' '}
													<b className='text-600'>111-111-111</b>
												</div>
											</div>
										</div>

										<div className='text-95 col-sm-6 align-self-start d-sm-flex justify-content-end'>
											<hr className='d-sm-none' />
											<div className='text-grey-m2'>
												<div className='mt-1 mb-1 text-secondary-m1 text-600 text-125'>Invoice</div>

												<div className='my-2'>
													<i className='fa fa-circle text-blue-m2 text-xs mr-1'></i>{' '}
													<span className='text-600 text-90'>Invoice No: </span>
													{invoiceNo}
												</div>

												<div className='my-2'>
													<i className='fa fa-circle text-blue-m2 text-xs mr-1'></i>{' '}
													<span className='text-600 text-90'>Issue Date:</span> {new Date().toLocaleDateString('en-GB')}
												</div>
											</div>
										</div>
									</div>
									<div className='mt-4'>
										<div className='row text-600 text-white bgc-default-tp1 py-25'>
											<div className='d-none d-sm-block col-1'>#</div>
											<div className='col-9 col-sm-6'>Description</div>
											<div className='d-none d-sm-block col-3 col-sm-1'>Qty</div>
											<div className='d-none d-sm-block col-sm-2'>Unit Price</div>
											<div className='col-2'>Amount</div>
										</div>

										<div className='text-95 text-secondary-d3'>
											{items.map((item, index) => {
												return (
													<div className='row mb-2 mb-sm-0 py-25' key={index}>
														<div className='d-none d-sm-block col-1'>{index + 1}</div>
														<div className='col-9 col-sm-6'>{item.description}</div>
														<div className='d-none d-sm-block col-1'>{item.qyt}</div>
														<div className='d-none d-sm-block col-2 text-95'>${item.unitPrice}</div>
														<div className='col-2 text-secondary-d2'>
															${item.unitPrice * item.qyt || item.unitPrice}
														</div>
													</div>
												);
											})}
										</div>
										<div className='row text-600 text-white bgc-default-tp1 py-1' />

										<div className='row border-b-2 brc-default-l2'></div>

										<div className='row mt-3'>
											<div className='col-12 col-sm-7 text-grey-d2 text-95 mt-2 mt-lg-0 invisible'>Notes...</div>

											<div className='col-12 col-sm-5 text-grey text-90 order-first order-sm-last'>
												<div className='row my-2'>
													<div className='col-7 text-right'>SubTotal</div>
													<div className='col-5'>
														<span className='text-120 text-secondary-d1'>${subTotal}</span>
													</div>
												</div>

												<div className='row my-2'>
													<div className='col-7 text-right'>GST ({gstRate}%)</div>
													<div className='col-5'>
														<span className='text-110 text-secondary-d1'>${gst}</span>
													</div>
												</div>

												<div className='row my-2 align-items-center bgc-primary-l3 py-2'>
													<div className='col-7 text-right'>Total Inclusive of GST</div>
													<div className='col-5'>
														<span className='text-150 text-success-d3 opacity-2'>${subTotal - gst}</span>
													</div>
												</div>
											</div>
										</div>

										<hr />

										<div className='d-flex justify-content-end'>
											<span className='text-secondary-d1 text-105 me-3'>Thank you for your business</span>
											{/* <button href='#' className='btn btn-info btn-bold px-4 float-right mt-3 mt-lg-0'>
											Pay Now
										</button> */}
										</div>
									</div>
								</PDFPrinter>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Invoice;
