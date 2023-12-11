
// side bar things
// const { tr } = require("date-fns/locale");
let isAlertDisplayed = false;
let userId
let recordingStartTime
let recordingEndTime
let hardware_mode
let DiscloseRadio
let NotDiscloseRadio
let uniqueTriggersLogs = [];
chrome.storage.local.get(['userId'], function(result) {
  console.log('UserId currently is ' + result.userId);
  userId =result.userId
});

chrome.runtime.onMessage.addListener((message,sender)=>{
  if (message.from === "popup" && message.query === "userid") {
    // Handle message from popup
    if(message.userId){
      userId = message.userId
      console.log(message.userId);
    }
}
if (message.from === "settings" && message.query === "inject_side_bar"){
  chrome.storage.sync.get('wsetting', (data) => {
    const wsetting = data.wsetting;
    if (wsetting === 'Disclose') {
      DiscloseRadio = true
    } else {
      DiscloseRadio = false
    }
    
    if (wsetting === 'NoDisclose') {
      NotDiscloseRadio = true
  
    }else{
      NotDiscloseRadio = false
      
    }
  });
  
  chrome.storage.sync.get('setting2', function(result) {
    if ('setting2' in result) {
        hardware_mode = result.setting2;
        console.log('Retrieved setting2 for inject_side_bar:', hardware_mode)
    }
  });

// inject the timer page 
let mainDiv =  document.createElement("div")
mainDiv.setAttribute("id","MindCuecontainer")
mainDiv.innerHTML=`
<div id="mySidebar" class="Msidebar">
<div id = "backArrow">
    <a href="#"><span id="MindCueMaterial-icons">
      arrow_circle_right
    </span></a>
</div>

<div id="MainCont">
<div id="cover"> 
</div>
  <div id="mainform">
        <div id="BrowsingHeader">
          <h2>Browsing <p>in Session</p></h2>
        </div>
  <div id="Timerbox">
      <h2 id="Timer">
      Time Remaining
      </h2>
      <div id="app">
      </div>
    </div>
  </div>
      <div>
      <div id="pickTab">

    </div>
      <div id="modifyTimer">

       </div>
</div>

<div id="main">
  <h2</h2>
</div>

`
// append to dom
document.body.appendChild(mainDiv)

var mini = true;
let icon = document.getElementById("mySidebar")
icon.addEventListener("mouseover",toggleMySideBar)
icon.addEventListener("mouseout",toggleMySideBar)



function toggleMySideBar() {
  if (mini) {

    document.getElementById("mySidebar").style.width = "380px";
    mini = false;
  } else {
   
    document.getElementById("mySidebar").style.width = "85px";

    mini = true;
  }
  
}
let startrecordingdiv = document.getElementById("pickTab")
startrecordingdiv.innerHTML= `

<button id="toggleButton">Pick a Tab</button>

`

let Pausediv = document.getElementById("modifyTimer")
Pausediv.innerHTML= `
<button class="ModifyButtons" id="pauseButton" type="submit">Pause</button>

`
const pauseButton = document.getElementById("pauseButton");

// Add event listeners to the buttons
pauseButton.addEventListener("click",pauseTimer);

let isRecording = false; // Add this variable to track recording state
const toggleButton = document.getElementById("toggleButton");

//  start of the websocket connection to send the frames
let socket
socket = io('http://localhost:9000');

toggleButton.addEventListener('click',function(){
  socket.on('connect', function() {
      console.log('Connected to Flask server');
  });
})
// start and end screen recording
toggleButton.addEventListener("click", () => {
  if (isRecording) {
    toggleRecording();
   
  } else {
    toggleRecording();
  }
});


// timerrr css and html
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
  TIME_LIMIT
)}</span>

</div>
`;


// TIMER LOGIC
function startTimer() {
  timerInterval = setInterval(() => {
      timePassed = timePassed += 1;
      timeLeft = TIME_LIMIT - timePassed;

      if (timeLeft <= 0) {
          onTimesUp();
          timeLeft = 0; // Ensure time does not go negative
      }

      document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
      setCircleDasharray();
      setRemainingPathColor(timeLeft);
  }, 1000);
}
// if the time limit was reached
function onTimesUp() {
  clearInterval(timerInterval);
  // sweetalert  for screen time
  myalert2()
}

 // SCREEN TIME
 function myalert2() {
  alerts.reachedTimeLimit.triggered = true;
  Swal.fire({
  title:'<html> \
  <span class="title-class">Oops!</span> <br> \
  <span class="title-class2">Looks like you exceeded your screen time limit. Edit this through your app settings or take a break</span>\
  </html>',
  showDenyButton: true,
  showCancelButton: true,
  confirmButtonText: '<html><span class="skip-button-text">Continue</span></html>',
  denyButtonText: `<html><span class="skip-button-text"</span>Take a break </html>`,
  cancelButtonText:'<html><span class="skip-button-text">Close browser</span></html>',
  confirmButtonClass: 'Skip-Button',
  cancelButtonClass: 'Skip-Button',
  denyButtonClass:'Skip-Button',
  showClass:{
    popup: 'pop-up-class',
    container: 'container-class',
  }
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      document.querySelector('video.html5-main-video').play();
    } else if (result.isDenied) {
      document.querySelector('video.html5-main-video').pause();
      const toggleButton = document.getElementById("toggleButton");
      toggleButton.textContent = "Start Recording";
      toggleRecording()

    }
    else if (result.isDismissed) {
      document.querySelector('video.html5-main-video').pause();
      // Example: Sending a message to the background script
chrome.runtime.sendMessage({closeTab: true});
      
  }
    })
  
  }

function formatTime(time) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  return formattedTime;
}


function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction;
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} ${FULL_DASH_ARRAY}`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}


let isPaused = false;
function pauseTimer() {
  if (isRecording) {
    if (isPaused) {
      // Resume timer
      startTimer();
      isPaused = false;
      pauseButton.textContent = "Pause";
    } else {
      // Pause timer
      clearInterval(timerInterval);
      isPaused = true;
      pauseButton.textContent = "Resume";
    }
  }
}

function stopTimer() {
  clearInterval(timerInterval);
  timePassed = 0;
  timeLeft = TIME_LIMIT;
  setCircleDasharray();
  setRemainingPathColor(timeLeft);
  document.getElementById("base-timer-label").innerHTML = formatTime(
    timeLeft
  );
  isPaused = false;
}

isRecording = false;
let captureStream = null;
// Function to start or stop screen recording
async function toggleRecording() {
  if (!isRecording) {
    try {
      // Start the timer
      startTimer();

      captureStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      isRecording = true;
      console.log("Recording started.");
      toggleButton.textContent = "Stop Recording";
      captureAndSendFrames(captureStream);
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
    //   // START OF JANNA'S CHANGES
      // Store the current timestamp as the start time of recording
      recordingStartTime = Date.now();

      // Convert the timestamp to a Date object
      var date = new Date(recordingStartTime);

      // Format the date and time into a string
      var startTime = date.toLocaleString();

      console.log(startTime)
      chrome.storage.local.set({ startTime: startTime}, function() {
        console.log('startTime is saved in Chrome local storage.');
    });

    chrome.runtime.sendMessage({ startTime: startTime }, function(response) {
      console.log("Timestamp sent to background script.", response);
    });
    //   // END OF JANNA'S CHANGES
  } else {
    toggleButton.textContent = "Start Recording";
    stopRecording();
  }
}
function stopRecording() {
  if (isRecording && captureStream) {
    captureStream.getTracks().forEach(track => track.stop());
    captureStream = null;
    isRecording = false;

  //   // START OF JANNA'S CHANGES
    // Store the current timestamp as the end time of recording
      recordingEndTime = Date.now();

      // Convert the timestamp to a Date object
      var date = new Date(recordingEndTime);

      // Format the date and time into a string
      var endTime = date.toLocaleString();

      console.log(endTime)
      chrome.storage.local.set({ endTime: endTime}, function() {
        console.log('endTime is saved in Chrome local storage.');
    });

    chrome.runtime.sendMessage({ endTime: endTime }, function(response) {
      console.log("Timestamp sent to background script.", response);
    });

    console.log("Unique Triggers during this session:", uniqueTriggersLogs);
  chrome.runtime.sendMessage({
    from: 'content',
    subject: 'updateUniqueTriggers',
    uniqueTriggersLogs: uniqueTriggersLogs
  });
  chrome.runtime.sendMessage({
    from: 'content',
    subject: 'sendAlerts',
    alerts: alerts
  });
  chrome.runtime.sendMessage({ action: 'saveBrowsingData' });
    console.log("Recording stopped.");
    toggleButton.textContent = "Start Recording";
    stopTimer();
  //    // END OF JANNA'S CHANGES
  }
}
// send the screen recording frames to backend
function captureAndSendFrames(stream) {
  const video = document.createElement('video');
  video.srcObject = stream;
  video.play();
  video.muted = true;
  video.style.display = 'none'; // Hide the video element

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const captureInterval = 1000;

  video.addEventListener('loadedmetadata', function() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  });

  setInterval(() => {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) {
          const reader = new FileReader();
          reader.onloadend = function() {
            const base64data = reader.result;
            socket.emit('send_frame', base64data);
          };
          reader.readAsDataURL(blob);
        }
      }, 'image/jpeg');
    }
  }, captureInterval);
}

function triggerSaveData() {
  chrome.runtime.sendMessage({ action: "saveBrowsingData" });
}


///////////////////////////////////////////////////////////////////////////////////////////////////


// nodejs retrive trigger list
// getting the last user triggers 
let userTrigger = [];
fetch("http://localhost:5000/api/users", {
  headers: {
    "Content-Type": "application/json",
  }
})
.then(response => response.json())
.then(() => {
  return fetch("http://localhost:5000/api/triggers/" + userId);
})
.then(response => response.json())
.then(triggers => {
  const uniqueNamesSet = new Set();
  triggers["triggers"].forEach(trigger => {
    if (!uniqueNamesSet.has(trigger.name)) {
      uniqueNamesSet.add(trigger.name);
      userTrigger.push(trigger.name); // Assuming you only want to store the names
      console.log(userTrigger)
    }
  });
})
.catch(error => {
  console.error('Error:', error);
});
///////////////////////////////////////////////////////////////////////////////////////////////////

// Global variables
let noneResponseCount = 0;
let isAlertDisplayed = false;
let isSkipping = false;
let isAudioOnlyMode = false;
let suppressAlertUntil = 0; // Timestamp until which the alert is suppressed
let skipInterval;
let mytrigger;
let alerts = {
  triggerDetected: {
      name: "Trigger Detected",
      triggered: false,
      message: "A trigger has been detected.",
      // other properties related to triggerDetected
  },
  sensorFeedback: {
      name: "Sensor Feedback",
      triggered: false,
      message: "Feedback received from the sensor.",
      // other properties related to sensorFeedback
  },
  reachedTimeLimit: {
      name: "Reached Time Limit",
      triggered: false,
      message: "You have reached the time limit.",
      // other properties related to reachedTimeLimit
  }
};

console.log('disclose',DiscloseRadio)
console.log('Notdisclose',NotDiscloseRadio)

// // Socket event for receiving predictions
// socket.on('predictions', function(data) {
//   mytrigger = data;
//   console.log(data);
//   if (Date.now() < suppressAlertUntil) {
//     return; // Skip alert if within suppression period
//   }

//   // Handle 'none' predictions
//   if (data === 'none') {
//     noneResponseCount++;
//     if (noneResponseCount >= 3) {
//       removeBlackOverlay();
//       if (isAudioOnlyMode) {
//         isAudioOnlyMode = false;
//       }
//       resetSkippingState();
//     }
//   } else {
//     noneResponseCount = 0;
//     if (userTrigger.includes(data)) {
//       if (!isSkipping && !isAlertDisplayed && !isAudioOnlyMode) {
//         myalert3();
//       } else {
//         // Continue skipping if the trigger is still present
//         isSkipping = true;
//         checkAndSkipScene();
//       }
//     }
//   }
// });
// Socket event for receiving predictions

socket.on('predictions', function(data) {
  mytrigger = data;
  console.log(data);
if (Date.now() < suppressAlertUntil) {
    return;
  }
  // Handle 'none' predictions
  if (data === 'none') {
    noneResponseCount++;
    if (noneResponseCount >= 10) {
      if (isAudioOnlyMode) {
        removeBlackOverlay();
        isAudioOnlyMode = false;
      }
      resetSkippingState();
      noneResponseCount = 0; // Reset count after handling
    }
  } else {
    noneResponseCount = 0; // Reset count as we got a different prediction

    if (userTrigger.includes(data)) {
      if (!isSkipping && !isAlertDisplayed) {
        isSkipping = true;
        // Call the appropriate alert function based on user choice
        if (DiscloseRadio) {
          myalert3(); // Call myalert3() when DiscloseRadio is true
        } else if (NotDiscloseRadio) {
          myalert(); // Call myalert() when NotDiscloseRadio is true
        }
        checkAndSkipScene(); // Start skipping process
      }
    } else {
      // If the current data is not in userTrigger, ensure to stop skipping
      isSkipping = false;
      if (isAudioOnlyMode) {
        removeBlackOverlay();
        isAudioOnlyMode = false;
      }
    }

    // Check if the trigger is unique and append to the list
    if (!uniqueTriggersLogs.includes(data) && data !== 'none') {
      uniqueTriggersLogs.push(data);
      // Save the updated list to Chrome local storage
      chrome.storage.local.set({'uniqueTriggers': uniqueTriggersLogs}, function() {
        if (chrome.runtime.error) {
          console.log("Runtime error.");
        } else {
          console.log("Unique triggers updated in storage.");
        }
      });
    }
  }
});


// Reset skipping state
function resetSkippingState() {
  clearTimeout(skipInterval);
  isSkipping = false;
  const videoElement = document.querySelector('video.html5-main-video');
  if (videoElement && videoElement.paused) {
    videoElement.play();
  }
}


// Check and skip scene
// function checkAndSkipScene() {
//   const videoElement = document.querySelector('video.html5-main-video');
//   if (!videoElement) {
//     console.error('Video element not found');
//     return;
//   }

//   console.log('Current time before skip:', videoElement.currentTime);
//   if (userTrigger.includes(mytrigger)) {
//     // If the trigger is still present, continue skipping
//     const skipAmount = 5; // Time to skip in seconds
//     videoElement.currentTime += skipAmount;
//     console.log('Skipped, new time:', videoElement.currentTime);
//     skipInterval = setTimeout(checkAndSkipScene, 1000); // Continue checking
//   } else {
//     // Stop skipping if the trigger is no longer present
//     clearTimeout(skipInterval);
//     isSkipping = false;
//     if (!videoElement.paused) {
//       videoElement.play();
//       console.log('Resuming playback');
//     }
//   }
// }
function checkAndSkipScene() {
  const videoElement = document.querySelector('video.html5-main-video');
  if (!videoElement) {
    console.error('Video element not found');
    return;
  }

  // Check if the video has ended
  if (videoElement.ended) {
    console.log('Video has ended. Stopping skip process.');
    isSkipping = false;
    clearTimeout(skipInterval); // Clear the interval to stop the skipping process
    return; // Exit the function as the video has ended
  }

  if (isSkipping && mytrigger !== 'none') {
    const skipAmount = 5; // Time to skip in seconds
    // Ensure we do not skip beyond the video's duration
    videoElement.currentTime = Math.min(videoElement.currentTime + skipAmount, videoElement.duration);
    console.log('Skipped, new time:', videoElement.currentTime);
  }

  // Set up the next check
  skipInterval = setTimeout(checkAndSkipScene, 1000);
}

// disclose
// Custom alert for detections
function myalert3() {
  alerts.triggerDetected.triggered = true;
  if (isAlertDisplayed) {
    return; // Do not display the alert if it is already displayed
  }

  // Pause skipping process when showing a new alert
  clearTimeout(skipInterval);
  isSkipping = false;

  document.querySelector('video.html5-main-video').pause();
  applyBlackOverlay()

  isAlertDisplayed = true;
  Swal.fire({
    title: `<html> \
      <span class="title-class">Wait a minute!</span> <br> \
      <span class="title-class2">The following content may contain material you are not comfortable with</span> <br> \
      <span class="title-class2">The subject identified is: <b>${mytrigger}<b/></span> <br> \
    </html>`,
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: '<span class="skip-button-text">Skip the scene</span>',
    denyButtonText: `<span class="skip-button-text">Dismiss</span>`,
    cancelButtonText: '<span class="skip-button-text">Play Audio Only</span>',
    customClass: {
      confirmButton: 'skip-button',
      denyButton: 'skip-button',
      cancelButton: 'skip-button'
    },
    showClass: {
      popup: 'pop-up-class',
      container: 'container-class',
    },
  }).then((result) => {
    isAlertDisplayed = false;

    if (result.isDenied) {
      removeBlackOverlay()
      suppressAlertUntil = Date.now() + 10000; // Suppress further alerts for 10 seconds
      document.querySelector('video.html5-main-video').play();
    } else if (result.isConfirmed) {
      removeBlackOverlay()

      isSkipping = true; // Only set isSkipping to true if user confirms skip
      checkAndSkipScene(); // Trigger skipping only after user confirmation
      document.querySelector('video.html5-main-video').play();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      applyBlackOverlay();
      isAudioOnlyMode = true;
      document.querySelector('video.html5-main-video').play();
    }
  });
}

// Apply a black overlay with blur
function applyBlackOverlay() {
  const videoElement = document.querySelector('video.html5-main-video');
  if (videoElement) {
    videoElement.style.opacity = '0.2';
    videoElement.style.filter = 'blur(12px)';
    videoElement.style.backgroundColor = 'black';
  }
}

function removeBlackOverlay() {
  const videoElement = document.querySelector('video.html5-main-video');
  if (videoElement) {
    videoElement.style.opacity = '';
    videoElement.style.filter = '';
    videoElement.style.backgroundColor = '';
  }
}
// TRIGGER alerts 
// not disclose
function myalert() {
  alerts.triggerDetected.triggered = true;
  if (isAlertDisplayed) {
    return; // Do not display the alert if it is already displayed
  }

  // Pause skipping process when showing a new alert
  clearTimeout(skipInterval);
  isSkipping = false;

  document.querySelector('video.html5-main-video').pause();
  applyBlackOverlay()

  isAlertDisplayed = true;
  Swal.fire({
    title: '<html> \
      <span class="title-class">Wait a minute!</span> <br> \
      <span class="title-class2">The following content may contain material you are not comfortable with</span> \
    </html>',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: '<span class="skip-button-text">Skip the scene</span>',
    denyButtonText: '<span class="skip-button-text">Dismiss</span>',
    cancelButtonText: '<span class="skip-button-text">Play Audio Only</span>',
    customClass: {
      confirmButton: 'skip-button',
      denyButton: 'skip-button',
      cancelButton: 'skip-button'
      // Add other custom classes if needed
    },
    showClass: {
      popup: 'pop-up-class',
      container: 'container-class'
    }
  }).then((result) => {
    isAlertDisplayed = false;

    if (result.isDenied) {
      removeBlackOverlay()
      suppressAlertUntil = Date.now() + 10000; // Suppress further alerts for 10 seconds
      document.querySelector('video.html5-main-video').play();
    } else if (result.isConfirmed) {
      removeBlackOverlay()
      isSkipping = true;
      checkAndSkipScene();
      document.querySelector('video.html5-main-video').play();
    } else {
      applyBlackOverlay();
      isAudioOnlyMode = true;
      document.querySelector('video.html5-main-video').play();
    }
  });
}

let hardware_anomally
// nodejs retrive hardware mode
// sweet alert for hardware
// socket.on('anomaly', function(data) {
//   console.log("Received data:", data[0]);

//   // Retrieve the current state of hardware_mode from Chrome storage
//   chrome.storage.sync.get('setting2', function(result) {
//     if ('setting2' in result) {
//       let hardware_mode = result.setting2;
//       console.log('Retrieved setting2:', hardware_mode);

//       // Process the anomaly only if hardware_mode is not false
//       if (hardware_mode !== false) {
//         if (data[0] === -1 && !userTrigger.includes(mytrigger)) {
//           myalert1();
//         }
//       } else {
//         console.log('Anomaly data received, but not processing due to hardware_mode being false');
//       }
//     }
//   });
// });
socket.on('anomaly', function(data) {
  hardware_anomally = data[0]
  console.log("Received data:", data[0]);
  // Retrieve the current state of hardware_mode from Chrome storage
  chrome.storage.sync.get('setting2', function(result) {
    if ('setting2' in result) {
      let hardware_mode = result.setting2;
      console.log('Retrieved setting2:', hardware_mode);

      // Process the anomaly only if hardware_mode is not false
      if (hardware_mode !== false) {
        if (data[0] === -1 && !userTrigger.includes(mytrigger)) {
       myalert1()
        }
        //   if (DiscloseRadio) {
        //     myalert4(); // Call myalert4() when DiscloseRadio is true
        //   } else if (NotDiscloseRadio) {
        //     myalert5(); // Call myalert5() when NotDiscloseRadio is true
        //   }
        // }
      } else {
        console.log('Anomaly data received, but not processing due to hardware_mode being false');
      }
    }
  });
});

// HARDWARE
  function myalert1() {
    Swal.fire({
    title:'<html> \
    <span class="title-class">Hmm... </span> <br> \
    <span class="title-class2">Are you comfortable with what you are currently browsing?</span>\
    </html>',
    showDenyButton: true,
    confirmButtonText: `<html><span class="skip-button-text">I'm good!</span></html>`,
    denyButtonText: `<html><span class="skip-button-text">I don't want to see this</span></html>`,
    confirmButtonClass: 'Skip-Button',
    denyButtonClass:'Skip-Button',
    showClass:{
      popup: 'pop-up-class',
      container: 'container-class',
    }

    }
).then((result) => {
  alerts.sensorFeedback.triggered = true;
  if (result.isDenied) {
      if (hardware_anomally === -1 && !userTrigger.includes(mytrigger)) {
          if (DiscloseRadio) {
            myalert4(); // Call myalert4() when DiscloseRadio is true
          } else if (NotDiscloseRadio) {
            myalert5(); // Call myalert5() when NotDiscloseRadio is true
          }
        }
    // document.querySelector('video.html5-main-video').pause();
    // myalert4()
  }else if (result.isConfirmed) {
    document.querySelector('video.html5-main-video').play();
}})
    }



// disclose trigger for harware alert
function myalert4() {
  alerts.triggerDetected.triggered = true;
  if (isAlertDisplayed) {
    return; // Do not display the alert if it is already displayed
  }

  // Pause skipping process when showing a new alert
  clearTimeout(skipInterval);
  isSkipping = false;

  document.querySelector('video.html5-main-video').pause();
  applyBlackOverlay()

  isAlertDisplayed = true;
      Swal.fire({
        title: `<html> \
          <span class="title-class">Wait a minute!</span> <br> \
          <span class="title-class2">The following content may contain material you are not comfortable with</span> <br> \
          <span class="title-class2">The subject identified is: <b>${mytrigger}<b/></span> <br> \
        </html>`,
        showCancelButton: true,
        confirmButtonText: '<span class="skip-button-text">Skip the scene</span>',
        cancelButtonText:'<span class="skip-button-text">Play Audio Only</span>',
        customClass: {
          confirmButton: 'skip-button', // Replace with your actual class name
          cancelButton: 'skip-button'    // Replace with your actual class name
          // Add other custom classes if needed
        },
        showClass: {
          popup: 'pop-up-class',
          container: 'container-class',
        },
      }).then((result) => {
        isAlertDisplayed = false;
    
        if (result.isDenied) {
          removeBlackOverlay()
          suppressAlertUntil = Date.now() + 10000; // Suppress further alerts for 10 seconds
          document.querySelector('video.html5-main-video').play();
        } else if (result.isConfirmed) {
          removeBlackOverlay()
          isSkipping = true;
          checkAndSkipScene();
          document.querySelector('video.html5-main-video').play();
        } else {
          applyBlackOverlay();
          isAudioOnlyMode = true;
          document.querySelector('video.html5-main-video').play();
        }
      });
    }

// not disclose for harware alert 
    function myalert5() {
      alerts.triggerDetected.triggered = true;
      if (isAlertDisplayed) {
        return; // Do not display the alert if it is already displayed
      }
    
      // Pause skipping process when showing a new alert
      clearTimeout(skipInterval);
      isSkipping = false;
    
      document.querySelector('video.html5-main-video').pause();
      applyBlackOverlay()
    
      isAlertDisplayed = true;
    
          Swal.fire({
            title: `<html> \
              <span class="title-class">Wait a minute!</span> <br> \
              <span class="title-class2">The following content may contain material you are not comfortable with</span> <br> \
            </html>`,
            showCancelButton: true,
            confirmButtonText: '<span class="skip-button-text">Skip the scene</span>',
            cancelButtonText:'<span class="skip-button-text">Play Audio Only</span>',
            customClass: {
              confirmButton: 'skip-button', // Replace with your actual class name
              cancelButton: 'skip-button'    // Replace with your actual class name
              // Add other custom classes if needed
            },
            showClass: {
              popup: 'pop-up-class',
              container: 'container-class',
            },
          }).then((result) => {
            isAlertDisplayed = false;
        
            if (result.isDenied) {
              removeBlackOverlay()
              suppressAlertUntil = Date.now() + 10000; // Suppress further alerts for 10 seconds
              document.querySelector('video.html5-main-video').play();
            } else if (result.isConfirmed) {
              removeBlackOverlay()
              isSkipping = true;
              checkAndSkipScene();
              document.querySelector('video.html5-main-video').play();
            } else {
              applyBlackOverlay();
              isAudioOnlyMode = true;
              document.querySelector('video.html5-main-video').play();
            }
          });
        }

    }

})
