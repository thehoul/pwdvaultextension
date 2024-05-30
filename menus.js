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
                    browser.menus.create({
                        id: "vaultgetpwd" + i,
                        title: pwd,
                        contexts: ["password"]
                    });
                    browser.menus.onClicked.addListener((info, tab) => {
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

    } else if (info.menuItemId === "vaultgetpwd" + i) {
        // Only handle the 10 first passwords
        for(let i = 0; i < 10; i++){
            if(info.button == 0){ // left click
                browser.tabs.sendMessage(tab.id, { action: "inject", password: pwd});
            } else if(info.button == 2){ // right click
                deletePassword("theo", base_url, pwd).then((response) => {
                    // TODO: find a way to ask for confirmation first
                    if (response.success) {
                        createMenus(tab);
                    } else {
                        console.log('Failed to delete password: ' + response.message);
                    }
                });
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