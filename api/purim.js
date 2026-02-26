export default async function handler(req, res) {
  try {
    const calendarId = process.env.GCAL_ID;
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!calendarId) {
      return res.status(500).json({ error: "Missing GCAL_ID" });
    }

    if (!apiKey) {
      return res.status(500).json({ error: "Missing GOOGLE_API_KEY" });
    }

    const timeMin = new Date().toISOString();

    const url =
      "https://www.googleapis.com/calendar/v3/calendars/" +
      encodeURIComponent(calendarId) +
      "/events?singleEvents=true&orderBy=startTime&maxResults=250&timeMin=" +
      encodeURIComponent(timeMin) +
      "&key=" +
      encodeURIComponent(apiKey);

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Google API error",
        details: data,
      });
    }

    const items = (data.items || []).map((event) => ({
      id: event.id,
      title: event.summary,
      description: event.description,
      location: event.location,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      link: event.htmlLink,
    }));

    return res.status(200).json({
      count: items.length,
      items,
    });

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      message: err.toString(),
    });
  }
}
