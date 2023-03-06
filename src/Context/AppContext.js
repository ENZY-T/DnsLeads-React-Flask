import React, { createContext, useEffect, useState } from 'react';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const [authState, setAuthState] = useState({ isLogged: false, loggedUser: null, accessToken: null });
    const [invoiceData, setInvoiceData] = useState({
        invoice_number: '',
        to_name: '',
        to_address: '',
        sub_total: '',
        gst: '',
        total: '',
        duration: '',
    });
    const [isError, setIsError] = useState(null);

    const setInvoiceDataForPDF = (data) => {
        setInvoiceData(data);
    };

    const setLogged = (user) => {
        setAuthState((prev) => ({ ...prev, isLogged: true, loggedUser: user }));
    };

    const setLoggedOut = () => {
        setAuthState((prev) => ({ ...prev, isLogged: false, loggedUser: null, accessToken: null }));
    };

    const setCurrentPermanentJobID = (data) => {
        setAuthState((prev) => ({
            ...prev,
            loggedUser: { ...prev.loggedUser, current_permanent_job_id: data.job_id, current_permanent_job_row_id: data.row_id },
        }));
    };

    const setCurrentQuickJobID = (data) => {
        setAuthState((prev) => ({
            ...prev,
            loggedUser: { ...prev.loggedUser, current_quick_job_id: data.job_id, current_quick_job_row_id: data.row_id },
        }));
    };

    useEffect(() => {
        if (isError) {
            setTimeout(() => {
                setIsError(null);
            }, 1000);
        }
    }, [isError]);

    return (
        <AppContext.Provider
            value={{
                authState,
                setAuthState,
                isError,
                setIsError,
                setLogged,
                setLoggedOut,
                setCurrentPermanentJobID,
                setCurrentQuickJobID,
                setInvoiceDataForPDF,
                invoiceData,
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};
