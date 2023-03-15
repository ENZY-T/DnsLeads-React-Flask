import React from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuid4 } from 'uuid';
import AdminHome from '../AdminHome';
import SubContractors from '../SubContractors';

export const adminPaths = [
    {
        id: uuid4(),
        name: 'Job Places Data',
        link: '/admin',
    },
    {
        id: uuid4(),
        name: 'Sub-Contractors',
        link: '/admin/sub-contractors',
    },
    {
        id: uuid4(),
        name: 'Create Permanent Job',
        link: '/admin/create-permanent-job',
    },
    {
        id: uuid4(),
        name: 'Create Quick Job',
        link: '/admin/create-quick-job',
    },
];

function AdminNavBar() {
    return (
        <div className="admin-nav-bar mb-3">
            <div className="nav-list">
                {adminPaths.map((adminObj) => (
                    <Link key={adminObj.id} to={adminObj.link} className="nav-item">
                        {adminObj.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default AdminNavBar;
