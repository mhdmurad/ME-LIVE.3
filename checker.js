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
