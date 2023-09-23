var storage = chrome.storage.sync;
var terms = [];

function addTermToList () {
  // Save it using the Chrome extension storage API.
  var newTerm = document.getElementById('spoiler-textfield').value;
  document.getElementById('spoiler-textfield').value = "";

  if (newTerm == "") {
    return;
  }
  // document.querySelector('#add-btn').disabled = true;

  terms.push(newTerm);
  storage.set({'spoilerterms': terms}, function() {
    if (chrome.runtime.error) {
      console.log("Runtime error.");
    }
    generateTermsListHTML (terms);
  });
}

function removeTermFromList (deleteBtn)
{
  terms.splice (deleteBtn.id, 1);
  storage.set({'spoilerterms': terms}, function() {
    generateTermsListHTML (terms);
  });
}

function getSpoilerTerms() {
  storage.get(['spoilerterms'], function(result) {
      // Nothing to change.
      if (!result.spoilerterms)
        return;

      terms = result.spoilerterms;
      generateTermsListHTML (terms);
    });
}

function generateTermsListHTML(terms) {
  // Refresh the list if it exists
  var oldList = document.getElementById("spoiler-list");
  if (oldList) {
    oldList.remove();
  }

  if (!terms || terms.length == 0) {
    // If it's empty, just add a placeholder tip for the user
    showEmptyListBlock (true);
  } else {

    // Start popuplating the list
    var newList = document.createElement('ul');
    newList.id = "spoiler-list";
    newList.className = "spoiler-list";
    // Find our container for our terms list
    document.getElementById("spoiler-list-container").appendChild (newList);

    // Popuplate our list of terms in reverse order so people see their word added
    for(var i=terms.length-1; i >= 0; i--) {
      newList.appendChild(generateListItem (i));
    }
  }
}

// CONDITIONAL HTML (List, Empty Block, etc.)

function showEmptyListBlock(show) {
  var emptyTip = document.getElementById("empty-tip");
  if (show) {
    pass
  } else {
    emptyTip.style.display = "block";
  }
}

function generateListItem (index) {
    // Create our list item
    var listItem = document.createElement('li');
    listItem.className = "spoiler-item";

    // Create our delete button
    var deleteBtn = createDeleteButton (index);

    // Insert the term into the list
    var newTerm = document.createElement('span');
    newTerm.className = " search-term";
    newTerm.innerHTML = terms[index];
    listItem.appendChild(newTerm);
    listItem.appendChild(deleteBtn);

    return listItem;
}

function createDeleteButton (index) {
  // Create the button itself
  var deleteBtn = document.createElement('a');
  deleteBtn.title = "Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.id = index;

  // Create our delete button icon
  var deleteIcon = document.createElement('i');
  deleteIcon.className = "material-icons md-inactive md-24";
  deleteIcon.innerHTML = "highlight_off";
  deleteBtn.appendChild(deleteIcon);

  // Add our removal event
  deleteBtn.addEventListener('click', function() {
    removeTermFromList(deleteBtn);
  });

  return deleteBtn;
}

function addTermToListEnter () {
  if (event.keyCode == 13) {
    addTermToList ();
  }
  if (document.querySelector('#spoiler-textfield').value.length == 0) {
    document.querySelector('#add-btn').disabled = true;
  } else {
    document.querySelector('#add-btn').disabled = false;
  }
}


// MAIN

function main() {
  getSpoilerTerms ();
}

document.addEventListener('DOMContentLoaded', function () {
  main();
  document.querySelector('#spoiler-textfield').focus ();
  document.querySelector('#add-btn').addEventListener('click', addTermToList);
  document.querySelector('#add-btn').disabled = true;
  document.querySelector('#spoiler-textfield').addEventListener("keyup", addTermToListEnter)
});




// List of triggers and search
const checkboxContainer = document.getElementById('checkboxContainer');
const searchInput = document.getElementById('searchInput');

const wordList = [
  'Child Abuse',
  'War',
  'Drugs',
  'Self-Harm',
  'Child-Abuse',
  'War',
  'Drugs',
    // Add more words to this list
];

generateCheckboxes();

function generateCheckboxes() {
    for (let i = 0; i < wordList.length; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `checkbox${i}`;

        const label = document.createElement('label');
        label.textContent = wordList[i];
        label.htmlFor = `checkbox${i}`;

        const checkboxItem = document.createElement('div');
        checkboxItem.className = 'checkbox-item';
        checkboxItem.appendChild(checkbox);
        checkboxItem.appendChild(label);

        checkboxContainer.appendChild(checkboxItem);
    }
}

// Add event listener for search input changes
searchInput.addEventListener('input', filterCheckboxes);

function filterCheckboxes() {
    const searchTerm = searchInput.value.toLowerCase();
    const checkboxes = checkboxContainer.getElementsByClassName('checkbox-item');

    for (let i = 0; i < checkboxes.length; i++) {
        const label = checkboxes[i].getElementsByTagName('label')[0];
        const labelValue = label.textContent.toLowerCase();

        if (labelValue.includes(searchTerm)) {
            checkboxes[i].style.display = 'flex';
        } else {
            checkboxes[i].style.display = 'none';
        }
    }
}

