const fs = require("fs");
const axios = require("axios");

const PLAYLISTS = [
  "https://raw.githubusercontent.com/mhdmurad/ME-LIVE.3/refs/heads/main/checked-working.m3u",
  "https://raw.githubusercontent.com/mhdmurad/ME-LIVE.3/refs/heads/main/checked-working%20(1).m3u"
];

async function downloadPlaylists() {
  let all = "";

  for (const url of PLAYLISTS) {
    try {
      console.log("Downloading:", url);
      const res = await axios.get(url, { timeout: 15000 });
      all += "\n" + res.data;
    } catch (e) {
      console.log("Failed:", url);
    }
  }

  return all;
}

function parseM3U(text) {
  const lines = text.split(/\r?\n/);
  const channels = [];

  for (let i = 0; i < lines.length; i++) {

    if (!lines[i].startsWith("#EXTINF")) continue;

    const info = lines[i].trim();
    const url = (lines[i + 1] || "").trim();

    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      channels.push({
        info,
        url
      });
    }

    i++;
  }

  return channels;
}

async function checkChannel(url) {

  try {

    const res = await axios({
      url,
      method: "GET",
      timeout: 10000,
      maxRedirects: 5,
      responseType: "text",
      validateStatus: () => true
    });

    if (res.status !== 200) return false;

    const type = (res.headers["content-type"] || "").toLowerCase();

    if (
      type.includes("mpegurl") ||
      type.includes("application/vnd.apple.mpegurl") ||
      type.includes("video") ||
      type.includes("mp2t")
    ) {
      return true;
    }

    if (typeof res.data === "string") {

      if (
        res.data.includes("#EXTM3U") ||
        res.data.includes("#EXTINF") ||
        res.data.includes("#EXT-X-TARGETDURATION") ||
        res.data.includes("#EXT-X-STREAM-INF")
      ) {
        return true;
      }

    }

    return false;

  } catch {

    return false;

  }

}

(async () => {

  console.log("Downloading playlists...");

  const text = await downloadPlaylists();

  const channels = parseM3U(text);

  console.log("Found:", channels.length);

  const active = [];
  const urls = new Set();

  for (const ch of channels) {

    if (urls.has(ch.url)) continue;

    process.stdout.write("Checking: " + ch.url + "\n");

    const ok = await checkChannel(ch.url);

    if (ok) {

      active.push(ch);
      urls.add(ch.url);

      console.log("✓ Active");

    } else {

      console.log("✗ Dead");

    }

  }

  let output = "#EXTM3U\n";

  for (const ch of active) {
    output += ch.info + "\n";
    output += ch.url + "\n";
  }

  fs.writeFileSync("active.m3u", output);

  console.log("Active:", active.length);

})();
