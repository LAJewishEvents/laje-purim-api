export default async function handler(req, res) {
  try {
    res.status(200).json({
      status: "success",
      message: "Purim API is live"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
