function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

document.addEventListener("DOMContentLoaded", function() {
  // Add event listeners to the buttons
  document.getElementById("tab1Button").addEventListener("click", function(event) {
    openTab(event, 'Tab1');
  });
  document.getElementById("tab2Button").addEventListener("click", function(event) {
    openTab(event, 'Tab2');
  });

  // Show Tab 1 content by default
  document.getElementById('Tab1').style.display = "block";
  document.getElementById('tab1Button').classList.add('active');
});