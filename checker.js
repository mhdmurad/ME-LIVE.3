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
    } catch {
      console.log("Failed:", url);
    }
  }

  return all;
}

function parseM3U(text) {
  const lines = text.split(/\r?\n/);
  const channels = [];
  const added = new Set();

  for (let i = 0; i < lines.length; i++) {

    if (!lines[i].startsWith("#EXTINF")) continue;

    const info = lines[i].trim();
    const url = (lines[i + 1] || "").trim();

    if (
      !url.startsWith("http") ||
      !url.includes(".m3u8")
    ) {
      continue;
    }

    if (added.has(url)) continue;

    added.add(url);

    channels.push({
      info,
      url
    });

    i++;
  }

  return channels;
}

async function checkChannel(channel) {

  try {

    const res = await axios.get(channel.url, {
      timeout: 7000,
      maxRedirects: 5,
      responseType: "text",
      validateStatus: () => true
    });

    if (res.status < 200 || res.status >= 400)
      return null;

    const type =
      (res.headers["content-type"] || "").toLowerCase();

    const body = String(res.data);

    if (
      body.includes("#EXTM3U") ||
      body.includes("#EXTINF") ||
      type.includes("application/vnd.apple.mpegurl") ||
      type.includes("application/x-mpegurl") ||
      type.includes("video/")
    ) {
      console.log("✓", channel.url);
      return channel;
    }

    return null;

  } catch {

    return null;

  }

}

(async () => {

  console.log("Downloading Playlists...");

  const text = await downloadPlaylists();

  const channels = parseM3U(text);

  console.log(`Found ${channels.length} channels`);

  const active = [];

  const batchSize = 30;

  for (let i = 0; i < channels.length; i += batchSize) {

    const batch = channels.slice(i, i + batchSize);

    const result = await Promise.all(
      batch.map(checkChannel)
    );

    active.push(...result.filter(Boolean));

    console.log(
      `Checked ${Math.min(i + batchSize, channels.length)} / ${channels.length}`
    );

  }

  let output = "#EXTM3U\n";

  active.forEach(ch => {
    output += ch.info + "\n";
    output += ch.url + "\n";
  });

  fs.writeFileSync("active.m3u", output, "utf8");

  console.log(`Done! Active Channels: ${active.length}`);

})();
