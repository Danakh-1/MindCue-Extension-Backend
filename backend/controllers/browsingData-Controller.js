const fs = require('fs');
const TrackSession = require('../models/tracksession');
const PDFDocument = require('pdfkit');

 //Reads the content of a text file uploaded through a request.
exports.saveUserInput = async (req, res) => {
	// Read the text file and store the content in a variable
	const content = fs.readFileSync(req.file.path, 'utf8');

	const variableRegex = /([a-zA-Z\s]+):\s*(.+)/g;
	let match;
	const variables = {};

	// from URLs to at the end of the text file save in array
	if (content.includes('URLs:')) {
		variables.URLs = content
			.split('URLs:')[1]
			.trim()
			.split('\n')
			.map(url => url.trim());
	}

	while ((match = variableRegex.exec(content)) !== null) {
		const variableName = match[1].replace(/\s+/g, ''); // Remove spaces from variable name except URLs
		if (variableName !== 'URLs') {
			const variableValue = match[2].trim();
			variables[variableName] = variableValue;
		}
	}

	// change time to mongo format
	variables.StartTime = new Date(variables.StartTime);
	variables.EndTime = new Date(variables.EndTime);

	// Access user information from req.user
	const userID = req?.user?.userId;
    const file = req?.files?.file;
	try {
		const trackSession = new TrackSession({
			user: userID,
			timeStart: variables.StartTime,
			timeEnd: variables.EndTime,
			urls: variables.URLs,
			file: req.file.path,
		});
		await trackSession.save();

		res.status(200).json({ message: 'User input saved successfully.' });
	} catch (error) {
		console.error('Error saving user input:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

//Retrieves a user session from the database based on the user ID.
exports.getUserInput = async (req, res) => {
	try {
		const pdfFilePath = 'public/trackSession.pdf';
		const userID = req.user.userId;
		const trackSession = await TrackSession.findOne({ user: userID });

		const textContent = fs.readFileSync(trackSession.file, 'utf-8');

		// Create a new PDF document for saving to the file
		const fileDoc = new PDFDocument();
		const fileStream = fs.createWriteStream(pdfFilePath);
		fileDoc.pipe(fileStream);
		fileDoc.font('Helvetica').fontSize(12).text(textContent, 50, 50);
		fileDoc.end();

		// Log a message when the PDF is generated
		fileStream.on('finish', () => {
			console.log(`PDF saved to: ${pdfFilePath}`);
		});

		// Create a new PDF document for sending as a response
		const responseDoc = new PDFDocument();

		// Set response headers for PDF
		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader(
			'Content-Disposition',
			'attachment; filename=trackSession.pdf'
		);

		// Pipe the PDF document directly to the HTTP response
		responseDoc.pipe(res);
		responseDoc.font('Helvetica').fontSize(12).text(textContent, 50, 50);
		responseDoc.end();
	} catch (error) {
		console.error('Error getting user input:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
