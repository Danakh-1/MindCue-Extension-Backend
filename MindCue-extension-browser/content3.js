function storeUrl(url) {
    chrome.storage.local.get({urls: []}, function(result) {
        let urls = result.urls;
        urls.push(url);
        chrome.storage.local.set({urls: urls}, function() {
            console.log('URL stored:', url);
        });
    });
}

function getVisitedUrls() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get({urls: []}, function(result) {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
            } else {
                resolve(result.urls);
            }
        });
    });
}

// Function to send the data to a database
function sendDataToDatabase() {

    // Replace with your API endpoint URL
    const apiUrl = 'http://localhost:5000/api/sentReport';

    getVisitedUrls()
        .then(urls => {
            if (urls.length === 0) {
                console.log('No URLs stored.');
                alert('No URLs stored.');
                return;
            }

            let data = urls.join('\n');

            document.getElementById('dataDisplay').innerText = data;

            const file = new Blob([data], { type: 'text/plain' });
            const formData = new FormData();
            formData.append('file', file, 'browsing_data.txt');

            // Uncomment the fetch call to send data
            // fetch(apiUrl, {
            //     method: 'POST',
            //     body: formData
            // })
            // .then(response => response.json())
            // .then(data => {
            //     console.log('Success:', data);
            //     alert('Data sent successfully!');
            // })
            // .catch(error => {
            //     console.error('Error:', error);
            //     alert('Failed to send data');
            // });
        // })
        // .catch(error => {
        //     console.error('Error fetching history:', error);
        //     alert('Failed to retrieve browsing history');
    })
    .catch(error => {
        console.error('Error fetching history:', error);
        alert('Failed to retrieve browsing history');
    });
    console.log(recordingStartTime, recordingEndTime);
}