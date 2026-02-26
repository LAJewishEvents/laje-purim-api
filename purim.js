const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    const calendarId = process.env.GCAL_ID;
    const apiKey = process.env.GCAL_API_KEY;

    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&timeMin=${now.toISOString()}&timeMax=${nextWeek.toISOString()}&singleEvents=true&orderBy=startTime`;

    const response = await fetch(url);
    const data = await response.json();

    const purimEvents = (data.items || []).filter(event =>
      event.summary && event.summary.toLowerCase().includes("purim")
    );

    const formatted = purimEvents.map(event => ({
      title: event.summary,
      start: event.start.dateTime || event.start.date,
      location: event.location || "",
      description: event.description || ""
    }));

    res.status(200).json(formatted);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};