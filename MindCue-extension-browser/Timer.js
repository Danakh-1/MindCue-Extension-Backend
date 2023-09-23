let hoursInput = document.getElementById('hours');
let minutesInput = document.getElementById('minutes');
let secondsInput = document.getElementById('seconds');
let setButton = document.getElementById('set-timer-btn');
let timer;

// Function to save the timer values to Chrome storage and console log them
function saveAndLogTimerValues() {
    let hours = parseInt(hoursInput.value);
    let minutes = parseInt(minutesInput.value);
    let seconds = parseInt(secondsInput.value);

    // Save the timer values to Chrome storage
    chrome.storage.sync.set({ timer: { hours, minutes, seconds } });

    // Log the timer values to the console
    console.log('Timer values saved to storage:', { hours, minutes, seconds });

    // Send a message to the content script with the updated values
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { timer: { hours, minutes, seconds } });
    });
}

// Event listeners for input fields
hoursInput.addEventListener('input', saveAndLogTimerValues);
minutesInput.addEventListener('input', saveAndLogTimerValues);
secondsInput.addEventListener('input', saveAndLogTimerValues);

// Event listener for the "Set" button
setButton.addEventListener('click', function () {
    let hours = parseInt(hoursInput.value);
    let minutes = parseInt(minutesInput.value);
    let seconds = parseInt(secondsInput.value);

    updateTime(hours, minutes, seconds);
    showAlert(hours, minutes, seconds);

    // Save the timer values to Chrome storage
    saveAndLogTimerValues();
});






function showAlert(hours, minutes, seconds) {
    alert(`Time saved: ${formatDoubleDigit(hours)} hours ${formatDoubleDigit(minutes)} minutes ${formatDoubleDigit(seconds)} seconds`);
}

function formatDoubleDigit(num) {
    return num < 10 ? `0${num}` : num.toString();
}

document.addEventListener('DOMContentLoaded', function () {
    // Retrieve the current timer values from storage
    chrome.storage.sync.get(['timer'], function (result) {
      if (result.timer) {
        const { hours, minutes, seconds } = result.timer;
        updateTime(hours, minutes, seconds);
      } else {
        // If no timer values are stored, load the last saved timer
        chrome.storage.sync.get(['lastSavedTimer'], function (lastSavedResult) {
          if (lastSavedResult.lastSavedTimer) {
            const { hours, minutes, seconds } = lastSavedResult.lastSavedTimer;
            updateTime(hours, minutes, seconds);
          } else {
            // If neither timer nor lastSavedTimer values are found, display "00" for all inputs
            updateTime(0, 0, 0);
          }
        });
      }
    });
  });

  function updateTime(hours, minutes, seconds) {
    hoursInput.value = formatDoubleDigit(hours);
    minutesInput.value = formatDoubleDigit(minutes);
    secondsInput.value = formatDoubleDigit(seconds);
}
