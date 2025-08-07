import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext()

export const AppContextProvider = (props) => {
    
    axios.defaults.withCredentials = true;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(false)

    const getUserData = async () => {
        axios.defaults.withCredentials = true;

        try {
            const { data } = await axios.get(backendUrl + '/api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        }
    }

    const getAuthState = async () => {
        axios.defaults.withCredentials = true;

        try {
            const { data } = await axios.post(backendUrl + "/api/auth/is-auth");

            if (data.success) {
                setIsLoggedIn(true);
                await getUserData();
            } else {
                setIsLoggedIn(false);
                setUserData(false);
            }
        } catch (error) {
            const status = error.response?.status;

            if (status !== 401) {
                toast.error(error.response?.data?.message || "Something went wrong.");
            }

            setIsLoggedIn(false);
            setUserData(false);
        }
    };

    useEffect(() => {
        getAuthState()
    }, [])

    const value = {
        backendUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}