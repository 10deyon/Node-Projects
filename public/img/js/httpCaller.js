import axios from 'axios';

export const getCaller = async () => {
    try {
        const res = await axios({
            method: 'GET',
            // url: 'http:127.0.0.1:3000/api/v1/users/logout'
            url: `${process.env(BASE_URL)}/users/logout`
        });

        const res = await axios.get(`${process.env(BASE_URL)}/users/logout`);

        const res = await axios(`${process.env(BASE_URL)}/users/logout`);

        if (res.data.status === 'success') console.log(res);
        
    } catch (error) {
        console.log(error.response);
        showAlert('error', 'Error handling logout, try again');
    }
}


export const postCaller = async () => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http:127.0.0.1:3000/api/v1/users/login'
        })
    } catch (error) {
        console.log(error.response);
        showAlert('error', 'Error handling user login, try again');
    }
}
