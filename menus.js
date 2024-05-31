/**
 * Create the menu options for this page by fetching all known passwords for the current website
 * and create an entry for each one. Also create an entry to create a new password.
 * @param {Tab} tab 
 */
function createMenus(tab) {
    browser.menus.removeAll().then(() => {
        try {
            base_url = new URL(tab.url).hostname;
        } catch (e) {
            createNotWebsiteMenu();
            return;
        }
        checkUserLoggedIn().then((response) => {
            if(response.success){
                getPassword(base_url).then((response) => {
                    pwd = response.password;
                    if (response.success)
                        createPasswordMenu(base_url);
                    else 
                        createNoPasswordMenu(base_url);
                });
            } else {
                pwd = null;
                createNotAuthMenu();
            }
        });
    });   
}

let base_url;
let pwd;

function createNotWebsiteMenu(){
    browser.menus.create({
        id: "no-website",
        title: "Unknown website",
        type: "normal",
        contexts: ["password"]
    });
}

function createNotAuthMenu(){
    browser.menus.create({
        id: "notauth",
        title: "Not logged in. Click to log in",
        type: "normal",
        contexts: ["password"]
    });
}

function createPasswordMenu(base_url){
    browser.menus.create({
        id: "password",
        title: "use password for " + base_url,
        type: "normal",
        contexts: ["password"]
    });
    browser.menus.create({
        id: "separator",
        type: "separator",
        contexts: ["password"]
    });
    browser.menus.create({
        id: "deletepwd",
        title: "Delete password",
        contexts: ["password"]
    });
    browser.menus.create({
        id: "updatepwd",
        title: "Update Password",
        contexts: ["password"]
    });
}

function createNoPasswordMenu(base_url) {
    browser.menus.create({
        id: "nopassword",
        title: "No passwords for " + base_url,
        type: "normal",
        contexts: ["password"]
    })
    browser.menus.create({
        id: "separator",
        type: "separator",
        contexts: ["password"]
    });
    browser.menus.create({
        id: "vaultcreatepwd",
        title: "Create Password",
        contexts: ["password"]
    });
}

/**
 * Listen for clicks on the menu items and handle them
 */
browser.menus.onClicked.addListener((info, tab) => {
    switch(info.menuItemId){
        case "updatepwd":
        case "vaultcreatepwd":
            browser.browserAction.openPopup();
            break;
        case "notauth":
            browser.tabs.create({ url: "login.html" });
            break;
        case "password":
            browser.tabs.sendMessage(tab.id, { action: "inject", password: pwd});
            break;
        case "deletepwd":
            browser.tabs.sendMessage(tab.id, { action: "confirm", message: "Are you sure you want to delete this password?"}).then((response) => {
                if(response.success){
                    deletePassword(base_url).then((response) => {
                        if (response.success) {
                            browser.tabs.sendMessage(tab.id, { action: "inject", password: "" });
                            createMenus(tab);
                        } else {
                            console.log('Failed to delete password: ' + response.message);
                        }
                    });
                }
            });
            break;

    }
});

// List for tab change or reload events to update the menu
browser.tabs.onActivated.addListener((activeInfo) => {
    browser.tabs.get(activeInfo.tabId).then((tab) => {
        createMenus(tab);
    });
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        createMenus(tab);
    }
});

let pwdUpdate = false;
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch(message.action) {
        case 'menuAddPassword':
            if(pwdUpdate){
                sendResponse(updatePassword(base_url, message.password).then((response) => {
                    if(response.success){
                        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
                            browser.tabs.sendMessage(tabs[0].id, { action: "inject", password: message.password });
                            createMenus(tabs[0]);
                        });
                    } else {
                        console.log('Failed to update password: ' + response.message);
                    }
                    return response;
                }));
            } else {
                sendResponse(setPassword(message.website, message.password).then((response) => {
                    if(response.success){
                        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
                            browser.tabs.sendMessage(tabs[0].id, { action: "inject", password: message.password });
                            createMenus(tabs[0]);
                        });
                    } else {
                        console.log('Failed to set password: ' + response.message);
                    }
                    return response;
                }));
            }      
            break;
    }
});