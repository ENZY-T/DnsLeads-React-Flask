import React from 'react';
import { adminOnlyWrap } from '../components/wraps';
import { adminWrap } from './component/adminWrap';

function CreateQuickJob() {
    return (
        <div>
            <h1>Create Quick Job</h1>
        </div>
    );
}

export default adminOnlyWrap(adminWrap(CreateQuickJob));
