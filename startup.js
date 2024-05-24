async function onStartup(){
    console.log("Looking for session cookies");
    try {
        const resp = await fetch('https://pi.thehoul.ch/checkAuth', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if(resp.ok) {
          browser.notifications.create("session-cookie", {
            type: 'basic',
            title: 'PasswordVault',
            message: 'Session cookie not found, please login',
          });
        }
      } catch (error) {
        console.error('Error retrieving cookie:', error);
      }
}

browser.notifications.onClicked.addListener((notificationId) => {
  if (notificationId === 'session-cookie') {
    browser.tabs.create({
      url: browser.runtime.getURL('login.html')
    }).then(() => {
      browser.notifications.clear(notificationId);
    }).catch((error) => {
      console.error('Error opening popup:', error);
    });
  }
});


browser.runtime.onStartup.addListener(onStartup);
browser.runtime.onInstalled.addListener(onStartup);


