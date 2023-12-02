
// side bar things

let isAlertDisplayed = false;
let userId

chrome.runtime.onMessage.addListener((message,sender)=>{
  if (message.from === "popup" && message.query === "userid") {
    // Handle message from popup
    userId = message.userId
    console.log(message.userId);
}
  if (message.from === "settings" && message.query === "inject_side_bar"){
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
    console.log("Recording stopped.");
    toggleButton.textContent = "Start Recording";
    stopTimer();
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
  const captureInterval = 500;

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
let mytrigger 



///////////////////////////////////////////////////////////////////////////////////////////////////

// alert logic for triggers detected
// Global variable to track the number of 'none' responses
let noneResponseCount = 0;
const NONE_RESPONSE_THRESHOLD = 3; // Threshold for 'none' responses
let isAlertDisplayed = false;
let isSkipping = false;
let skipInterval;

socket.on('predictions', function(data) {
  mytrigger = data;
  console.log(data);

  if (data === 'none') {
    noneResponseCount++;
    if (noneResponseCount >= NONE_RESPONSE_THRESHOLD && !isSkipping) {
      delayedResetSkippingState();  // Reset with a delay
    }
  } else {
    noneResponseCount = 0;
    if (userTrigger.includes(data)) {
      document.querySelector('video.html5-main-video').pause();
      myalert3();
    }
  }
});

function delayedResetSkippingState() {
  setTimeout(() => {
    if (noneResponseCount >= NONE_RESPONSE_THRESHOLD && !isSkipping) {
      resetSkippingState();
    }
  }, 5000); // Delay of 2000 milliseconds, adjust as necessary
}

function resetSkippingState() {
  clearTimeout(skipInterval);
  isSkipping = false;
  const videoElement = document.querySelector('video.html5-main-video');
  if (videoElement && videoElement.paused) {
    videoElement.play();
  }
}


  function checkAndSkipScene() {
    const videoElement = document.querySelector('video.html5-main-video');
    if (!videoElement) {
      console.error('Video element not found');
      return;
    }
    let wasPlayingBeforeSkip = false;
    // Determine the amount of time to skip
    const skipAmount = 10; 
    setTimeout(() => {
      console.log('Skipped, new time:', videoElement.currentTime);
  }, 100); // Delay of 100 milliseconds
    // Check if the trigger is still present
    if (userTrigger.includes(mytrigger)) {
      isSkipping = true;  // Set the flag when skipping starts
      wasPlayingBeforeSkip = !videoElement.paused;
      // Skip the scene by advancing the video by a fixed amount
      videoElement.currentTime += skipAmount;
      console.log('Skipped, new time:', videoElement.currentTime);
      // Continue skipping without user interaction as long as the trigger is present
      skipInterval = setTimeout(checkAndSkipScene, 5000);
    } else {
      // If the trigger is no longer present, stop the skipping process
      clearTimeout(skipInterval);
      isSkipping = false;
  
      // Resume video playback if it was playing before
      if (wasPlayingBeforeSkip) {
        videoElement.play();
        console.log('Resuming playback');
      }
    }
  }
  

  function myalert3() {
    if (isAlertDisplayed || isSkipping) {
      return; // Do not display the alert if it is already displayed or if we are currently skipping
    }
  
    isAlertDisplayed = true; // Set the flag to true as the alert will be displayed
  
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
      cancelButtonText:'<span class="skip-button-text">Play Audio Only</span>',
      customClass: {
        confirmButton: 'skip-button', // Replace with your actual class name
        denyButton: 'skip-button',       // Replace with your actual class name
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
        // Dismiss
        document.querySelector('video.html5-main-video').play();
      } else if (result.isConfirmed) {
        // Set isSkipping to true to prevent multiple skips
        isSkipping = true;
        checkAndSkipScene();
        document.querySelector('video.html5-main-video').play();
      } else {
        // Is canceled --> play audio only
        applyBlackOverlay();
      }
    });
  }
  

  
// TRIGGER alerts 
function myalert() {
  if (isAlertDisplayed) {
    return; // Do not display the alert if it is already displayed
  }

  isAlertDisplayed = true; // Set the flag to true as the alert will be displayed

  Swal.fire({
  title:'<html> \
  <span class="title-class">Wait a minute!</span> <br> \
  <span class="title-class2">The following content may contain material you are not comfortable with</span>\
  </html>',
  showDenyButton: true,
  showCancelButton: true,
  confirmButtonText: '<span>Skip the scene</span>',
  denyButtonText: `<span >Dismiss</span>`,
  cancelButtonText:'<span >Play Audio Only</span>',
  customClass: {
    confirmButton: 'skip-button', // Replace with your actual class name
    denyButton: 'skip-button',       // Replace with your actual class name
    cancelButton: 'skip-button'    // Replace with your actual class name
    // Add other custom classes if needed
  },
  showClass:{
    popup: 'pop-up-class',
    container: 'container-class',
  }
  }).then((result) => {
    if (result.isDenied) {
      // dismiss
      document.querySelector('video.html5-main-video').play();
    }else if (result.isConfirmed) {
      // skipp the scene untill the label is not there
      document.querySelector('video.html5-main-video').play();
  }else{

    // document.querySelector('video.html5-main-video').className='overlay'
    applyBlackOverlay();
    document.querySelector('video.html5-main-video').play();
// is cancelled --> play audio only
  }})
  
  }



// nodejs retrive hardware mode
// sweet alert for hardware
socket.on('anomaly', function(data) {
  console.log("Received data:", data[0]);
  if(data[0]===-1){
    myalert1()
  }
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
  if (result.isDenied) {
    document.querySelector('video.html5-main-video').pause();
    myalert4()
  }else if (result.isConfirmed) {
    document.querySelector('video.html5-main-video').play();
}})
    
    }
    function myalert4() {
      if (isAlertDisplayed || isSkipping) {
        return; // Do not display the alert if it is already displayed or if we are currently skipping
      }
    
      isAlertDisplayed = true; // Set the flag to true as the alert will be displayed
    
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
    if (result.isConfirmed) {
          // Set isSkipping to true to prevent multiple skips
          isSkipping = true;
          checkAndSkipScene();
          document.querySelector('video.html5-main-video').play();
        } else {
          // Is canceled --> play audio only
          applyBlackOverlay();
        }
      });
    }
    
 

      function applyBlackOverlay() {
        // Find the video container
        var playerContainer = document.querySelector('#movie_player');
        document.querySelector('.ytp-chrome-bottom').style.zIndex = '9001';
      
        // Check if the blackout div already exists
        var existingBlackout = playerContainer.querySelector('.blackout-div');
        if (!existingBlackout) {
          // Create the black box element
          var blackoutDiv = document.createElement('div');
          blackoutDiv.className = 'blackout-div'; // Assign a class for easy reference
          blackoutDiv.style.position = 'absolute';
          blackoutDiv.style.width = '100%';
          blackoutDiv.style.height = '100%';
          blackoutDiv.style.backgroundColor = 'black';
          blackoutDiv.style.top = 0;
          blackoutDiv.style.left = 0;
          blackoutDiv.style.zIndex = '9000'; // Use a high z-index value to cover the player
      
          // Append the black box to the player container
          // Using 'prepend' to ensure it covers the video player itself
          playerContainer.prepend(blackoutDiv);
        }
      }
    }

})



// // old skipping function checkAndSkipScene() {
//     const videoElement = document.querySelector('video.html5-main-video');
//     if (!videoElement) {
//       console.error('Video element not found');
//       return;
//     }
  
//     // Determine the amount of time to skip
//     const skipAmount = 5; // Example: 5 seconds
  
//     console.log('Current time before skipping:', videoElement.currentTime);
  
//     // Check if the trigger is still present
//     if (userTrigger.includes(mytrigger)) {
//       // Skip the scene by advancing the video by a fixed amount
//       videoElement.currentTime += skipAmount;
//       console.log('Skipped, new time:', videoElement.currentTime);
  
//       // Continue skipping without user interaction as long as the trigger is present
//       skipInterval = setTimeout(checkAndSkipScene, 100);
//     } else {
//       // If the trigger is no longer present, stop the skipping process
//       clearTimeout(skipInterval);
//       isSkipping = false;
  
//       // Resume video playback if it was playing before
//       if (wasPlayingBeforeSkip) {
//         videoElement.play();
//         console.log('Resuming playback');
//       }
//     }
  


// logic inside isconfirmend button inside alert()
    //  // Set isSkipping to true to prevent multiple skips
    //  isSkipping = true;
  
    //  // Start the skip interval
    //  skipInterval = setInterval(checkAndSkipScene, 200);
    //  checkAndSkipScene();