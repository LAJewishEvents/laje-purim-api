export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  try {
    const calendarId = process.env.GCAL_ID;
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!calendarId || !apiKey) {
      return res.status(500).json({
        error: "Missing environment variables"
      });
    }

    const timeMin = new Date().toISOString();

    const url =
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}` +
      `/events?singleEvents=true&orderBy=startTime&timeMin=${encodeURIComponent(timeMin)}` +
      `&key=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({
        error: "Google API error",
        details: text
      });
    }

    const data = await response.json();

    return res.status(200).json({
      count: data.items?.length || 0,
      items: data.items || []
    });

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      message: err.message
    });
  }
}
