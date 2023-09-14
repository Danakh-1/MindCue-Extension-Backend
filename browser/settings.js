
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
          // close the window of the settings page 
            window.close()
            })
    
            }
})
})



const checkbox = document.getElementById("setting1");
                // Add an event listener to detect changes in the checkbox state
                checkbox.addEventListener("click", function() {
                    // Get the current value of the checkbox
                    const isChecked = checkbox.checked;
                    // Save the checkbox value to Chrome storage
                    chrome.storage.sync.set({ "isChecked": isChecked }, function() {
                      if (chrome.runtime.lastError) {
                        console.error("Error saving checkbox value: " + chrome.runtime.lastError);
                      } else {
                        console.log("Checkbox value saved to Chrome storage.");
                      }
                    })
                  })

document.addEventListener("DOMContentLoaded",()=>{
const checkbox = document.getElementById("setting1");
// Get a reference to the checkbox element
    chrome.tabs.query({active:true , currentWindow:true},(tabs)=>{
        const tab = tabs[0]
        checkbox.addEventListener("click",async ()=>{
            chrome.tabs.sendMessage(
                tabs[0].id,
                {from :"settings",query:"Check_Blocking_enabled"},
                
            )
  })
  })
})

 