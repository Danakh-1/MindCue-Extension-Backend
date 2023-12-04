// chrome.tabs.onActivated.addListener((tab) => {
//     console.log(tab);

//     chrome.tabs.get(tab.tabId, (currentTabData) => {
//       if (currentTabData.url !== "chrome://newtab") {
//         chrome.scripting.executeScript({
//           target: { tabId: currentTabData.id },
//           files: ["content.js","content_script.css","settings.js"]
//         });
//         setTimeout(()=>{
//           chrome.tabs.sendMessage(
//             tab.tabId,
//         "hey i have injected you tab : "+ tab.tabId ,
//             (response) => {
//              console.log(response)
//             }
//           );
//         },5000)
//       }

//     });
//   });

chrome.tabs.onActivated.addListener((activeInfo) => {
  // Get the active tab
  chrome.tabs.get(activeInfo.tabId, (tab) => {
      // Check if the tab is not the new tab page
      if (tab.url && tab.url !== "chrome://newtab") {
          // Perform actions with the tab, e.g., logging the URL
          console.log("Tab URL: " + tab.url);

          // Additional logic here, if needed
      }
  });
});

// Optional: Listen for updates to tabs, in case the URL changes after the tab is activated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the URL has changed and the tab is not the new tab page
  if (changeInfo.url && changeInfo.url !== "chrome://newtab") {
      // Perform actions with the updated tab
      console.log("Updated Tab URL: " + changeInfo.url);
      
      // Additional logic here, if needed
  }
});
  

// Send a message to the content script to refresh the page
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const activeTab = tabs[0];
  if (activeTab) {
    chrome.tabs.sendMessage(activeTab.id, { refreshPage: true });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.closeTab) {
    chrome.tabs.remove(sender.tab.id);
  }
});


// chrome.storage.local.get('startTime', function(data) {
//   if (data.startTime) {
//       console.log('Retrieved startTime:', data.startTime);
//       // You can perform additional actions here with the startTime
//   } else {
//       console.log('No startTime found in local storage.');
//   }
// });

// chrome.storage.local.get('endTime', function(data) {
//   if (data.startTime) {
//       console.log('Retrieved startTime:', data.startTime);
//       // You can perform additional actions here with the startTime
//   } else {
//       console.log('No endTime found in local storage.');
//   }
// });

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // Check if the message contains startTime
        if (request.startTime) {
            console.log("Received startTime:", request.startTime);
          
        }

        // Check if the message contains endTime
        if (request.endTime) {
            console.log("Received endTime:", request.endTime);
        }
    }
);
