function handleMessage(message, sender, sendResponse) {
  if (message.action === 'getCookies') {
    const tabId = message.tabId;
    console.log(`Received message to get cookies for tab ID: ${tabId}`);
    chrome.tabs.get(tabId, handleTabsGet.bind(null, sendResponse));
    sendResponse({ "cookies": cookieString });
  }
}

function handleTabsGet(sendResponse, tab) {
  if (!tab) {
    console.error('Unable to get tab with ID:', tabId);
    return;
  }

  var url = new URL(tab.url);
  var baseUrl = url.origin;
  console.log(`Getting cookies for tab URL: ${baseUrl}`);
  chrome.cookies.getAll({url: baseUrl}, handleCookiesGet.bind(null, sendResponse));
}

function handleCookiesGet(sendResponse, cookies) {
  const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join(', ');
  console.log("cookieString " + cookieString)
  var dataURI = 'data:text/plain;charset=utf-8,' + encodeURIComponent(cookieString);

  // Generate a timestamp for the filename
  const timestamp = new Date().getTime();
  // Create a filename with the timestamp
  const filename = `cookie_${timestamp}.txt`;

  // Create a Blob containing the cookie data
   // const blob = new Blob([cookieString], { type: 'text/plain' });
   // var url = URL.createObjectURL(blob);
    chrome.downloads.download({
            url: dataURI,
            filename: filename,
            saveAs: false
          });
    console.log(`Sending cookies back to content script: ${cookieString}`);
}

chrome.runtime.onMessage.addListener(handleMessage);