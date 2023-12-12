// // controllers/browsingDataController.js
// const BrowsingData = require('../models/tracksession');

// const saveBrowsingData = async (req, res) => {
//   try {
//     const { startTime, endTime, urls, sessionTriggers, alerts, fileContent } = req.body;

//     const browsingData = new BrowsingData({
//       startTime,
//       endTime,
//       urls,
//       sessionTriggers,
//       alerts,
//       textFile: {
//         data: Buffer.from(fileContent), // Convert the text file content to Buffer
//         contentType: 'text/plain', // Set the content type
//       },
//     });

//     const savedData = await browsingData.save();
//     res.json(savedData);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   saveBrowsingData,
// };
