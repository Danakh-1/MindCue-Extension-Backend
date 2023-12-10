document.addEventListener("DOMContentLoaded", function () {
  const checkboxContainer = document.getElementById("mainform1");
  const radioContainer = document.getElementById("mainform2");

  const selectedCheckboxes = [];
  let selectedRadio = "";

  // function handleCheckboxChange(value) {
  //   if (selectedCheckboxes.includes(value)) {
  //     // Unselect checkbox
  //     const index = selectedCheckboxes.indexOf(value);
  //     if (index !== -1) {
  //       selectedCheckboxes.splice(index, 1);
  //     }
  //   } else {
  //     // Select checkbox
  //     selectedCheckboxes.push(value);
  //   }
  // }

  
  // function handleRadioChange(value) {
  //   selectedRadio = value;
  // }

  // Event listener for checkbox changes
//   checkboxContainer.addEventListener("change", function (event) {
//     const checkbox = event.target;
//     const value = checkbox.value;
//     handleCheckboxChange(value);
//     const userId = localStorage.getItem("userId");
//     console.log("Selected Checkboxes:", selectedCheckboxes);

//   fetch("http://localhost:5000/api/settings/saveGeneralSettings", {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ userId, selectedCheckboxes }),
// })
// .then(response => {
//     if (response.status === 200) {
//         console.log("Warning settings saved successfully");
//         return response.json(); 
//     } else {
//         console.log("Failed to save warning settings");
//         throw new Error("Failed to save warning settings.");
//     }
// })
// .then(data => {
//     console.log(data);
// })
// .catch(error => {
//     console.error("An error occurred:", error);
//     alert("An error occurred: " + error.message); 
// });
// });


  // Event listener for radio button changes
  // radioContainer.addEventListener("change", function (event) {
  //   // const radio = event.target;
  //   // const value = radio.value;
  //   // handleRadioChange(value);
  //   // console.log("Selected Radio:", selectedRadio);

  //   const radio = event.target;
  // const value = radio.value;
  // handleRadioChange(value); // Capture the selected radio value
  // console.log("Selected Radio:", selectedRadio);

  // const userId = localStorage.getItem("userId");

  // // Make an API call to save the warning settings with the selectedRadio value
  // fetch("http://localhost:5000/api/settings/saveWarningSettings", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ userId, selectedRadio }), // Include selectedRadio
  // })
  //   .then((response) => {
  //     if (response.status === 200) {
  //       console.log("Warning settings saved successfully");
  //       return response.json();
  //     } else {
  //       console.log("Failed to save warning settings");
  //       throw new Error("Failed to save warning settings");
  //     }
  //   })
  //   .then((data) => {
  //     console.log(data);
  //   })
  //   .catch((error) => {
  //     console.error("An error occurred:", error);
  //     alert("An error occurred: " + error.message);
  //   });
  // });

  // Example: Handle the form submission
  const startRecordingBtn = document.getElementById("startRecording");
  startRecordingBtn.addEventListener("click", function () {
    // Example: Send the selected values to the server
    console.log("Sending to server:", {
      selectedCheckboxes,
      selectedRadio,
    });
  });
});



// // appending the sidebar 

document.addEventListener("DOMContentLoaded",()=>{
    const StartButton = document.getElementById("startRecording")
    console.log()
    chrome?.tabs?.query({active:true , currentWindow:true},(tabs)=>{
        const tab = tabs[0]
        if(tab.url === undefined || tab.url.indexOf('chrome') == 0){
            StartButton.innerHTML="MindCue Can't Access Chrome page"
        }
        else if (tab.url.indexOf('file') === 0) {
            StartButton.innerHTML="MindCue Can't Access local files"}
        else{
  
            StartButton.addEventListener("click",async ()=>{
            chrome?.tabs?.sendMessage(
                tabs[0].id,
                {from :"settings",
                query:"inject_side_bar",
                tab_id: tab.id              },
            )
            // send active tab info to inject the warning and predictions 
            window.close()
            })
    
            }
})
})

// text blocking logic

document.addEventListener("DOMContentLoaded", () => {
  const setting1Checkbox = document.getElementById('setting1');

  // Load the checkbox state from Chrome storage and set the initial state
  chrome?.storage?.sync.get({ setting1: false }, (data) => {
    setting1Checkbox.checked = data.setting1;
  });

  chrome?.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (tab.url === undefined || tab.url.startsWith('chrome')) {
      setting1Checkbox.disabled = true;
      setting1Checkbox.innerHTML = "MindCue Can't Access Chrome page";
    } else if (tab.url.startsWith('file')) {
      setting1Checkbox.disabled = true;
      setting1Checkbox.innerHTML = "MindCue Can't Access local files";
    } else {
      setting1Checkbox.addEventListener("click", () => {
        chrome?.tabs?.query({ active: true, currentWindow: true }, function (tabs) {
          const activeTab = tabs[0];
          if (activeTab) {
            chrome?.tabs?.reload(activeTab.id);
          }
        });
        // Save the checkbox state in Chrome storage
        chrome?.storage?.sync?.set({ setting1: setting1Checkbox.checked });
        
        // Send a message to the content script if needed
        chrome?.tabs?.sendMessage(
          tabs[0].id,
          { from: "settings", query: "text_blocking" }
        );
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const setting2Checkbox = document.getElementById('setting2');

  // Load the checkbox states from Chrome storage
  chrome.storage.sync.get({ setting2: false }, (data) => {
    setting2Checkbox.checked = data.setting2;
  });

  // Event listener for changes in setting2Checkbox
  setting2Checkbox.addEventListener("change", () => {
    // Save the new state of setting2Checkbox to Chrome storage
    chrome.storage.sync.set({ setting2: setting2Checkbox.checked }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error setting setting2:', chrome.runtime.lastError);
      }
    });

    // Send a message to the content script or perform other actions for setting2
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        from: "settings", 
        query: "hardware_mode", 
        state: setting2Checkbox.checked
      });
    });
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const radio1 = document.getElementById('radio1');
  const radio2 = document.getElementById('radio2');

  // Load the radio button state from Chrome storage
  chrome.storage.sync.get('wsetting', (data) => {
    if(data.wsetting === 'Disclose') {
      radio1.checked = true;
    } else if(data.wsetting === 'NoDisclose') {
      radio2.checked = true;
    }
  });

  // Event listener for radio1
  radio1.addEventListener("change", () => {
    if(radio1.checked) {
      chrome.storage.sync.set({ wsetting: 'Disclose' }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error setting wsetting to Disclose:', chrome.runtime.lastError);
        }
      });
    }
  });

  // Event listener for radio2
  radio2.addEventListener("change", () => {
    if(radio2.checked) {
      chrome.storage.sync.set({ wsetting: 'NoDisclose' }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error setting wsetting to NoDisclose:', chrome.runtime.lastError);
        }
      });
    }
  });
});


document.getElementById('logout').addEventListener('click', function() {
  // Clear token and user data from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  // Redirect to login page or change UI
  window.location.href = 'popup.html'; // Redirect to login page
  // or handle the logged-out UI state
});



// //listens for a click event on the "Set" button and, when clicked, 
// //sends a POST request to the specified URL 
// const setButton = document.getElementById('set-timer-btn');
// setButton.addEventListener('click', async () => {
//   const hours = parseInt(document.getElementById('hours').value);
//   const minutes = parseInt(document.getElementById('minutes').value);
//   const seconds = parseInt(document.getElementById('seconds').value);

//   const response = await fetch('http://localhost:5000/api/timer/save', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ hours, minutes, seconds }),
//   });

//   if (response.ok) {
//     alert('Timer values saved successfully!');
//   } else {
//     alert('Error saving timer values.');
//   }
// });
