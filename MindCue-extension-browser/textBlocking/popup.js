var storage;
var terms = [];
let selectedTriggerValues = [];
const checkboxContainer = document.getElementById("checkboxContainer");

//add new trigger in db and after inserting fetching all triggers from db and display it page
// dana's draft
// async function addTermToList() {
//   var newTerm = document.getElementById("spoiler-textfield").value;
//   document.getElementById("spoiler-textfield").value = "";

//   if (newTerm == "") {
//     return;
//   }
//   //add new tirgger in db
//   await addTrigger(newTerm);

//   //fetching all trigger from db
//   let triggersData = await getTriggers();

//   //rendring all triggers in page
//   generateTermsListHTML(triggersData?.triggers);
// }
// 2nd draft
// async function addTermToList() {
//   var newTerm = document.getElementById("spoiler-textfield").value;
//   document.getElementById("spoiler-textfield").value = "";

//   if (newTerm == "") {
//     return;
//   }

//   // Add new trigger in db
//   await addTrigger(newTerm);

//   // Fetching all triggers from db
//   let triggersData = await getTriggers();

//   // Rendering all triggers on page
//   generateTermsListHTML(triggersData?.triggers);

//   // Update terms and save to local storage
//   terms = triggersData?.triggers.map(trigger => trigger.name);
//   chrome.storage.sync.set({'spoilerterms': terms}, function() {
//     if (chrome.runtime.error) {
//       console.log("Runtime error.");
//     }
//   });
// }
async function addTermToList() {
  var newTerm = document.getElementById("spoiler-textfield").value;
  document.getElementById("spoiler-textfield").value = "";

  if (newTerm == "") {
    return;
  }

  // Add new trigger in db
  await addTrigger(newTerm);

  // Fetching all triggers from db
  let triggersData = await getTriggers();

  // Rendering all triggers on page
  generateTermsListHTML(triggersData?.triggers);

  // Update terms by excluding wordList items and save to local storage
  terms = triggersData?.triggers
             .map(trigger => trigger.name)
             .filter(term => !wordList.includes(term));

  chrome.storage.sync.set({'spoilerterms': terms}, function() {
    if (chrome.runtime.error) {
      console.log("Runtime error.");
    }
  });
}

//function that takes new Trigger as argument and add that in db

async function addTrigger(newTrigger) {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    userId = "653c17f49950865a46a2a8f7"
  }

  console.log("newTrigger", newTrigger);
  let res = await fetch("http://localhost:5000/api/triggers/addTrigger", {
    method: "POST",
    body: JSON.stringify({
      name: newTrigger,
      userId: userId,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  res = await res.json();
  console.log("newTrigger res ", res?.trigger);
}

//get all Triggers from db
async function getTriggers() {
  const userId = localStorage.getItem("userId");
  let data = await fetch("http://localhost:5000/api/triggers/"+userId);
  data = await data.json();
  return data;
}
// dana's draft
// async function getSpoilerTerms() {
//   //fetching all triggers from db
//   let triggersData = await getTriggers();

//   //rendring all triggers in page
//   generateTermsListHTML(triggersData?.triggers);

//   //generating triggerlist checkboxes using word
//   generateCheckboxes(triggersData?.triggers);
// }
// 2nd draft
// async function getSpoilerTerms() {
//   // Fetching all triggers from db
//   let triggersData = await getTriggers();

//   // Rendering all triggers on page
//   generateTermsListHTML(triggersData?.triggers);

//   // Update terms and save to local storage
//   terms = triggersData?.triggers.map(trigger => trigger.name);
//   chrome.storage.sync.set({'spoilerterms': terms}, function() {
//     if (chrome.runtime.error) {
//       console.log("Runtime error.");
//     }
//   });

//   // Generating trigger list checkboxes using word
//   generateCheckboxes(triggersData?.triggers);
// }
async function getSpoilerTerms() {
  // Fetching all triggers from db
  let triggersData = await getTriggers();

  // Rendering all triggers on page
  generateTermsListHTML(triggersData?.triggers);

  // Update terms by excluding wordList items and save to local storage
  terms = triggersData?.triggers
             .map(trigger => trigger.name)
             .filter(term => !wordList.includes(term));

  chrome.storage.sync.set({'spoilerterms': terms}, function() {
    if (chrome.runtime.error) {
      console.log("Runtime error.");
    }
  });

  // Generating trigger list checkboxes using word
  generateCheckboxes(triggersData?.triggers);
}


function generateTermsListHTML(triggersData) {
  // Start popuplating the list
  // Refresh the list if it exists
  var oldList = document.getElementById("spoiler-list");
  if (oldList) {
    oldList.remove();
  }

  var newList = document.createElement("ul");
  newList.id = "spoiler-list";
  newList.className = "spoiler-list";
  // Find our container for our terms list
  document.getElementById("spoiler-list-container").appendChild(newList);

  // Popuplate our list of terms in reverse order so people see their word added
  for (let i = 0; i < triggersData.length; i++) {
    // console.log('wordList?.includes(triggersData[i]?.name) ',wordList?.includes(triggersData[i]?.name))
    if (!wordList?.includes(triggersData[i]?.name)) {
      newList.appendChild(generateListItem(triggersData[i]));
    }
  }
}

function showEmptyListBlock(show) {
  var emptyTip = document.getElementById("empty-tip");
  if (show) {
    console.log("show ", show);
  } else {
    emptyTip.style.display = "block";
  }
}

function generateListItem(newTrigger) {
  console.log("newTrigger test", wordList);
  // Create our list item
  var listItem = document.createElement("li");
  listItem.className = "spoiler-item";

  // Create our delete button
  var deleteBtn = createDeleteButton(newTrigger);

  // Insert the term into the list
  var newTerm = document.createElement("span");
  newTerm.className = "search-term";
  newTerm.innerHTML = newTrigger?.name;
  listItem.appendChild(newTerm);
  listItem.appendChild(deleteBtn);

  return listItem;
}

// function createDeleteButton(index) {
function createDeleteButton(newTrigger) {
  // Create the button itself
  var deleteBtn = document.createElement("a");
  deleteBtn.title = "Delete";
  deleteBtn.className = "delete-btn";
  // deleteBtn.id = index;
  deleteBtn.id = newTrigger?._id;

  // Create our delete button icon
  var deleteIcon = document.createElement("i");
  deleteIcon.className = "material-icons md-inactive md-24";
  deleteIcon.innerHTML = "highlight_off";
  deleteBtn.appendChild(deleteIcon);

  // Add click event and on which function delete a specific trigger
  deleteBtn.addEventListener("click", async function () {
    let res_data = await fetch(
      `http://localhost:5000/api/triggers/${newTrigger?._id}`,
      { method: "DELETE" }
    );
    res_data = await res_data.json();
    console.log("deleted hogaya hai", res_data);

    let triggersData = await getTriggers();
    console.log("get TriggersData at delete function ", triggersData);
    generateTermsListHTML(triggersData?.triggers);
  });

  return deleteBtn;
}

async function addTermToListEnter(event) {
  console.log("event.keyCode ", event.keyCode);
  if (event.keyCode == 13) {
    await addTermToList();
  }
  if (document.querySelector("#spoiler-textfield").value.length == 0) {
    document.querySelector("#add-btn-key").disabled = true;
  } else {
    document.querySelector("#add-btn-key").disabled = false;
  }
}

// MAIN

async function main() {
  console.log("main");
  await getSpoilerTerms();
}

document.addEventListener("DOMContentLoaded", async function () {
  await main();
  document.querySelector("#spoiler-textfield").focus();
  document
    .querySelector("#add-btn-key")
    .addEventListener("click", addTermToList);
  document
    .querySelector("#spoiler-textfield")
    .addEventListener("keyup", addTermToListEnter);
});

// List of triggers and search
var userId = localStorage.getItem("userId");
let userTrigger = []; // List for only trigger names
let triggerDetails = []; // List for trigger objects with name and ID

if (userId) {
    fetch("http://localhost:5000/api/triggers/" + userId)
    .then(response => response.json())
    .then(triggers => {
        const uniqueNamesSet = new Set();
        triggers["triggers"].forEach(trigger => {
            if (!uniqueNamesSet.has(trigger.name)) {
                uniqueNamesSet.add(trigger.name);
                // Add only name to userTrigger
                userTrigger.push(trigger.name);
                // Add object with name and ID to triggerDetails
                triggerDetails.push({ name: trigger.name, id: trigger._id });
            }
        });
    })
    .catch(error => {
        console.error('Error fetching triggers:', error);
    });
}



const wordList = [
  "spider",
  "wound",
  "gun",
  "cockroach",
  "soldier",
  "accident"
  // Add more words to this list
];
function generateCheckboxes() {
  for (let i = 0; i < wordList.length; i++) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `checkbox${i}`;
    if (userTrigger.includes(wordList[i])) {
      checkbox.checked = true;
    }
    checkbox.addEventListener("change", async function (e) {
      const word = wordList[i];
      if (e.currentTarget.checked) {
        console.log("Checkbox checked for:", word);
        // Call a function to add the trigger
        await addTrigger(word);
        // alert("Trigger added successfully:", word)

      } else {
        console.log("Checkbox unchecked for");
        // alert("Trigger deleted successfully")

        const trigger = triggerDetails.find(t => t.name === word);
        if (trigger) {
          await fetch(`http://localhost:5000/api/triggers/${trigger.id}`, { method: "DELETE" })
            .then(response => {
              if (response.ok) {
                console.log("Trigger deleted successfully");
                const index = triggerDetails.findIndex(t => t.id === trigger.id);
                if (index !== -1) {
                  triggerDetails.splice(index, 1);
                }
                const nameIndex = userTrigger.indexOf(word);
                if (nameIndex !== -1) {
                  userTrigger.splice(nameIndex, 1);
                }
              } else {
                console.error("Failed to delete trigger:", word);
              }
            })
            .catch(error => {
              console.error("Error deleting trigger:", word, error);
            });
        }
      }
    });

    const label = document.createElement("label");
    label.textContent = wordList[i];
    label.htmlFor = `checkbox${i}`;

    const checkboxItem = document.createElement("div");
    checkboxItem.className = "checkbox-item";
    checkboxItem.appendChild(checkbox);
    checkboxItem.appendChild(label);

    checkboxContainer.appendChild(checkboxItem);
  }
}


// const saveTriggerBtn = document.getElementById("add-btn-trig");

// // Add click event and on which function add selected triggers from trigger list
// saveTriggerBtn.addEventListener("click", async function (e) {
//   console.log(
//     "save btn worked",
//     selectedTriggerValues,
//     selectedTriggerValues[0]
//   );

//   if (selectedTriggerValues.length > 0) {
//     for (let i = 0; i < selectedTriggerValues.length; i++) {
//       await addTrigger(selectedTriggerValues[i]);
//     }
//     let  triggersData= await getTriggers();
//     generateTermsListHTML(triggersData?.triggers);
//     alert('Trigger list saved')
//   }

// });







