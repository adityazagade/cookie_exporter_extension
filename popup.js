function onWindowLoad() {
  console.log('on window.onload');

  document.getElementById('exportButton').addEventListener('click', handleExportButtonClick);
}

function handleExportButtonClick() {
  chrome.tabs.query({ active: true, currentWindow: true }, handleTabsQuery);
}

function handleTabsQuery(tabs) {
  if (tabs.length === 0) {
    console.log('No active tab, so no cookies to export');
    return;
  }

  const activeTab = tabs[0];
  const message = {
    action: 'getCookies',
    tabId: activeTab.id
  };

  chrome.runtime.sendMessage(message, handleSendMessageResponse);
}

function handleSendMessageResponse(response) {
  // console.log('Received cookies:', response);
  // cookieString = response.cookies

  // const cookieOutput = document.getElementById('cookieOutput');
  // cookieOutput.textContent = response;
}

window.onload = onWindowLoad;