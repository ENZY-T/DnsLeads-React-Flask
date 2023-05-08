import React, { useState } from 'react';

function GenTable({ tableData, tableTitle = '' }) {
    const headerData = tableData[0];
    const bodyData = tableData.slice(1);
    return (
        <div>
            <h3>{tableTitle}</h3>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            {headerData.map((headerTitle, indx) => (
                                <th scope="col" key={indx}>
                                    {headerTitle}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {bodyData.map((bodyRow, indx) => (
                            <tr key={indx}>
                                {bodyRow.map((val, indx1) => (
                                    <td key={indx1}>{val}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default GenTable;
