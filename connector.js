const USER_URL = 'https://pi.thehoul.ch/user/';
const CHECK_AUTH_URL = 'https://pi.thehoul.ch/checkAuth';
const LOGOUT_URL = 'https://pi.thehoul.ch/logout';
const PASSWORD_URL = 'https://pi.thehoul.ch/passwords/';

/**
 * Login to the server with the given username and password
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<{ success: boolean, message: string }>} success is true if login is successful, false otherwise. In both cases, the message 
 * will contain the response message.
 */
function login(username, password) {
    return fetch(USER_URL + username, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "password": password
        })
    }).then((response) => {
        return response.json().then((data) => {
            return { success: response.ok, message: data.msg };
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
    return fetch(USER_URL + username, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
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
            return { success: response.ok, user: data.user };
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

function getPassword(username, website) {
    return fetch(PASSWORD_URL+username+'/'+website, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }).then((response) => {
        return response.json().then((data) => {
            return { success: response.ok, passwords: data.passwords };
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
            sendResponse(signup(message.username, message.password));
            break;
        case 'checkAuth':
            sendResponse(checkUserLoggedIn());
            break;
        case 'logout':
            sendResponse(logout());
            break;
        case 'getPasswords':
            sendResponse(getPassword(message.username, message.website));
            break;
        default:
            sendResponse({ success: false, error: 'Invalid action' });
    }
});