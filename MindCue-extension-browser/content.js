
chrome.storage.sync.get('setting1', function (result) {
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError);
    return;
  }

  // Check if 'setting1' is present in storage
  if ('setting1' in result) {
    const setting1Value = result.setting1;
    console.log('Retrieved setting1 from storage:', setting1Value);
    if(setting1Value){
      let cachedTerms = [];
      const elementsWithTextContentToSearch = "a, p, h1, h2, h3, h4, h5, h6,input";
      const containerElements = "form,span, div, li, th, td, dt, dd";
      
      // Check if text blocking should be enabled
      if (true) {
        // Every time a page is loaded, check our spoil terms and block,
        // after making sure settings allow blocking on this page.
        chrome.storage.sync.get(null, (result) => {
          // Don't manipulate the page if the user hasn't entered any terms
          if (!result.spoilerterms) {
            return;
          }
          enableMutationObserver();
          cachedTerms = result.spoilerterms;
          blockSpoilerContent(document, result.spoilerterms, "***");
        });
      }
      function blockSpoilerContent(rootNode, spoilerTerms, blockText) {
        // Search innerHTML elements first
        let nodes = rootNode.querySelectorAll(elementsWithTextContentToSearch)
        replacenodesWithMatchingText(nodes, spoilerTerms, blockText);
      
        // Now find any container elements that have just text inside them
        nodes = findContainersWithTextInside(rootNode);
        if (nodes && nodes.length !== 0) {
          replacenodesWithMatchingText(nodes, spoilerTerms, blockText);
        }
      }
      
      
      function pluralize(word) {
        // A more robust implementation can be added here
        // This is a simple and not entirely accurate example
        if (word.endsWith('y')) {
          return word.slice(0, -1) + 'ies';
        } else if (word.endsWith('s')) {
          return word + 'es';
        } else {
          return word + 's';
        }
      }
      
      function singularize(word) {
        // Implement singularization logic here
        // This is a simple and not entirely accurate example
        if (word.endsWith('ies')) {
          return word.slice(0, -3) + 'y';
        } else if (word.endsWith('es')) {
          return word.slice(0, -2);
        } else if (word.endsWith('s')) {
          return word.slice(0, -1);
        } else {
          return word;
        }
      }
      
      function compareForSpoiler(node, spoilerTerm) {
        // Implement your logic for comparing node's content with spoilerTerm
        // This function should return true if the content matches, false otherwise
        // Example:
        return node.textContent.toLowerCase().includes(spoilerTerm.toLowerCase());
      }
      
      
      
      function checkIfWordsMatchHyphenated(node, spoilerTerm) {
        const words = spoilerTerm.split(' ');
        const hyphenatedTerm = words.join('-');
        
        if (compareForSpoiler(node, hyphenatedTerm)) {
          return hyphenatedTerm;
        }
        
        return null;
      }
      
      // function replacenodesWithMatchingText(nodes, spoilerTerms, replaceString) {
      //   nodes = Array.from(nodes);
      //   nodes.reverse();
      //   for (const node of nodes) {
      //     for (const spoilerTerm of spoilerTerms) {
      //       const matchedTerm = checkIfWordsMatchHyphenated(node, spoilerTerm);
      //       if (matchedTerm) {
      //         if (!node.parentNode || node.parentNode.nodeName === "BODY") {
      //           // ignore top-most node in DOM to avoid stomping entire DOM
      //           // see issue #16 for more info
      //           continue;
      //         }
      //         const originalText = node.textContent;
      //         const spoilerVariations = [
      //           matchedTerm,
      //           pluralize(matchedTerm),
      //           ...matchedTerm.split(' ')
      //         ];
      //         const spoilerRegex = new RegExp(`\\b(?:${spoilerVariations.join('|')})\\b`, "ig");
      //         const newText = originalText.replace(spoilerRegex, replaceString);
      //         if (originalText !== newText) {
      //           node.className += " hidden-spoiler";
      //           node.innerHTML = newText;
      //           blurNearestChildrenImages(node);
      //         }
      //       }
      //     }
      //   }
      // }
      
      function replacenodesWithMatchingText(nodes, spoilerTerms, replaceString) {
        nodes = Array.from(nodes);
        nodes.reverse();
        for (const node of nodes) {
          for (const spoilerTerm of spoilerTerms) {
            const pluralTerm = pluralize(spoilerTerm);
            const singularTerm = singularize(spoilerTerm);
            const spoilerVariations = [spoilerTerm, pluralTerm, singularTerm];
            const spoilerRegex = new RegExp(`\\b(?:${spoilerVariations.join('|')})\\b`, "ig");
            const newText = node.textContent.replace(spoilerRegex, replaceString);
            if (node.textContent !== newText) {
              node.className += " hidden-spoiler";
              node.textContent = newText;
            }
          }
        }
      }
       
      
      function compareForSpoiler(nodeToCheck, spoilerTerm) {
        const regex = new RegExp(spoilerTerm, "i");
        return regex.test(nodeToCheck.textContent);
      }
      
      function blurNearestChildrenImages(nodeToCheck) {
        // Traverse up a level and look for images, keep going until either
        // an image is found or the top of the DOM is reached.
        // This has a known side effect of blurring ALL images on the page
        // if an early spoiler is found, but ideally will catch the nearest images
        let nextParent = nodeToCheck;
        let childImages;
        const maxIterations = 3;
        let iterationCount = 0;
        do {
          nextParent = nextParent.parentNode;
          if (nextParent && nextParent.nodeName !== "BODY") {
            childImages = nextParent.parentNode.querySelectorAll('img');
          }
          iterationCount++;
        } while (nextParent && childImages.length === 0 && iterationCount < maxIterations)
      
      
      }
      
      function findContainersWithTextInside(targetNode) {
        const containerNodes = targetNode.querySelectorAll(containerElements);
        const emptyNodes = [];
        for (const containerNode of containerNodes) {
          const containerChildren = containerNode.childNodes;
          for (const containerChild of containerChildren) {
            if (containerChild.textContent) {
              emptyNodes.push(containerChild.parentNode);
            }
          }
        }
        return emptyNodes;
      }
      
      
      
      function enableMutationObserver() {
        // Detecting changed content using Mutation Observers
        //
        // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver?redirectlocale=en-US&redirectslug=DOM%2FMutationObserver
        // https://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
        MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
      
        const observer = new MutationObserver((mutations, observer) => {
          // fired when a mutation occurs
          // console.log(mutations, observer);
          for (const mutation of mutations) {
            blockSpoilerContent(mutation.target, cachedTerms, "***");
          }
        });
      
        // configuration of the observer:
        const config = { attributes: true, subtree: true }
        // turn on the observer...unfortunately we target the entire document
        observer.observe(document, config);
        // disconnecting likely won't work since we need to continuously watch
        // observer.disconnect();
      }
    
    
    
    }

   
  } 
});



let TIME_LIMIT = 0;
// Check Chrome storage for the last saved timer value
chrome.storage.local.get('lastsavedTimer', function (result) {
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError);
    return;
  }

  // If the lastsavedTimer is available in storage, use it as the TIME_LIMIT
  if (result.lastsavedTimer) {
    TIME_LIMIT = result.lastsavedTimer;
    console.log('Loaded lastsavedTimer from storage:', TIME_LIMIT);
  } else {
    console.log('No lastsavedTimer found in storage.');
  }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.timer) {
    const { hours, minutes, seconds } = message.timer;

    // Calculate the total time in seconds
    const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;

    // Log the received timer values and the calculated total time to the console
    console.log('Received timer values in content.js:', { hours, minutes, seconds });
    console.log('Total time in seconds:', totalTimeInSeconds);

    // Use the calculated totalTimeInSeconds as the TIME_LIMIT
    TIME_LIMIT = totalTimeInSeconds;

    // Update the lastsavedTimer in Chrome storage
    chrome.storage.local.set({ 'lastsavedTimer': TIME_LIMIT }, function () {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      console.log('Saved lastsavedTimer to storage:', TIME_LIMIT);
    });
  }
});


// function myalert6() {
//   Swal.fire({
//   title:'<html> \
//   <span class="title-class">Hmm... </span> <br> \
//   <span class="title-class2">Are you comfortable with what you are currently browsing?</span>\
//   </html>',
//   showDenyButton: true,
//   confirmButtonText: `<html><span class="skip-button-text">I'm good!</span></html>`,
//   denyButtonText: `<html><span class="skip-button-text">Exit Tab</span></html>`,
//   confirmButtonClass: 'Skip-Button',
//   denyButtonClass:'Skip-Button',
//   showClass:{
//     popup: 'pop-up-class',
//     container: 'container-class',
//   }

//   }
// ).then((result) => {
// alerts.sensorFeedback.triggered = true;
// if (result.isDenied) {
//   chrome.runtime.sendMessage({closeTab: true});
// }else if (result.isConfirmed) {
//   return
// }})
//   }

// myalert6()

