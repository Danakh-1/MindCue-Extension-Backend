
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

toggleButton.addEventListener("click", () => {
  // if (isRecording) {
  //   toggleRecording();
   
  // } else {
  //   toggleRecording();
  // }
  document.querySelector('video.html5-main-video').pause();
  myalert()
});


// timerrr

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

function onTimesUp() {
  clearInterval(timerInterval);
  // sweetalert 
  myalert2()
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


// Function to start or stop screen recording
const video = document.createElement('video');
video.setAttribute('id','remote')
video.setAttribute('autoplay', '');
video.style.display = 'none';
document.body.appendChild(video)
async function toggleRecording() {
if (!isRecording) {
  try {
    // Start the timer
    startTimer();
    navigator.mediaDevices.getDisplayMedia()
    .then(stream=>{
      if (stream){
        video.srcObject = stream
        captureAndSendFrames()
      }
    })
    .catch(error => {
      console.error('Error accessing media devices.', error);
  });

    isRecording = true;
    console.log("Recording started.");
    toggleButton.textContent = "Stop Recording"; // Update button text
 
  } catch (error) {
    console.error("Error starting recording:", error);
  }
} else {
  toggleButton.textContent = "Start Recording";

  stopRecording();
}
}

function stopRecording() {
  if (isRecording) {
      // Stop each track on the stream
      if (video.srcObject) {
          video.srcObject.getTracks().forEach(track => track.stop());
          video.srcObject = null; // Clear the srcObject
      }

      isRecording = false;
      console.log("Recording stopped.");
      toggleButton.textContent = "Start Recording"; // Update button text

      // Stop and reset the timer
      stopTimer();
  }
}

function captureAndSendFrames() {
  const video = document.getElementById('remote');
  console.log(video)
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const captureInterval = 200; 

  video.addEventListener('loadedmetadata', function() {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
  });

  setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0 && video.videoHeight > 0) {
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
///////////////////////////////////////
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
//////////////////////////////////////////////////
// alert logic for triggers detected
socket.on('predictions', function(data) {
  if (userTrigger.includes(data)) {
    document.querySelector('video.html5-main-video').pause();
    myalert()
  }
});

// nodejs retrive hardware mode
// sweet alert for hardware
socket.on('anomaly_data', function(data) {
console.log(data)
if (data===-1){
  myalert1()
}
});


// alerts 
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
  confirmButtonText: '<html><span class="skip-button-text">Skip the scene</span></html>',
  denyButtonText: `<html><span class="skip-button-text">Dismiss</span></html>`,
  cancelButtonText:'<html><span class="skip-button-text">Play Audio Only</span></html>',
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
      // document.querySelector('video.html5-main-video').currentTime +=7
      document.querySelector('video.html5-main-video').play();
  }else{

    // document.querySelector('video.html5-main-video').className='overlay'
    applyBlackOverlay()
    document.querySelector('video.html5-main-video').play();
// is cancelled --> play audio only
  }})
  
  }

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
)
    
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
  let mytrigger = "Child Abuse"
    function myalert3() {
      Swal.fire({
    title:`<html> \
    <span class="title-class">Wait a minute!</span> <br> \
    <span class="title-class2">The following content may contain material you are not comfortable with</span> <br> \
    <span class="title-class2">The subject identified is: <b>${mytrigger}<b/></span> <br> \
    </html>`,
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: '<html><span class="skip-button-text">Skip the scene</span></html>',
    denyButtonText: `<html><span class="skip-button-text">Dismiss</span></html>`,
    cancelButtonText:'<html><span class="skip-button-text">Play Audio Only</span></html>',
    confirmButtonClass: 'Skip-Button',
    denyButtonClass:'Skip-Button',
    showClass:{
      popup: 'pop-up-class',
      container: 'container-class',
    }

    }
)
      
      }

      function applyBlackOverlay() {
        // Target the active YouTube video
        const videoContainer = document.querySelector('div.html5-video-container'); // Container of the YouTube video
        if (!videoContainer) {
            console.log('No active YouTube video container found.');
            return;
        }
    
        // Create a black overlay div
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'black';
        overlay.style.zIndex = '9999'; // Ensure it covers the video
    
        // Append the overlay to the video container
        videoContainer.appendChild(overlay);
    
        // Optionally, you can remove the overlay after a certain time
        setTimeout(() => {
            videoContainer.removeChild(overlay);
        }, 10000); // Adjust the time as needed (10000 milliseconds = 10 seconds)
    }
    
      
     
      
    
    }

})
