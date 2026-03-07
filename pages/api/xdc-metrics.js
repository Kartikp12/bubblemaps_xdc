import axios from "axios";

export default async function handler(req, res) {
  try {
    const API_KEY = process.env.TOKEN_TERMINAL_API_KEY;

    const response = await axios.get(
      "https://api.tokenterminal.com/v2/projects/xdc/metrics",
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const data = response.data;

    // latest metrics entry
    const latest = data?.data?.[0];

    const fdv = latest?.market_cap_fully_diluted ?? "Not found";

    res.status(200).json({
      success: true,
      fully_diluted_market_cap: fdv,
      raw: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}