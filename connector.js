const BASE_URL = 'https://pi.thehoul.ch';
const LOGIN_URL = BASE_URL + '/login';
const CREATE_USER_URL = BASE_URL + '/createUser';
const GET_PWD_URL = BASE_URL + '/getPassword/';
const SET_PWD_URL = BASE_URL + '/setPassword';
const DEL_PWD_URL = BASE_URL + '/deletePassword';
const UPDATE_PWD_URL = BASE_URL + '/updatePassword';
const CHECK_AUTH_URL = 'https://pi.thehoul.ch/checkAuth';
const LOGOUT_URL = 'https://pi.thehoul.ch/logout';

/**
 * Login to the server with the given username and password
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<{ success: boolean, message: string }>} success is true if login is successful, false otherwise. In both cases, the message 
 * will contain the response message.
 */
function login(username, password) {
    return fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    }).then((response) => {
        return response.json().then((data) => {
            return { success: response.ok, message: data.msg, username: data.username, email: data.email };
        }).catch((error) => {
            return { success: false, message: error };
        });
    }, (error) => {
        return { success: false, message: error };
    });
}

/**
 * Create a login to the server with the given username, password and email
 * @param {string} username 
 * @param {string} password 
 * @param {string} email
 * @returns {Promise<{ success: boolean, message: string }>} success is true if login is successful, false otherwise. In both cases, the message 
 * will contain the response message.
 */
function signup(username, password, email) {
    return fetch(CREATE_USER_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "email": email,
            "password": password
        })
    }).then((response) => {
        return response.json().then((data) => {
            return { success: response.ok, message: data.msg };
        }).catch((error) => {
            return { success: false, message: error };
        });
    }, (error) => {
        return { success: false, error: error };
    });
}

/**
 * 
 * @returns {Promise<{ success: boolean, user: string }>} success is true if user is logged in, false otherwise.
 *  In case of success, the user object will contain the username.
 */
function checkUserLoggedIn() {
    return fetch(CHECK_AUTH_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }).then((response) => {
        return response.json().then((data) => {
            return { success: response.ok, username: data.username, email: data.email };
        });
    }).catch((error) => {
        return { success: false, message: error };
    });
}

/**
 * Logout the current user
 * @returns {Promise<{ success: boolean, message: string }>} success is true if logout is successful, false otherwise. 
 * In both cases, the message contains the response message.
 */
function logout() {
    return fetch(LOGOUT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }).then((response) => {
        return response.json().then((data) => {
            return { success: response.ok, message: data.msg };
        });
    }).catch((error) => {
        return { success: false, message: error };
    });

}

function getPassword(website) {
    return fetch(GET_PWD_URL + website, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }).then((response) => {
        return response.json().then((data) => {
            if(response.ok && data.accepted){
                return { success: true, password: data.passwords };
            } else {
                return { success: false, message: data.msg };
            }
        });
    }).catch((error) => {
        return { success: false, message: error };
    });
}

function setPassword(website, password) {
    return fetch(SET_PWD_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "website": website,
            "password": password
        })
    }).then((response) => {
        return response.json().then((data) => {
            return { success: response.ok && data.accepted, message: data.msg };
        });
    }).catch((error) => {
        return { success: false, message: error };
    });
}

function updatePassword(website, newPassword) {
    return fetch(UPDATE_PWD_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "website": website,
            "password": newPassword
        })
    }).then((response) => {
        return response.json().then((data) => {
            return { success: response.ok && data.accepted, message: data.msg };
        });
    }).catch((error) => {
        return { success: false, message: error };
    });
}


function deletePassword(website) {
    return fetch(DEL_PWD_URL, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "website": website
        })
    }).then((response) => {
        return response.json().then((data) => {
            return { success: response.ok, message: data.msg };
        });
    }).catch((error) => {
        return { success: false, message: error };
    });
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case 'login':
            sendResponse(login(message.username, message.password));
            break;
        case 'signup':
            sendResponse(signup(message.username, message.password, message.email));
            break;
        case 'checkAuth':
            sendResponse(checkUserLoggedIn());
            break;
        case 'logout':
            sendResponse(logout());
            break;
        case 'getPasswords':
            sendResponse(getPassword(message.website));
            break;
        case 'updatePassword':
            sendResponse(updatePassword(message.website, message.password));
            break;
        case 'addPassword':
            sendResponse(setPassword(username, message.website, message.password));
            break;
        default:
            break;
    }
});