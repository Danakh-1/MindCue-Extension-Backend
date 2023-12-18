const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: 'public/', // Specify the destination folder
	filename: (req, file, cb) => {
		// Generate a unique filename (you can customize this as needed)
		const fileName = `${Date.now()}-${file.originalname}`;
		cb(null, fileName);
	},
});

const fileFilter = (req, file, cb) => {
	// Check if the file is a text file (you can customize the validation)
	if (file.mimetype === 'text/plain') {
		cb(null, true); // Accept the file
	} else {
		cb(new Error('Invalid file type. Only text files are allowed.'), false);
	}
};

const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
});

module.exports = upload;
