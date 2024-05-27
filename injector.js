browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    if(message.action === 'inject') {
        document.activeElement.value = message.password;
    }
});