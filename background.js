function createMenus(tab) {
    browser.menus.removeAll();
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
                browser.menus.create({
                    id: "vaultgetpwd" + i,
                    title: response.passwords[i],
                    contexts: ["password"]
                });
                browser.menus.onClicked.addListener((info, tab) => {
                    if (info.menuItemId === "vaultgetpwd" + i) {
                        browser.tabs.sendMessage(tab.id, { action: "inject", password: response.passwords[i], target: info.targetElementId });
                    }
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
    });
}

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

