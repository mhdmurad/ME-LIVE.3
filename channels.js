const playlist =
"https://raw.githubusercontent.com/sanjoykb/-KB-TV-Playlist/refs/heads/main/Github%20Auto%20Update%20Channel.m3u";

let allChannels = [];

document.getElementById("channels").innerHTML =
"<div style='text-align:center;padding:40px;font-size:18px'>Loading Channels...</div>";

fetch(playlist)
.then(res => res.text())
.then(data => {

    const lines = data.split("\n");

    for(let i = 0; i < lines.length; i++){

        if(lines[i].startsWith("#EXTINF")){

            const info = lines[i];
            const url = (lines[i+1] || "").trim();

            if(!url.startsWith("http")) continue;

            const name =
                (info.match(/tvg-name="([^"]+)"/)||[])[1] ||
                info.split(",").pop().trim();

            const logo =
                (info.match(/tvg-logo="([^"]+)"/)||[])[1] ||
                "https://via.placeholder.com/100?text=TV";

            const category =
                (info.match(/group-title="([^"]+)"/)||[])[1] ||
                "Other";

            allChannels.push({
                name,
                logo,
                category,
                url
            });

        }

    }

    showChannels(allChannels);

})
.catch(()=>{

document.getElementById("channels").innerHTML=
"<h2 style='color:red;text-align:center'>Playlist Load Failed</h2>";

});
