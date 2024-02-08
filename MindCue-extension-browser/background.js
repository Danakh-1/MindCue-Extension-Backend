
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


// chrome.tabs.onActivated.addListener((activeInfo) => {
//   // Get the active tab
//   chrome.tabs.get(activeInfo.tabId, (tab) => {
//       // Check if the tab is not the new tab page
//       if (tab.url && tab.url !== "chrome://newtab") {
//           // Perform actions with the tab, e.g., logging the URL
//           console.log("Tab URL: " + tab.url);

//           // Additional logic here, if needed
//       }
//   });
// });

// Optional: Listen for updates to tabs, in case the URL changes after the tab is activated
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   // Check if the URL has changed and the tab is not the new tab page
//   if (changeInfo.url && changeInfo.url !== "chrome://newtab") {
//       // Perform actions with the updated tab
//       console.log("Updated Tab URL: " + changeInfo.url);
      
//       // Additional logic here, if needed
//   }
// });
  

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


let browsingData = {
  startTime: null,
  endTime: null,
  urls: [],
  SessionTriggers:[],
  alerts: {} 
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.startTime) {
      browsingData.startTime = request.startTime;
      console.log("Received startTime:", browsingData.startTime);
  }
  if (request.endTime) {
      browsingData.endTime = request.endTime;
      console.log("Received endTime:", browsingData.endTime);
  }
  if (request.subject === 'updateUniqueTriggers') {
    browsingData.SessionTriggers = request.uniqueTriggersLogs;
    console.log("Received uniqueTriggersLogs:", browsingData.SessionTriggers);
  }
  if (request.subject === 'sendAlerts') {  // Handle the new 'updateAlerts' subject
    browsingData.alerts = request.alerts;
    console.log("Received ALERTS:", browsingData.alerts);
  }

});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
      if (tab.url && tab.url !== "chrome://newtab") {
          browsingData.urls.push(tab.url);
          console.log(tab.url);
      }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && changeInfo.url !== "chrome://newtab") {
      browsingData.urls.push(changeInfo.url);
      console.log(changeInfo.url)
  }
});

// function saveBrowsingData() {
//   let fileContent = `Start Time: ${browsingData.startTime}\nEnd Time: ${browsingData.endTime}\nURLs:\n`;
//   browsingData.urls.forEach(url => {
//       fileContent += url + "\n";
//   });

//   let blob = new Blob([fileContent], {type: "text/plain"});
//   console.log(blob);
//   let url = URL.createObjectURL(blob);
//   console.log(url);


//   chrome.downloads.download({
//       url: url,
//       filename: "browsing_data.txt"
//   });
// }

async function saveBrowsingData() {
  // Check if browsingData has valid data
  if (!browsingData.startTime || !browsingData.endTime || !Array.isArray(browsingData.urls)) {
    console.error("Error: Browsing data is not properly initialized.");
    return;
  }

  
  let fileContent = `Start Time: ${browsingData.startTime}\nEnd Time: ${browsingData.endTime}\nURLs:\n`;
  browsingData.urls.forEach(url => {
    fileContent += url + "\n";
  });

  // Append unique triggers to the file content
  if (browsingData.SessionTriggers && browsingData.SessionTriggers.length > 0) {
    fileContent += "\nSession Triggers:\n";
    browsingData.SessionTriggers.forEach(trigger => {
      fileContent += trigger + "\n";
    });
  }

    // Append ALERTS data to the file content
    // if (browsingData.alerts && Object.keys(browsingData.alerts).length > 0) {
    //   fileContent += "\nAlert Names:\n";
    //   for (let key in browsingData.alerts) {
    //     let alert = browsingData.alerts[key];
    //     fileContent += `${alert.name}\n`;  // Append only the name of each alert
    //   }
    // }

    if (browsingData.alerts && Object.keys(browsingData.alerts).length > 0) {
      fileContent += "\nAlert Names:\n";
      for (let key in browsingData.alerts) {
        let alert = browsingData.alerts[key];
        if (alert.triggered) {
          fileContent += `${alert.name}\n`;  // Append the name only if triggered is true
        }
      }
    }
    
  // Create a Blob from the file content
  let blob = new Blob([fileContent], { type: "text/plain" });
  if (!blob) {
    console.error("Error: Failed to create a blob.");
    return;
  }
// let token 
chrome.storage.local.get(['token'], function(result){
  console.log(result.token)
  var myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${result.token}`);
console.log(myHeaders)
var formdata = new FormData();
formdata.append("file", blob, "browsing_data.txt");

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: formdata,
  redirect: 'follow'
};
fetch("http://localhost:5000/api/Tracks/userInput", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
});

//   // Convert the Blob to a Data URL
//   console.log(token, 'is here')
//   var myHeaders = new Headers();
// myHeaders.append("Authorization",  `Bearer ${token}`);
// console.log(myHeaders, 'headerssss')
// var formdata = new FormData();
// formdata.append("file", blob, "browsing_data.txt");

// var requestOptions = {
//   method: 'POST',
//   headers: myHeaders,
//   body: formdata,
//   redirect: 'follow'
// };

// fetch("http://localhost:5000/api/Tracks/userInput", requestOptions)
//   .then(response => response.text())
//   .then(result => console.log(result))
//   .catch(error => console.log('error', error));
  let reader = new FileReader();
  reader.onload = function () {
    let dataUrl = reader.result;

    // Initiate the download using the data URL
    try {
      chrome.downloads.download({
        url: dataUrl,
        filename: "browsing_data.txt"
      }, function (downloadId) {
        if (chrome.runtime.lastError) {
          console.error("Download error:", chrome.runtime.lastError.message);
        } else {
          console.log("Download started, ID:", downloadId);
        }
      });
    } catch (error) {
      console.error("Error in initiating download:", error.message);
    }
  };
  reader.onerror = function (error) {
    console.error("Error in converting blob to data URL:", error);
  };

  // Start the conversion process
  reader.readAsDataURL(blob);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "saveBrowsingData") {
    console.log('user action done for saving')
    console.log("Current state of browsingData:", browsingData); // Add this line for debugging
    saveBrowsingData();
  }
});


async function getMostRecentURL() {
  chrome.storage.local.get('userId', async function(result) {
    const userId = result.userId;
    try {
      if (userId) {
        let data = await fetch("http://localhost:5000/tracks/user/" + userId + "/recent");
        data = await data.json();
        console.log(data); // or do something else with the data
      } else {
        console.error("User ID not found in Chrome storage.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  });
}

getMostRecentURL();


getMostRecentURL();

