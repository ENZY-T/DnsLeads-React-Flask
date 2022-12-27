import React from 'react';
import { adminWrap } from './component/adminWrap';
import GenTable from './component/GenTable';

const adminHomeData = [
    ['ID', 'Date', 'Done By', 'Job Place', 'Duration', 'Pay to Sub-Con.'],
    ['0', '2022-12-26', 'Kavindu Harshitha', 'Garden Island', '1hr', 'A$25.00'],
    ['1', '2022-12-26', 'Kavindu Harshitha', 'Cafe Buongiorno', '1hr 45min', 'A$42.00'],
    ['2', '2022-12-27', 'Kavindu Harshitha', 'Garden Island', '1hr', 'A$25.00'],
    ['3', '2022-12-27', 'Kavindu Harshitha', 'Cafe Buongiorno', '1hr 45min', 'A$42.00'],
];

// Job places data
function AdminHome() {
    return (
        <div>
            <GenTable tableData={adminHomeData} />
        </div>
    );
}

export default adminWrap(AdminHome);
