const fs = require("fs");
const axios = require("axios");

const PLAYLISTS = [
  "https://raw.githubusercontent.com/sanjoykb/-KB-TV-Playlist/refs/heads/main/Github%20Auto%20Update%20Channel.m3u",
  "https://raw.githubusercontent.com/shouravoo8/Tv-Channels-Network/refs/heads/main/TvChannelsnetwork.m3u",
  "https://raw.githubusercontent.com/shouravoo8/Tv-Channels-Network/refs/heads/main/100%25Freash.m3u"
];

async function downloadPlaylists() {
  let all = "";

  for (const url of PLAYLISTS) {
    try {
      console.log("Downloading:", url);
      const res = await axios.get(url, { timeout: 15000 });
      all += "\n" + res.data;
    } catch (err) {
      console.log("Failed:", url);
    }
  }

  return all;
}
function parseM3U(text) {
  const lines = text.split(/\r?\n/);

  const channels = [];

  for (let i = 0; i < lines.length; i++) {

    if (lines[i].startsWith("#EXTINF")) {

      const info = lines[i].trim();
      const stream = (lines[i + 1] || "").trim();

      if (
        stream &&
        (stream.startsWith("http://") || stream.startsWith("https://"))
      ) {
        channels.push({
          info,
          url: stream
        });
      }

      i++;
    }

  }

  return channels;
}

async function checkChannel(url) {

  try {

    const res = await axios.get(url, {
      timeout: 8000,
      maxRedirects: 5,
      validateStatus: () => true,
      responseType: "stream"
    });

    return res.status >= 200 && res.status < 400;

  } catch {

    return false;

  }

}
(async () => {

  console.log("Downloading playlists...");

  const text = await downloadPlaylists();

  const channels = parseM3U(text);

  console.log(`Found ${channels.length} channels`);

  const active = [];
  const added = new Set();

  for (const ch of channels) {

    // একই URL একবারই রাখবে
    if (added.has(ch.url)) continue;

    process.stdout.write(`Checking: ${ch.url}\n`);

    const ok = await checkChannel(ch.url);

    if (ok) {
      active.push(ch);
      added.add(ch.url);
      console.log("✓ Active");
    } else {
      console.log("✗ Inactive");
    }

  }

  let output = "#EXTM3U\n";

  for (const ch of active) {
    output += ch.info + "\n";
    output += ch.url + "\n";
  }

  fs.writeFileSync("active.m3u", output, "utf8");

  console.log(`Done! Active Channels: ${active.length}`);

})();
