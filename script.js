// ===============================
// ME LIVE v4 - Part 1
// Playlist + Variables + Category
// ===============================

const playlists = [

"https://raw.githubusercontent.com/IPTVFlixBD/OopsTv/refs/heads/main/all-sports.m3u",

"https://raw.githubusercontent.com/abusaeeidx/Mrgify-BDIX-IPTV/refs/heads/main/playlist.m3u",

"https://raw.githubusercontent.com/abusaeeidx/Mrgify-BDIX-IPTV/refs/heads/main/playlist.m3u"

];
let allChannels = [];
let currentCategory = "All";
let categories = [];

// Loading
document.getElementById("channels").innerHTML =
"<h3 style='color:white;padding:20px'>Loading...</h3>";


// ===============================
// AUTO CATEGORY
// ===============================

function getCategory(name){

    name = name.toLowerCase();

    // News
    if(
        name.includes("ekattor") ||
        name.includes("somoy") ||
        name.includes("jamuna") ||
        name.includes("independent") ||
        name.includes("channel 24") ||
        name.includes("news24") ||
        name.includes("dbc") ||
        name.includes("atn news") ||
        name.includes("banglavision") ||
        name.includes("rtv") ||
        name.includes("ntv")
    ){
        return "News";
    }

    // Sports
    if(
        name.includes("sports") ||
        name.includes("t sports") ||
        name.includes("tsports") ||
        name.includes("star sports") ||
        name.includes("sony sports") ||
        name.includes("ten") ||
        name.includes("bein") ||
        name.includes("espn") ||
        name.includes("eurosport")
    ){
        return "Sports";
    }

    // Movies
    if(
        name.includes("movie") ||
        name.includes("movies") ||
        name.includes("cinema") ||
        name.includes("sony max") ||
        name.includes("star movies") ||
        name.includes("zee cinema")
    ){
        return "Movies";
    }

    // Entertainment
    if(
        name.includes("zee") ||
        name.includes("star jalsha") ||
        name.includes("colors") ||
        name.includes("sony") ||
        name.includes("channel i") ||
        name.includes("gazi") ||
        name.includes("nagorik")
    ){
        return "Entertainment";
    }

    // Kids
    if(
        name.includes("cartoon") ||
        name.includes("pogo") ||
        name.includes("nick") ||
        name.includes("disney")
    ){
        return "Kids";
    }

    // Music
    if(
        name.includes("music") ||
        name.includes("9xm") ||
        name.includes("mtv")
    ){
        return "Music";
    }

    return "Others";
}
// ===============================
// LOAD PLAYLIST
// ===============================

Promise.all(
    playlists.map(url =>
        fetch(url).then(r => r.text())
    )
)
.then(results => {

    const data = results.join("\n");

    // এখান থেকে আপনার আগের parser কোড থাকবে

});
.then(r => r.text())
.then(data => {

    let lines = data.split("\n");
    let channels = [];

    for (let i = 0; i < lines.length; i++) {

        if (!lines[i].startsWith("#EXTINF")) continue;

        let ext = lines[i];

        // Channel Name
        let name = ext.split(",")[1]?.trim() || "Unknown";

        // Playlist Logo Only
        let logoMatch = ext.match(/tvg-logo="(.*?)"/);

        let logo = "";

        if (
            logoMatch &&
            logoMatch[1] &&
            logoMatch[1].trim() !== ""
        ) {
            logo = logoMatch[1];
        }

        // Stream URL
        let url = (lines[i + 1] || "").trim();

        if (!url || url.startsWith("#")) continue;

        // Category
        let category = getCategory(name);

        channels.push({
            name: name,
            logo: logo,
            url: url,
            category: category
        });

        if (!categories.includes(category)) {
            categories.push(category);
        }

    }

    // =========================
    // CUSTOM CHANNELS
    // =========================

    const customChannels = [

        {
            name: "PTV Sports",
            logo: "",
            url: "http://172.20.21.22/live/skyfeed1015/index.m3u8"
        },

        {
            name: "Somoy TV",
            logo: "",
            url: "https://live.thebosstv.com:30443/dwlive/Somoy-TV/chunks.m3u8"
        },

        {
            name: "Somoy TV 2",
            logo: "",
            url: "https://live.thebosstv.com:30443/dwlive/Somoy-TV/playlist.m3u8"
        },

        {
            name: "Bioscope FIFA",
            logo: "",
            url: "https://sm-monirul.top/ott/bioscope/index.m3u8"
        },

        {
            name: "DAZN 1",
            logo: "",
            url: "https://znty.dyndns.org:5010/hls/eleven1.m3u8"
        },

        {
            name: "Caze TV BR",
            logo: "",
            url: "https://dfr80qz435crc.cloudfront.net/MNOP/Amagi/Caze/Caze_TV_BR/1080p-vtt/index.m3u8"
        },

        {
            name: "beIN Sport",
            logo: "",
            url: "https://1nyaler.streamhostingcdn.top/stream/23/index.m3u8"
        }

    ];

    customChannels.forEach(ch => {

        ch.category = getCategory(ch.name);

        channels.push(ch);

        if (!categories.includes(ch.category)) {
            categories.push(ch.category);
        }

    });

    allChannels = channels;

    categories.sort();

    renderCategories();

    const savedCategory = localStorage.getItem("selectedCategory");

    if (savedCategory && savedCategory !== "All") {

        currentCategory = savedCategory;

        const btn = [...document.querySelectorAll(".cat-btn")]
            .find(b => b.textContent.trim() === savedCategory);

        filterCategory(savedCategory, btn);

    } else {

        showChannels(allChannels);

    }

})
.catch(() => {

    document.getElementById("channels").innerHTML =
    "<h3 style='color:red;padding:20px'>Failed to load playlist</h3>";

});
// ===============================
// CATEGORY BAR
// ===============================

function renderCategories(){

    let html = `
    <div id="categoryBar" class="category-bar">
    `;

    html += `
    <button class="cat-btn active"
    onclick="filterCategory('All',this)">
    All
    </button>
    `;

    categories.forEach(cat=>{

        html += `
        <button class="cat-btn"
        onclick="filterCategory('${cat}',this)">
        ${cat}
        </button>
        `;

    });

    html += `</div>`;
    html += `<div id="channelList"></div>`;

    document.getElementById("channels").innerHTML = html;

}


// ===============================
// CATEGORY FILTER
// ===============================

function filterCategory(category,btn){

    currentCategory = category;

    localStorage.setItem("selectedCategory",category);

    document.querySelectorAll(".cat-btn")
    .forEach(item=>item.classList.remove("active"));

    if(btn){
        btn.classList.add("active");
    }

    if(category==="All"){

        showChannels(allChannels);
        return;

    }

    const filtered =
    allChannels.filter(ch=>ch.category===category);

    showChannels(filtered);

}


// ===============================
// SHOW CHANNELS
// ===============================

function showChannels(channels){

    let html = `<div class="channel-grid">`;

    channels.forEach(ch=>{

        html += `
        <div class="channel-card"
        onclick="openPlayer('${encodeURIComponent(ch.url)}','${encodeURIComponent(ch.name)}')">

            <img
            class="channel-logo"
            src="${ch.logo}"
            loading="lazy"
            referrerpolicy="no-referrer"
            onerror="this.style.display='none';">

            <div class="channel-name">
                ${ch.name}
            </div>

        </div>
        `;

    });

    html += `</div>`;

    document.getElementById("channelList").innerHTML = html;

}
// ===============================
// PLAYER
// ===============================

function openPlayer(url, name){

    window.location.href =
        "player.html?url=" + url + "&name=" + name;

}


// ===============================
// SEARCH
// ===============================

document.getElementById("searchBox")
.addEventListener("keyup", function(){

    let input = this.value.toLowerCase().trim();

    let list = allChannels;

    // Category Filter
    if(currentCategory !== "All"){

        list = list.filter(ch =>
            ch.category === currentCategory
        );

    }

    // Search
    if(input !== ""){

        list = list.filter(ch =>
            ch.name.toLowerCase().includes(input)
        );

    }

    // A-Z Sort
    list.sort((a,b)=>
        a.name.localeCompare(b.name)
    );

    showChannels(list);

});


// ===============================
// REMOVE DUPLICATE CHANNELS
// ===============================

function removeDuplicateChannels(){

    const map = new Map();

    allChannels.forEach(ch=>{

        const key = ch.name.toLowerCase().trim();

        if(!map.has(key)){
            map.set(key,ch);
        }

    });

    allChannels = [...map.values()];

}


// ===============================
// SORT CHANNELS
// ===============================

function sortChannels(){

    allChannels.sort((a,b)=>
        a.name.localeCompare(b.name)
    );

}


// ===============================
// INITIALIZE
// ===============================

setTimeout(()=>{

    removeDuplicateChannels();

    sortChannels();

    showChannels(allChannels);

},100);
