/**
 * Create the menu options for this page by fetching all known passwords for the current website
 * and create an entry for each one. Also create an entry to create a new password.
 * @param {Tab} tab 
 */
function createMenus(tab) {
    browser.menus.removeAll().then(() => {
        let base_url;
        try {
            base_url = new URL(tab.url).hostname;
        } catch (e) {
            browser.menus.create({
                id: "no-website",
                title: "PWDVault: unknown website",
                type: "normal",
                contexts: ["password"]
            });
            return;
        }

        checkUserLoggedIn().then((response) => {
            if(response.success){
                getPassword("theo", base_url).then((response) => {
                    if (response.success) {
                        browser.menus.create({
                            id: "passwords",
                            title: "Passwords for " + base_url + ":",
                            type: "normal",
                            contexts: ["password"]
                        });
                        for (let i = 0; i < response.passwords.length; i++) {
                            let pwd = response.passwords[i];
                            pwds[i] = pwd;
                            browser.menus.create({
                                id: "vaultgetpwd" + i,
                                title: pwd,
                                contexts: ["password"]
                            });
                        }
                    } else {
                        browser.menus.create({
                            id: "passwords",
                            title: "No passwords for " + base_url,
                            type: "normal",
                            contexts: ["password"]
                        })
                    }
                    createPasswordMenu();
                });
            } else {
                createNotAuthMenu();
            }
        });
    });   
}

const MAX_PASSWORDS = 10;
let pwds = new Array(MAX_PASSWORDS);

function createNotAuthMenu(){
    browser.menus.create({
        id: "notauth",
        title: "Not logged in. Click to log in",
        type: "normal",
        contexts: ["password"]
    });
}

/**
 * Create the menu options for creating a new password
 */
function createPasswordMenu() {
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
    if (info.menuItemId === "vaultcreatepwd") {
        // Open the password generator page or a popup of something like that
        browser.browserAction.setPopup({ popup: "passwordgen.html" });
        browser.browserAction.openPopup();
    } else if(info.menuItemId === "notauth"){ 
        // Open the login page
        browser.tabs.create({ url: "login.html" });
    } else {
        // Only handle the 10 first passwords
        for(let i = 0; i < MAX_PASSWORDS; i++){
            if (info.menuItemId === "vaultgetpwd" + i) {
                let pwd = pwds[i];
                let base_url = new URL(tab.url).hostname;


                if(info.button == 0){ // left click
                    browser.tabs.sendMessage(tab.id, { action: "inject", password: pwd});
                } else if(info.button == 2){ // right click
                    // Ask to confirm first
                    browser.tabs.sendMessage(tab.id, { action: "confirm", message: "Are you sure you want to delete this password?"}).then((response) => {
                        if(response.success){
                            deletePassword("theo", base_url, pwd).then((response) => {
                                if (response.success) {
                                    createMenus(tab);
                                } else {
                                    console.log('Failed to delete password: ' + response.message);
                                }
                            });
                        }
                    });
                }   
            }
        }
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

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch(message.action) {
        case 'menuAddPassword':
            sendResponse(addPassword(message.username, message.website, message.password).then((response) => {
                browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
                    browser.tabs.sendMessage(tabs[0].id, { action: "inject", password: message.password });
                    createMenus(tabs[0]);
                });
                return response;
            }));

            break;
    }
});