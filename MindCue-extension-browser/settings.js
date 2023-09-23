
// // appending the sidebar 

document.addEventListener("DOMContentLoaded",()=>{
    const StartButton = document.getElementById("startRecording")
    chrome.tabs.query({active:true , currentWindow:true},(tabs)=>{
        const tab = tabs[0]
        if(tab.url === undefined || tab.url.indexOf('chrome') == 0){
            StartButton.innerHTML="MindCue Can't Access Chrome page"
        }
        else if (tab.url.indexOf('file') === 0) {
            StartButton.innerHTML="MindCue Can't Access local files"}
        else{
            StartButton.addEventListener("click",async ()=>{
            chrome.tabs.sendMessage(
                tabs[0].id,
                {from :"settings",query:"inject_side_bar"},
            )
            // chrome.tabs.query({}, (tabs) => {
            //   for (const tab of tabs) {
            //     chrome.tabs.sendMessage(
            //       tab.id,
            //       { from: "settings", query: "inject_side_bar" }
            //     );
            //   }
            // });
          // close the window of the settings page 
            window.close()
            })
    
            }
})
})


document.addEventListener("DOMContentLoaded", () => {
  const setting1Checkbox = document.getElementById('setting1');

  // Load the checkbox state from Chrome storage and set the initial state
  chrome.storage.sync.get({ setting1: false }, (data) => {
    setting1Checkbox.checked = data.setting1;
  });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (tab.url === undefined || tab.url.startsWith('chrome')) {
      setting1Checkbox.disabled = true;
      setting1Checkbox.innerHTML = "MindCue Can't Access Chrome page";
    } else if (tab.url.startsWith('file')) {
      setting1Checkbox.disabled = true;
      setting1Checkbox.innerHTML = "MindCue Can't Access local files";
    } else {
      setting1Checkbox.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          const activeTab = tabs[0];
          if (activeTab) {
            chrome.tabs.reload(activeTab.id);
          }
        });
        // Save the checkbox state in Chrome storage
        chrome.storage.sync.set({ setting1: setting1Checkbox.checked });
        
        // Send a message to the content script if needed
        chrome.tabs.sendMessage(
          tabs[0].id,
          { from: "settings", query: "text_blocking" }
        );
        // chrome.tabs.query({}, (tabs) => {
        //   for (const tab of tabs) {
        //     chrome.tabs.sendMessage(
        //       tab.id,
        //       { from: "settings", query: "text_blocking" }
        //     );
        //   }
        // });
      });
    }
  });
});
