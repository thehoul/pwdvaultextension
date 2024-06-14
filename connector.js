/**
 * Login to the server with the given username and password
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<{ success: boolean, message: string }>} success is true if login is successful, false otherwise. In both cases, the message 
 * will contain the response message.
 */
function login(username, password) {
    console.log('Logging in');
    return requestBody("POST", LOGIN_URL, { 
        "username": username, 
        "password": password 
    }).then((response) => {
        return response.json().then((data) => {
            if(response.ok) setKey(password);
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
    return requestBody('PUT', CREATE_USER_URL, {
        "username": username,
        "email": email,
        "password": password
    }).then((response) => {
        return response.json().then((data) => {
            if(response.ok) setKey(password);
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
    return request('GET', CHECK_AUTH_URL).then((response) => {
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
    return request('POST', LOGOUT_URL).then((response) => {
        return response.json().then((data) => {
            return { success: response.ok, message: data.msg };
        });
    }).catch((error) => {
        return { success: false, message: error };
    });

}

async function getPassword(website) {
    let response = await request('GET', GET_PWD_URL + website);
    let json = await response.json();
    if(response.ok && json.accepted){
        decPwd = await decryptPassword(json.password);
        return { success: true, password: decPwd };
    } else {
        return { success: false, message: json.msg };
    }
}

async function setPassword(website, password) {
    encPwd = await encryptPassword(password);

    let response = await requestBody('POST', SET_PWD_URL, {
            "website": website,
            "password": encPwd
    });
    let json = await response.json();
    return { success: response.ok && json.accepted, message: json.msg };
}

function updatePassword(website, newPassword) {
    return requestBody('PUT', UPDATE_PWD_URL, {
            "website": website,
            "password": newPassword
    }).then((response) => {
        return response.json().then((data) => {
            return { success: response.ok && data.accepted, message: data.msg };
        });
    }).catch((error) => {
        return { success: false, message: error };
    });
}


function deletePassword(website) {
    return requestBody('DELETE', DEL_PWD_URL, {
            "website": website
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
        case 'getPassword':
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