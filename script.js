showChannels(allChannels);

function showChannels(list){

let html = `<div class="channel-grid">`;

list.forEach(ch=>{

html += `
<div class="channel-card">

<img
class="channel-logo"
src="${ch.logo}"
loading="lazy"
onerror="this.src='https://via.placeholder.com/100?text=TV'">

<div class="channel-name">
${ch.name}
</div>

<button
class="live-btn"
onclick="playChannel('${encodeURIComponent(ch.url)}','${encodeURIComponent(ch.name)}')">

▶ LIVE

</button>

</div>
`;

});

html += `</div>`;

document.getElementById("channels").innerHTML = html;

}

function playChannel(url,name){

window.location.href =
"player.html?url="+url+"&name="+name;

}

document
.getElementById("searchBox")
.addEventListener("keyup",function(){

const value=this.value.toLowerCase();

const result=allChannels.filter(c=>
c.name.toLowerCase().includes(value)
);

showChannels(result);

});

document.querySelectorAll(".category-bar button")
.forEach(btn=>{

btn.onclick=function(){

document.querySelectorAll(".category-bar button")
.forEach(b=>b.classList.remove("active"));

this.classList.add("active");

const cat=this.innerText.toLowerCase();

if(cat==="all"){
showChannels(allChannels);
return;
}

const result=allChannels.filter(c=>
c.category.toLowerCase()===cat
);

showChannels(result);

};

});
