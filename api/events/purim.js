export const config = { runtime: "nodejs" };

export default async function handler(req, res) {
  try {
    const calendarId = process.env.GCAL_ID;
    const apiKey = process.env.GOOGLE_API_KEY;

    res.setHeader("Access-Control-Allow-Origin", "*");

    if (!calendarId || !apiKey) {
      return res.status(500).json({
        error: "Missing environment variables",
      });
    }

    const timeMin = new Date().toISOString();

    const url =
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}` +
      `/events?singleEvents=true&orderBy=startTime&maxResults=250&timeMin=${encodeURIComponent(timeMin)}` +
      `&key=${encodeURIComponent(apiKey)}`;

    const r = await fetch(url);
    const data = await r.json();

    return res.status(200).json({
      count: data.items?.length || 0,
      items: data.items || [],
    });
  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      message: String(err),
    });
  }
}
