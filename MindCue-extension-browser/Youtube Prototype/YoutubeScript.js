// Get the video element with id="myVideo"
var x = document.getElementById("myVideo");
var myDiv = document.querySelector('.myVideo');
// Attach a timeupdate event to the video element, and execute a function if the current playback position has changed
x.addEventListener("timeupdate", myFunction);
var hasAlertedAt5 = false;
var hasAlertedAt10 = false;
var hasAlertedAt13=false;
var hasAlertedAt15 = false;
var hasAlertedAt40 = false;
var hasAlertedAt43 =false;
var hasAlertedAt45 = false;
var hasAlertedAt48 = false;
var hasAlertedAt50=false;
var hasAlertedAt70 = false;
var hasAlertedAt66 = false;
var hasAlertedAt60 =false;
var hasAlertedAt12=false;


function myFunction() {
  // Display the current position of the video in a p element with id="demo"
  document.getElementById("demo").innerHTML = x.currentTime;
  if (x.currentTime >= 5 &&  x.currentTime <= 8 && !hasAlertedAt5) {
    x.pause()
    myalert();
    hasAlertedAt5 = true;
  }

  if (x.currentTime >= 10 && x.currentTime <= 15 && !hasAlertedAt10) {
    if (myDiv.classList.contains('show-box')) {
      myDiv.classList.toggle('myVideo');
      hasAlertedAt10 = true;
    }
  }

  if(x.currentTime >= 10 &&  x.currentTime <= 12 && !hasAlertedAt10 && !myDiv.classList.contains('show-box')){
    // myDiv.classList.toggle('myVideo')
    x.pause()
    myalertSkip(); //+32
    hasAlertedAt10 = true;
  }

  if(x.currentTime >= 13 &&  x.currentTime <= 15 && !hasAlertedAt12 && myDiv.classList.contains('show-box')){
    document.getElementById('myVideo').className = 'myVideo'
    hasAlertedAt12 = true;
  }

  // if(x.currentTime >= 13 &&  x.currentTime <= 14 && !hasAlertedAt13){
  //   if (myDiv.classList.contains('show-box')) {
  //     document.getElementById('myVideo').className = 'myVideo'
  //     hasAlertedAt13 = true;
  //   }
  // }
  // if(x.currentTime >= 14 &&  x.currentTime <= 15 && !hasAlertedAt13){
  //   x.pause()
  //   myalertSkip3(); //+27
  //   hasAlertedAt13=true;
  // }

  if(x.currentTime >= 15 && x.currentTime <= 20 &&!hasAlertedAt15){
    x.pause()
    myalertSkip2(); //+30
    hasAlertedAt15 = true;
  }

  if (x.currentTime >= 20 && x.currentTime <= 25 && !hasAlertedAt40) {
    x.pause()
    myalert();
    hasAlertedAt40 = true;
  }
  

  if (x.currentTime >= 40 && x.currentTime <= 42 && !hasAlertedAt45) {
    x.pause()
    myalert();
    hasAlertedAt45 = true;
    // x.currentTime+=5
  }

  if (x.currentTime >= 43 && x.currentTime <= 44 && !hasAlertedAt43 && myDiv.classList.contains('show-box')) {
    document.getElementById('myVideo').className = 'myVideo'
    hasAlertedAt43 = true;
  }


  if (x.currentTime >= 45 && x.currentTime <= 47 && !hasAlertedAt48) {
    x.pause()
    myalert();
    hasAlertedAt48 = true;
  }


  if (x.currentTime >= 48 && x.currentTime <= 49 && !hasAlertedAt50) {
    if (myDiv.classList.contains('show-box')) {
      document.getElementById('myVideo').className = 'myVideo'
      hasAlertedAt50 = true;
    }
  }

  if (x.currentTime >= 48 && x.currentTime <= 49 && !hasAlertedAt50 && myDiv.classList.contains('myVideo')) {
    x.pause()
    myalert();
    hasAlertedAt50 = true;
  }

  ///// hardware 
  if (x.currentTime >= 52 && x.currentTime <= 57 && !hasAlertedAt70) {
    x.pause()
    myalert1();
    hasAlertedAt70 = true;
  }
    ///// time limit 
    if (x.currentTime >= 58 && x.currentTime <= 59 && !hasAlertedAt66) {
      x.pause()
      myalert2();
      hasAlertedAt66 = true;
    }

    if (x.currentTime >= 63 && !hasAlertedAt60) {
        x.pause()
        myalert2();
        hasAlertedAt60 = true;
      }

}


    function myalert() {
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
            x.currentTime+=30;
            x.play();
        
        } else if (result.isDenied) {
            x.play();
        }
        else if (result.isDismissed) {
          myDiv.classList.toggle('show-box');
          x.play();
      }
        })
        
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
  
          }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            x.play();
          } else if (result.isDenied) {
              x.currentTime +=7
              x.play();

          }
  }
      )
          
          }
        
  
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
                x.play();
            
            } else if (result.isDenied) {
                x.pause();
            }
            else if (result.isDismissed) {
              x.pause();
              window.close("Youtube.html");
          }
            })
            
            }

function myalertSkip(){
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
        x.currentTime+=32;
        // x.currentTime+=35;
        x.play();
    
    } else if (result.isDenied) {
        x.play();
    }
    else if (result.isDismissed) {
      myDiv.classList.toggle('show-box');
      x.play();
  }
    })
}

function myalertSkip2(){
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
        x.currentTime+=32;
        x.play();
    
    } else if (result.isDenied) {
        x.play();
    }
    else if (result.isDismissed) {
      myDiv.classList.toggle('show-box');
      x.play();
  }
    })
}


function myalertSkip3(){
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
        x.currentTime+=29;
        x.play();
    
    } else if (result.isDenied) {
        x.play();
    }
    else if (result.isDismissed) {
      myDiv.classList.toggle('show-box');
      x.play();
  }
    })
}