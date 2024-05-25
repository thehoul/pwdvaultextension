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