
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
        const elementsWithTextContentToSearch = "a, p, h1, h2, h3, h4, h5, h6";
        const containerElements = "span, div, li, th, td, dt, dd";
        
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
          if (word.endsWith('s')) {
            return word + 'es'; // Example: word ends with "s" -> cats -> cates
          } else {
            return word + 's'; // Example: word doesn't end with "s" -> cat -> cats
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
        
        function replacenodesWithMatchingText(nodes, spoilerTerms, replaceString) {
          nodes = Array.from(nodes);
          nodes.reverse();
          for (const node of nodes) {
            for (const spoilerTerm of spoilerTerms) {
              const matchedTerm = checkIfWordsMatchHyphenated(node, spoilerTerm);
              if (matchedTerm) {
                if (!node.parentNode || node.parentNode.nodeName === "BODY") {
                  // ignore top-most node in DOM to avoid stomping entire DOM
                  // see issue #16 for more info
                  continue;
                }
                const originalText = node.textContent;
                const spoilerVariations = [
                  matchedTerm,
                  pluralize(matchedTerm),
                  ...matchedTerm.split(' ')
                ];
                const spoilerRegex = new RegExp(`\\b(?:${spoilerVariations.join('|')})\\b`, "ig");
                const newText = originalText.replace(spoilerRegex, replaceString);
                if (originalText !== newText) {
                  node.className += " hidden-spoiler";
                  node.innerHTML = newText;
                  blurNearestChildrenImages(node);
                }
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
  
