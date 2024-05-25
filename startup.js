/**
 * Check if the user is logged in by sending a message to the background script. 
 * If not, open the login page in a new tab.
 */
async function onStartup(){
  console.log("Looking for session cookies");

  // Send a message to the background script to check if the user is logged in
  browser.runtime.sendMessage({ action: 'checkAuth' }).then((response) => {
    if (!response.success) {
      browser.tabs.create({
        url: browser.runtime.getURL('login.html')
      }).catch((error) => {
        console.error('Error opening popup:', error);
      });
    }
  });
}

/**
 * Open the login page in a new tab when the extension is installed.
 */
async function onInstalled(){
  browser.tabs.create({
    url: browser.runtime.getURL('login.html')
  }).catch((error) => {
    console.error('Error opening popup:', error);
  });
}

browser.runtime.onStartup.addListener(onStartup);
browser.runtime.onInstalled.addListener(onInstalled);


