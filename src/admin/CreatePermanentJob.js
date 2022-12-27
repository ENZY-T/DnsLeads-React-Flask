import React from 'react';
import { adminWrap } from './component/adminWrap';

function CreatePermanentJob() {
    return (
        <div>
            <h1>Create Permanent Job</h1>
        </div>
    );
}

export default adminWrap(CreatePermanentJob);
