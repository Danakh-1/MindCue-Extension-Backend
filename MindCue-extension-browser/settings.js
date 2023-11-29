document.addEventListener("DOMContentLoaded", function () {
  const checkboxContainer = document.getElementById("mainform1");
  const radioContainer = document.getElementById("mainform2");

  const selectedCheckboxes = [];
  let selectedRadio = "";

  function handleCheckboxChange(value) {
    if (selectedCheckboxes.includes(value)) {
      // Unselect checkbox
      const index = selectedCheckboxes.indexOf(value);
      if (index !== -1) {
        selectedCheckboxes.splice(index, 1);
      }
    } else {
      // Select checkbox
      selectedCheckboxes.push(value);
    }
  }

  
  function handleRadioChange(value) {
    selectedRadio = value;
  }

  // Event listener for checkbox changes
  checkboxContainer.addEventListener("change", function (event) {
    const checkbox = event.target;
    const value = checkbox.value;
    handleCheckboxChange(value);
    const userId = localStorage.getItem("userId");
    console.log("Selected Checkboxes:", selectedCheckboxes);

  fetch("http://localhost:5000/api/settings/saveGeneralSettings", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, selectedCheckboxes }),
})
.then(response => {
    if (response.status === 200) {
        console.log("Warning settings saved successfully");
        return response.json(); 
    } else {
        console.log("Failed to save warning settings");
        throw new Error("Failed to save warning settings.");
    }
})
.then(data => {
    console.log(data);
})
.catch(error => {
    console.error("An error occurred:", error);
    alert("An error occurred: " + error.message); 
});
});


  // Event listener for radio button changes
  radioContainer.addEventListener("change", function (event) {
    // const radio = event.target;
    // const value = radio.value;
    // handleRadioChange(value);
    // console.log("Selected Radio:", selectedRadio);

    const radio = event.target;
  const value = radio.value;
  handleRadioChange(value); // Capture the selected radio value
  console.log("Selected Radio:", selectedRadio);

  const userId = localStorage.getItem("userId");

  // Make an API call to save the warning settings with the selectedRadio value
  fetch("http://localhost:5000/api/settings/saveWarningSettings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, selectedRadio }), // Include selectedRadio
  })
    .then((response) => {
      if (response.status === 200) {
        console.log("Warning settings saved successfully");
        return response.json();
      } else {
        console.log("Failed to save warning settings");
        throw new Error("Failed to save warning settings");
      }
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("An error occurred:", error);
      alert("An error occurred: " + error.message);
    });
  });

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
