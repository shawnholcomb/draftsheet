// General setup and functions

const d = document;
let qbArr = [];
let rbArr = [];
let wrArr = [];
let teArr = [];
let dstArr = [];

d.addEventListener("DOMContentLoaded", function () {
    checkLocalStorage();
});

function checkLocalStorage() {
    localStorage.getItem("playerData") === null ? d.querySelector(".data-load").setAttribute("disabled", "disabled") : d.querySelector(".data-load").removeAttribute("disabled", "disabled");
}

function Player(playerName, position, team, rank, tier, watch, avoid) {
    this.playerName = playerName;
    this.position = position;
    this.team = team;
    this.rank = rank;
    this.tier = tier;
    this.watch = watch;
    this.avoid = avoid;
}

function watchPlayer(x) {
    x.watch ? false : true;
}

function avoidPlayer(x) {
    x.avoid ? false : true;
}

function showMessage(message) {
    d.querySelector(".message").textContent = message
    setTimeout(() => {
        d.querySelector(".message").textContent = ""
    }, 1000);
}

function playerDivAddListener() {
    const playerDiv = d.querySelectorAll(".player-div");
    playerDiv.forEach(x => x.addEventListener("click", () => {
        const neither = !x.classList.contains("check-off") && !x.classList.contains("my-team");
        const checked = x.classList.contains("check-off");
        const myTeam = x.classList.contains("my-team");
        // const watch = x.classList.contains("watch");
        // const avoid = x.classList.contains("avoid");

        if (neither) {
            x.classList.add("check-off");
        } else if (checked) {
            x.classList.remove("check-off");
            x.classList.add("my-team");
        } else if (myTeam) {
            x.classList.remove("my-team");
        }
    }));
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
    localStorage.clear();
    checkLocalStorage();
});

d.querySelector(".data-save").addEventListener("click", () => {
    const rawData = d.getElementById("raw-data").value;
    localStorage.setItem("playerData", rawData);
    showMessage("saved...")
    checkLocalStorage();
});

d.querySelector(".data-load").addEventListener("click", () => {
    const data = localStorage.getItem("playerData")
    data ? showMessage("data loaded...") : showMessage("no data found...")
    d.getElementById("raw-data").value = data;
    d.querySelector(".data-process").click();
    checkLocalStorage();
});

d.querySelector(".data-process").addEventListener("click", () => {
    d.querySelector(".loading-modal").style.display = "flex";

    setTimeout(() => {
        d.querySelector(".loading-modal").style.display = "none";
    }, 500)

    const rawData = d.getElementById("raw-data").value;
    const rawArr = rawData.split(";");
    const dataArr = rawArr.map(x => x.trim());
    dataArr.splice(dataArr.length - 1, 1);
    dataArr.forEach(x => {
        const playerArr = x.split(" ");
        const posTeam = playerArr[playerArr.length - 1];
        const posTeamAttr = posTeam.split(",");
        let tier = posTeamAttr[1];
        let watch = posTeamAttr[2] == "TRUE" ? true : false;
        let avoid = posTeamAttr[3] == "TRUE" ? true : false;
        const posTeamArr = posTeamAttr[0].split("-");
        const position = posTeamArr[0];
        const team = posTeamArr[1];
        const playerName = x.split(posTeam)[0].trim();
        const rank = dataArr.indexOf(x) + 1;
        let player = new Player(playerName, position, team, rank, tier, watch, avoid)
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

    function tierListUpdates(classname) {
        const checkClass = d.getElementsByClassName(classname).length > 0;
        console.log(classname)
        if (checkClass) {
            let position = classname.split("-")[0];
            let tierNumber = classname.split("-")[2];
            let tier = d.querySelector(`.${classname}`);
            let tierDiv = d.createElement("div");
            tierDiv.classList.add("tier-header");
            tierDiv.appendChild(d.createTextNode(`Tier ${tierNumber}`));
            let section = d.querySelector(`.${position}-section`);
            section.insertBefore(tierDiv, tier);
        }
    }

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
            playerDiv.classList.add(`${p.position.toLowerCase()}-tier-${p.tier}`);
            p.watch ? playerDiv.classList.add("watch") : playerDiv.classList.remove("watch");
            p.avoid ? playerDiv.classList.add("avoid") : playerDiv.classList.remove("avoid");
            let rankSpan = d.createElement("span");
            rankSpan.appendChild(d.createTextNode(p.rank));
            let nameSpan = d.createElement("span");
            nameSpan.classList.add("text-weight-bold");
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

    const tiersArr = ["qb-tier-1", "qb-tier-2", "qb-tier-3", "qb-tier-4", "qb-tier-5", "rb-tier-1", "rb-tier-2", "rb-tier-3", "rb-tier-4", "rb-tier-5", "rb-tier-6", "rb-tier-7", "rb-tier-8", "wr-tier-1", "wr-tier-2", "wr-tier-3", "wr-tier-4", "wr-tier-5", "wr-tier-6", "wr-tier-7", "wr-tier-8", "te-tier-1", "te-tier-2", "te-tier-3", "te-tier-4", "te-tier-5", "dst-tier-1", "dst-tier-2", "dst-tier-3", "dst-tier-4", "dst-tier-5"];
    tiersArr.forEach(x => tierListUpdates(x));
    // tierListUpdates("qb-tier-1");

    d.querySelector(".data-section").style.display = "none";
    d.querySelector(".sheet-section").style.display = "block";
    d.querySelector(".sheet-link").classList.add("active");
    d.querySelector(".data-link").classList.remove("active");

    checkLocalStorage();
});