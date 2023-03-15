import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useHistory } from 'react-router-dom';

function GoBackArrow() {
    const history = useHistory();
    const goBack = () => {
        history.goBack();
    };
    return (
        <span className="go-back" onClick={goBack}>
            <ArrowBackIcon /> Go Back
        </span>
    );
}

export default GoBackArrow;
