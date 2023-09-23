chrome.tabs.onActivated.addListener((tab) => {
    console.log(tab);

    chrome.tabs.get(tab.tabId, (currentTabData) => {
      if (currentTabData.url !== "chrome://newtab") {
        chrome.scripting.executeScript({
          target: { tabId: currentTabData.id },
          files: ["content.js","content_script.css","settings.js"]
        });
        setTimeout(()=>{
          chrome.tabs.sendMessage(
            tab.tabId,
        "hey i have injected you tab : "+ tab.tabId ,
            (response) => {
             console.log(response)
            }
          );
        },5000)
      }

    });
  });
  
// background.js or any other script where you want to trigger the refresh

// Send a message to the content script to refresh the page
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const activeTab = tabs[0];
  if (activeTab) {
    chrome.tabs.sendMessage(activeTab.id, { refreshPage: true });
  }
});
