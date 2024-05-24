browser.menus.create({
    id: "vaultgetpwd",
    title: "Get Password",
    contexts: ["editable", "password"]
});

browser.menus.create({
    id: "vaultcreatepwd",
    title: "Create Password",
    contexts: ["editable", "password"]
});

browser.menus.onClicked.addListener((info, tab) => {
    switch(info.menuItemId) {
        case "vaultgetpwd":
            browser.tabs.executeScript({
                file: "getpwd.js"
            });
            break;
        case "vaultcreatepwd":
            browser.tabs.executeScript({
                file: "createpwd.js"
            });
            break;
    }
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.action === "login") {
        sendResponse({ success: true });
        const req = new Request("https://pi.thehoul.ch/user/"+message.username, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "password": message.password
            })
        });

        fetch(req).then((response) => {
            if(response.ok) {
                sendResponse({ success: true });
            } else {
                sendResponse({ success: false, error: response.statusText });
            }
        }, (error) => {
            sendResponse({ success: false, error: error });
        });
    } else if(message.action === "signup") {
        const req = new Request("https://pi.thehoul.ch/user/"+message.username, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": message.username,
                "password": message.password
            })
        });

        fetch(req).then((response) => {
            if(response.ok) {
                sendResponse({ success: true });
            } else {
                sendResponse({ success: false, error: response.statusText });
            }
        }, (error) => {
            sendResponse({ success: false, error: error });
        });
    }
});