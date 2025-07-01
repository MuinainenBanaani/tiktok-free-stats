import { TTScraper } from "tiktok-scraper-ts";

const scraper = new TTScraper();

export default async function handler(req, res) {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ error: "Username required" });
  }

  try {
    const user = await scraper.user(username);
    const stats = user.stats;

    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate"); // Cache for 30s
    return res.json({
      followers: stats.followerCount,
      likes: stats.heartCount,
      videos: stats.videoCount,
      views: stats.playCount,
      shares: 0, // Not available in scraper
      saves: 0   // Not available in scraper
    });
  } catch (e) {
    return res.status(404).json({ error: "User not found or scraping failed." });
  }
}
