
const tracksession = require('../models/tracksession.js');

app.post('/saveYoutube', async (req, res) => {
  try {
    const { url, description } = req.body;
    const youtubeData = new YoutubeModel({ url, description });
    await youtubeData.save();
    res.status(201).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});