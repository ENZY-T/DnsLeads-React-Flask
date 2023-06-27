import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../Context/AppContext';
import Logo from './Logo';
import { ThemeColors } from '../Styling/Colors';

function TextEditLine({ txt, setTxt }) {
    const [isedit, setIsEdit] = useState(false);

    function textChangeHandler() {
        setIsEdit(false);
    }

    function enableEdit() {
        setIsEdit(true);
    }

    return (
        <span>
            {isedit ? (
                <span className="d-flex">
                    <input
                        type="text"
                        style={{ border: 'none', width: '100%', padding: '2px' }}
                        value={txt}
                        onChange={(e) => setTxt(e.target.value)}
                    />
                    <button
                        style={{ backgroundColor: ThemeColors.themeColor, color: ThemeColors.white, padding: '2px' }}
                        onClick={textChangeHandler}
                    >
                        ✓
                    </button>
                </span>
            ) : (
                <span onClick={enableEdit}>{txt}</span>
            )}
        </span>
    );
}

function NewInvoice({ invoiceRef }) {
    const date = new Date();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let today = `${date.getFullYear()}/${month}/${day}`;

    const { invoiceData } = useContext(AppContext);
    const data = invoiceData
        ? invoiceData
        : {
              invoice_number: '',
              to_name: '',
              to_address: '',
              sub_total: '',
              gst: '',
              total: '',
              duration: '',
          };

    const invoice_number = data.invoice_number ? data.invoice_number : '';
    const to_name = data.to_name ? data.to_name : '';
    const to_address = data.to_address ? data.to_address : '';

    const [toName, setToName] = useState(to_name);
    const [description, setDescription] = useState(
        `Cleaning provided at ${data.to_name ? data.to_name : ''} from ${data.duration ? data.duration : ''}.`
    );
    const [toAddress, setToAddress] = useState(`${to_address ? to_address : ''}`);
    const [] = useState();
    const [] = useState();
    const [] = useState();
    const [] = useState();
    const [] = useState();

    return (
        <div className="new-invoice-container container" ref={invoiceRef}>
            <div className="inner-page">
                <div className="header">
                    <Logo height={70} />
                    <h2>DNS LEADS SERVICE</h2>
                    <h3>TAX - INVOICE</h3>
                </div>
                <table className="table table-bordered mt-4">
                    <tbody>
                        <tr>
                            <td>
                                <h6>
                                    DATE
                                    <br />
                                    {today}
                                </h6>
                            </td>
                            <td>
                                <h6>
                                    TAX INVOICE NUMBER
                                    <br />
                                    {invoice_number ? invoice_number : ''}
                                </h6>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table className="table table-bordered mt-3">
                    <tbody>
                        <tr>
                            <td style={{ width: '50%' }}>
                                <h6>FROM:</h6>
                            </td>
                            <td style={{ width: '50%' }}>
                                <h6>
                                    TO:<span style={{ opacity: '0' }}>OM</span>
                                    <TextEditLine txt={toName} setTxt={setToName} />
                                </h6>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h6>
                                    DNS Leads Services Pty Ltd
                                    <br /> 8 Brett Street, Melrose Park, SA 5039.
                                </h6>
                            </td>
                            <td>
                                <h6>
                                    <TextEditLine txt={toAddress} setTxt={setToAddress} />
                                </h6>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h6></h6>
                            </td>
                            <td>
                                <h6></h6>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h6>
                                    <strong>ABN Number : </strong>
                                    77608871085
                                </h6>
                            </td>
                            <td>
                                <h6>
                                    <strong>Bank Details</strong>
                                    <br />
                                    <strong>Account Name : </strong>
                                    DNS Leads Services
                                    <br />
                                    <strong>BSB : </strong>065102
                                    <br />
                                    <strong>Account Number : </strong>
                                    10383660
                                </h6>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table className="table table-bordered mt-3">
                    <thead>
                        <tr>
                            <th>QTY</th>
                            <th>DESCRIPTION</th>
                            <th>EACH</th>
                            <th>GST</th>
                            <th style={{ width: '100px' }}>TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>01</td>
                            <td>
                                <TextEditLine txt={description} setTxt={setDescription} />
                            </td>
                            <td></td>
                            <td></td>
                            <td className="txt-right">$ {data.sub_total ? data.sub_total : ''}</td>
                        </tr>
                        <tr>
                            <td>
                                <br />
                            </td>
                            <td>
                                <br />
                            </td>
                            <td>
                                <br />
                            </td>
                            <td>
                                <br />
                            </td>
                            <td>
                                <br />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <br />
                            </td>
                            <td>
                                <br />
                            </td>
                            <td>
                                <br />
                            </td>
                            <td>
                                <br />
                            </td>
                            <td>
                                <br />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="4">SUB TOTAL</td>
                            <td className="txt-right">$ {data.sub_total ? data.sub_total : ''}</td>
                        </tr>
                        <tr>
                            <td colSpan="4">GST</td>
                            <td className="txt-right">$ {data.gst ? data.gst : ''}</td>
                        </tr>
                        <tr>
                            <td colSpan="4">TOTAL INCLUSIVE OF GST</td>
                            <td className="txt-right">$ {data.total ? data.total : ''}</td>
                        </tr>
                    </tbody>
                </table>
                <h6>Thank you for doing business</h6>
            </div>
        </div>
    );
}

export default NewInvoice;
