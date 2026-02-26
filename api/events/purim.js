export const runtime = "nodejs";

export async function GET() {
  try {
    const calendarId = process.env.GCAL_ID;
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!calendarId || !apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing environment variables" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const timeMin = new Date().toISOString();

    const url =
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}` +
      `/events?singleEvents=true&orderBy=startTime&timeMin=${encodeURIComponent(timeMin)}` +
      `&maxResults=250&key=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      return new Response(
        JSON.stringify({ error: "Google API error", details: text }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({
        count: data.items?.length || 0,
        items: data.items || [],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Server error", message: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
