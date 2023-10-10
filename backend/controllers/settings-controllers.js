
// // Display the form page
// const displayForm = (req, res) => {
//     res.sendFile(__dirname + '/../views/index.html');
// };
// // Handle form submission
// const processForm = (req, res) => {
//     const selectedOptions = req.body.options;

//     // Check if selectedOptions is an array (multiple checkboxes) or a single value (one checkbox)
//     if (Array.isArray(selectedOptions)) {
//         console.log('Selected Options:', selectedOptions);
//     } else {
//         console.log('Selected Option:', selectedOptions);
//     }

//     res.send('Form submitted successfully');
// };

// module.exports = {
//     displayForm,
//     processForm,
// };

const Setting = require('../models/Setting');
const displayForm = (req, res) => {
res.sendFile(__dirname + '/../views/settings.html');};

// Controller function to save selected option to MongoDB
async function saveSelectedOption(req, res) {
  try {
    const { selectedOption } = req.body;
    // Create a new Setting document
    const setting = new Setting({ selectedOption }); 
    // Save the setting to MongoDB
    await setting.save();
    res.status(201).json({ message: 'Setting saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

module.exports = {
  saveSelectedOption,
};
