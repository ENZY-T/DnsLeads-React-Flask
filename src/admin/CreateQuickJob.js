import React from 'react';
import { adminWrap } from './component/adminWrap';

function CreateQuickJob() {
    return (
        <div>
            <h1>Create Quick Job</h1>
        </div>
    );
}

export default adminWrap(CreateQuickJob);
