browser.runtime.onMessage.addListener((message) => {    
    if (message.action === "closePopup") {
        browser.browserAction.setPopup({ popup: "popup.html" });
    }
});