// ===============================
// ME LIVE v4 - Part 1
// Playlist + Variables + Category + Auto Logo
// ===============================

const playlist =
"https://raw.githubusercontent.com/abusaeeidx/Mrgify-BDIX-IPTV/refs/heads/main/playlist.m3u";

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

    if(
        name.includes("cartoon") ||
        name.includes("pogo") ||
        name.includes("nick") ||
        name.includes("disney")
    ){
        return "Kids";
    }

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
// AUTO REAL TV LOGO
// ===============================

const TV_LOGOS = {

    "ATN Bangla":"https://i.imgur.com/V4x7j5w.png",
    "ATN News":"https://i.imgur.com/5YgVY7R.png",
    "Somoy TV":"https://i.imgur.com/Jq2d8x5.png",
    "Somoy tv":"https://i.imgur.com/Jq2d8x5.png",
    "Jamuna TV":"https://i.imgur.com/OfA5rQx.png",
    "Channel i":"https://i.imgur.com/oKQm5PB.png",
    "GTV":"https://i.imgur.com/Lt1To4d.png",
    "RTV":"https://i.imgur.com/0jP1LhS.png",
    "NTV":"https://i.imgur.com/LfA7WgI.png",
    "Independent TV":"https://i.imgur.com/FoK3AqP.png",
    "BanglaVision":"https://i.imgur.com/oP8z6Qm.png",

    "Star Jalsha":"https://i.imgur.com/V7CzvAQ.png",
    "Zee Bangla":"https://i.imgur.com/JWl4qfQ.png",
    "Colors Bangla":"https://i.imgur.com/VgKc2sP.png",

    "Star Sports":"https://i.imgur.com/J0Yo9m5.png",
    "T Sports":"https://i.imgur.com/FQjzY9d.png",
    "PTV Sports":"https://i.imgur.com/MhSmMcb.png",
    "beIN Sport":"https://i.imgur.com/ck9vAJh.png",
    "beIN Sports":"https://i.imgur.com/ck9vAJh.png",

    "Sony Sports 1":"https://i.imgur.com/q4ULY6F.png",
    "Sony Sports 2":"https://i.imgur.com/q4ULY6F.png",
    "Sony Sports 3":"https://i.imgur.com/q4ULY6F.png",

    "Cartoon Network":"https://i.imgur.com/7E9O0Zx.png",
    "Nick":"https://i.imgur.com/3XvL1yK.png",
    "Pogo":"https://i.imgur.com/KnNn8hQ.png",
    "Disney":"https://i.imgur.com/yPQXGGu.png"

};


// ===============================
// GET LOGO
// ===============================

function autoLogo(name){

    let key = Object.keys(TV_LOGOS).find(item =>
        item.toLowerCase() === name.toLowerCase()
    );

    if(key){
        return TV_LOGOS[key];
    }

    return "https://via.placeholder.com/120x120/111827/FFFFFF?text=TV";
}
// ===============================
// LOAD PLAYLIST
// ===============================

fetch(playlist)
.then(r => r.text())
.then(data => {

    let lines = data.split("\n");
    let channels = [];

    for (let i = 0; i < lines.length; i++) {

        if (!lines[i].startsWith("#EXTINF")) continue;

        let ext = lines[i];

        // Channel Name
        let name = ext.split(",")[1]?.trim() || "Unknown";

        // tvg-logo
        let logoMatch = ext.match(/tvg-logo="(.*?)"/);

        let logo = "";

        if (
            logoMatch &&
            logoMatch[1] &&
            logoMatch[1].trim() !== ""
        ) {
            logo = logoMatch[1];
        } else {
            logo = autoLogo(name);
        }

        // Stream URL
        let url = (lines[i + 1] || "").trim();

        if (!url || url.startsWith("#")) continue;

        // Category
        let category = getCategory(name);

        channels.push({

            name,
            logo,
            url,
            category

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
            logo: autoLogo("PTV Sports"),
            url: "http://172.20.21.22/live/skyfeed1015/index.m3u8"
        },

        {
            name: "Somoy TV",
            logo: autoLogo("Somoy TV"),
            url: "https://live.thebosstv.com:30443/dwlive/Somoy-TV/chunks.m3u8"
        },

        {
            name: "Somoy TV 2",
            logo: autoLogo("Somoy TV"),
            url: "https://live.thebosstv.com:30443/dwlive/Somoy-TV/playlist.m3u8"
        },

        {
            name: "Bioscope FIFA",
            logo: autoLogo("FIFA"),
            url: "https://sm-monirul.top/ott/bioscope/index.m3u8"
        },

        {
            name: "DAZN 1",
            logo: autoLogo("DAZN"),
            url: "https://znty.dyndns.org:5010/hls/eleven1.m3u8"
        },

        {
            name: "Caze TV BR",
            logo: autoLogo("Caze TV"),
            url: "https://dfr80qz435crc.cloudfront.net/MNOP/Amagi/Caze/Caze_TV_BR/1080p-vtt/index.m3u8"
        },

        {
            name: "beIN Sport",
            logo: autoLogo("beIN Sport"),
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

    const savedCategory =
        localStorage.getItem("selectedCategory");

    if (
        savedCategory &&
        savedCategory !== "All"
    ) {

        currentCategory = savedCategory;

        const btn =
        [...document.querySelectorAll(".cat-btn")]
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
    <button
        class="cat-btn active"
        onclick="filterCategory('All',this)">
        All
    </button>
    `;

    categories.forEach(cat=>{

        html += `
        <button
            class="cat-btn"
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
                onerror="
                    this.onerror=null;
                    this.src=autoLogo('${ch.name}');
                ">

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

function openPlayer(url,name){

    window.location.href =
        "player.html?url=" + url + "&name=" + name;

}


// ===============================
// SEARCH
// ===============================

document.getElementById("searchBox")
.addEventListener("keyup",function(){

    let input = this.value.toLowerCase().trim();

    let list = [...allChannels];

    // Category Filter
    if(currentCategory !== "All"){

        list = list.filter(ch =>
            ch.category === currentCategory
        );

    }

    // Search Filter
    if(input){

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

        const key =
        ch.name.toLowerCase().trim();

        if(!map.has(key)){

            map.set(key,ch);

        }

    });

    allChannels =
    [...map.values()];

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
// CACHE LOGOS
// ===============================

function cacheLogos(){

    allChannels.forEach(ch=>{

        const img = new Image();

        img.src = ch.logo;

    });

}


// ===============================
// INITIALIZE
// ===============================

setTimeout(()=>{

    removeDuplicateChannels();

    sortChannels();

    cacheLogos();

    showChannels(allChannels);

},100);
