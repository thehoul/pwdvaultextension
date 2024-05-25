function login(username, password) {
    return fetch('https://pi.thehoul.ch/user/' + username, {
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

function signup(username, password) {
    return fetch('https://pi.thehoul.ch/user/' + username, {
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

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case 'login':
            sendResponse(login(message.username, message.password));
            break;
        case 'signup':
            sendResponse(signup(message.username, message.password));
            break;
        default:
            sendResponse({ success: false, error: 'Invalid action' });
    }
});