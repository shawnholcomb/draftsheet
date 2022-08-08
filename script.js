
const d = document;
let qbArr = [];
let rbArr = [];
let wrArr = [];
let teArr = [];
let dstArr = [];

function Player(playerName, position, team, rank, watch, avoid) {
    this.playerName = playerName;
    this.position = position;
    this.team = team;
    this.rank = rank;
    this.watch = watch;
    this.avoid = avoid;
}

function watchPlayer(x) {
    x.watch ? false : true;
}

function avoidPlayer (x) {
    x.avoid ? false : true;
}
// tabbed navigation
const tabs = d.querySelectorAll(".nav-link");

tabs.forEach(x => x.addEventListener("click", function () {
    const selectedSection = this.textContent.toLowerCase() + "-section";
    const selectedLink = this.textContent.toLowerCase() + "-link";
    d.querySelectorAll("section").forEach(x => {
        x.className === selectedSection ? x.style.display = "block" : x.style.display = "none";
    })
    d.querySelectorAll(".nav-link").forEach(x => {
        x.classList.contains(selectedLink) ? x.classList.add("active") : x.classList.remove("active");
    })

}));

d.querySelector(".close-link").addEventListener("click", () => {
    const nav = d.querySelector(".big-wrapper");
    const link = d.querySelector(".close-link");
    nav.classList.toggle("cl-close");
    nav.classList.contains("cl-close") ? link.innerHTML = '<i class="fa fa-caret-down" aria-hidden="true"></i>' : link.innerHTML = '<i class="fa fa-caret-up" aria-hidden="true"></i>'
})

// data tab functions

function showMessage(message) {
    d.querySelector(".message").textContent = message
    setTimeout(() => {
        d.querySelector(".message").textContent = ""
    }, 1000);
}

d.querySelector(".data-clear").addEventListener("click", () => {
    showMessage("cleared...");
    d.getElementById("raw-data").value = "";
    d.querySelectorAll(".player-div").forEach(x => x.remove());
    d.querySelectorAll(".pos-section").forEach(x => {
        x.style.display = "none"
    });
    d.querySelector(".add-notice").style.display = "block";
    qbArr = [];
    rbArr = [];
    wrArr = [];
    teArr = [];
    dstArr = [];
});

d.querySelector(".data-save").addEventListener("click", () => { 
    const rawData = d.getElementById("raw-data").value;
    localStorage.setItem("playerData", rawData);
    showMessage("saved...")
});

d.querySelector(".data-load").addEventListener("click", () => { 
    const data = localStorage.getItem("playerData")
    data ? showMessage("data loaded...") : showMessage("no data found...")
    d.getElementById("raw-data").value = data;
    d.querySelector(".data-process").click();
});

d.querySelector(".data-process").addEventListener("click", () => {
    d.querySelector(".loading-modal").style.display = "flex";

    setTimeout(() => {
        d.querySelector(".loading-modal").style.display = "none";
    }, 500)

    const rawData = d.getElementById("raw-data").value;
    const rawArr = rawData.split(";");
    const dataArr = rawArr.map(x => x.trim());
    dataArr.splice(dataArr.length -1, 1);
    dataArr.forEach(x => {
        const playerArr = x.split(" ");
        const posTeam = playerArr[playerArr.length - 1]
        const posTeamArr = posTeam.split("-");
        const position = posTeamArr[0];
        const team = posTeamArr[1];
        const playerName = x.split(posTeam)[0].trim();
        const rank = dataArr.indexOf(x) + 1;
        let player = new Player(playerName, position, team, rank, false, false)
        switch (position) {
            case "QB":
                qbArr.push(player);
                break;
            case "RB":
                rbArr.push(player);
                break;
            case "WR":
                wrArr.push(player);
                break;
            case "TE":
                teArr.push(player);
                break;
            case "DST":
                dstArr.push(player);
                break;
        }
    })

    function updateRanks(x) {
        x.forEach(p => p.rank = x.indexOf(p) + 1);
    }

    updateRanks(qbArr);
    updateRanks(rbArr);
    updateRanks(wrArr);
    updateRanks(teArr);
    updateRanks(dstArr);

    function addToTabs(x) {
        x.forEach(p => {
            const posClass = "." + p.position.toLowerCase() + "-section";
            const posSection = d.querySelector(posClass)
            let playerDiv = d.createElement("div")
            playerDiv.className = "player-div";
            let rankSpan = d.createElement("span");
            rankSpan.appendChild(d.createTextNode(p.rank));
            let nameSpan = d.createElement("span");
            nameSpan.appendChild(d.createTextNode("  " + p.playerName));
            let teamSpan = d.createElement("span");
            teamSpan.appendChild(d.createTextNode(" (" + p.team + ")"));
            playerDiv.appendChild(rankSpan);
            playerDiv.appendChild(nameSpan);
            playerDiv.appendChild(teamSpan);
            posSection.append(playerDiv);
        })

    }

    d.querySelectorAll(".add-notice").forEach(x => x.style.display = "none")
    d.querySelectorAll(".pos-section").forEach(x => x.style.display = "block")
    addToTabs(qbArr)
    addToTabs(rbArr)
    addToTabs(wrArr)
    addToTabs(teArr)
    addToTabs(dstArr)
    playerDivAddListener();

    d.querySelector(".data-section").style.display = "none";
    d.querySelector(".sheet-section").style.display = "block";
    d.querySelector(".sheet-link").classList.add("active");
    d.querySelector(".data-link").classList.remove("active");
});

function playerDivAddListener() {
    const playerDiv = d.querySelectorAll(".player-div");
    playerDiv.forEach(x => x.addEventListener("click", () => {
        const checked = x.classList.contains("check-off");
        const myTeam = x.classList.contains("my-team");
        const watch = x.classList.contains("watch");
        const avoid = x.classList.contains("avoid");
        const neither = !x.classList.contains("check-off") && !x.classList.contains("my-team") && !x.classList.contains("watch") && !x.classList.contains("avoid");

        if (neither) {
            x.classList.add("check-off");
        } else if (checked) {
            x.classList.remove("check-off");
            x.classList.add("my-team");
        } else if (myTeam) {
            x.classList.remove("my-team");
            x.classList.add("avoid")
        } else if (avoid) {
            x.classList.remove("avoid");
            x.classList.add("watch");
        } else if (watch) {
            x.classList.remove("watch");
        }
    }));
}