browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.action === 'inject') {
        document.activeElement.value = message.password;
    } else if(message.action === 'confirm') {
        if(confirm(message.message)) {
            sendResponse({ success: true });
        } else {
            sendResponse({ success: false });
        }
    }
});