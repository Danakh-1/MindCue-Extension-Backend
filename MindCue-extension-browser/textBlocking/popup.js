var storage;
var terms = [];
let selectedTriggerValues = [];
const checkboxContainer = document.getElementById("checkboxContainer");

//add new trigger in db and after inserting fetching all triggers from db and display it page
async function addTermToList() {
  var newTerm = document.getElementById("spoiler-textfield").value;
  document.getElementById("spoiler-textfield").value = "";

  if (newTerm == "") {
    return;
  }
  //add new tirgger in db
  await addTrigger(newTerm);

  //fetching all trigger from db
  let triggersData = await getTriggers();

  //rendring all triggers in page
  generateTermsListHTML(triggersData?.triggers);
}


//function that takes new Trigger as argument and add that in db
async function addTrigger(newTrigger) {
  console.log("newTrigger ", newTrigger);
  let res = await fetch("http://localhost:5000/api/triggers/addTrigger", {
    method: "POST",
    body: JSON.stringify({
      name: newTrigger,
      userId: "653c17f49950865a46a2a8f7",
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
  let data = await fetch("http://localhost:5000/api/triggers");
  data = await data.json();
  return data;
}


async function getSpoilerTerms() {
  //fetching all triggers from db
  let triggersData = await getTriggers();

  //rendring all triggers in page
  generateTermsListHTML(triggersData?.triggers);

  //generating triggerlist checkboxes using word
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
    if(!wordList?.includes(triggersData[i]?.name)){
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
  console.log('newTrigger ',wordList)
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
const searchInput = document.getElementById("searchInput");

const wordList = [
  "Child Abuse",
  "War",
  "Drugs",
  "Self-Harm",
  // Add more words to this list
];


//generating tigger lsit secion checkboxes with labels from hardcoded values of wordList array 
function generateCheckboxes() {
  for (let i = 0; i < wordList.length; i++) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `checkbox${i}`;
    checkbox.addEventListener("change", async function (e) {
      if (e.currentTarget.checked) {
        console.log("e.currentTarget.checked ", true, wordList[i]);
        selectedTriggerValues.push(wordList[i]); 
      } else {
        console.log(
          "e.currentTarget.checked is not checked",
          e.currentTarget.checked
        );

         var index = selectedTriggerValues.indexOf(wordList[i]);
         if (index !== -1) {
          console.log('iindex ',index)
             selectedTriggerValues.splice(index, 1);
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

// Add event listener for search input changes
searchInput.addEventListener("input", filterCheckboxes);

function filterCheckboxes() {
  const searchTerm = searchInput.value.toLowerCase();
  const checkboxes = checkboxContainer.getElementsByClassName("checkbox-item");

  for (let i = 0; i < checkboxes.length; i++) {
    const label = checkboxes[i].getElementsByTagName("label")[0];
    const labelValue = label.textContent.toLowerCase();
    console.log("labelValue ", labelValue);
    if (labelValue.includes(searchTerm)) {
      checkboxes[i].style.display = "flex";
    } else {
      checkboxes[i].style.display = "none";
    }
  }
}

const saveTriggerBtn = document.getElementById("add-btn-trig");

// Add click event and on which function add selected triggers from trigger list
saveTriggerBtn.addEventListener("click", async function (e) {
  console.log(
    "save btn worked",
    selectedTriggerValues,
    selectedTriggerValues[0]
  );
  
  if(selectedTriggerValues.length > 0) {
    for(let i = 0; i < selectedTriggerValues.length; i++) {
      await addTrigger(selectedTriggerValues[i]);
    }
    let triggersData = await getTriggers();
    generateTermsListHTML(triggersData?.triggers);
  }
});
