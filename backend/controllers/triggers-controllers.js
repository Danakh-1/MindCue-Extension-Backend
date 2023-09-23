
// Display the form page
const displayForm = (req, res) => {
    res.sendFile(__dirname + '/../views/index.html');
};
// Handle form submission
const processForm = (req, res) => {
    const selectedOptions = req.body.options;

    // Check if selectedOptions is an array (multiple checkboxes) or a single value (one checkbox)
    if (Array.isArray(selectedOptions)) {
        console.log('Selected Options:', selectedOptions);
    } else {
        console.log('Selected Option:', selectedOptions);
    }

    res.send('Form submitted successfully');
};

module.exports = {
    displayForm,
    processForm,
};