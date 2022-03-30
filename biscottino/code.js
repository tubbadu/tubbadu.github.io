const timeout = setTimeout(init, 500);

var challengeString;
var challengeArray;
var players;
var playersTEMP;
var nTurns;
var scheduled;
var bottle_n;
function init(){
    challengeString = document.getElementById("challengesString").innerHTML;
    challengeArray = challengeStringToArray();
    players = window.location.search.split('?')[1].split('/');
    playersTEMP = [];
    nTurns = 0;
    scheduled = [];
    bottle_n = 1;
    console.log("challenges loaded");
    //console.log(challengeString);
}

function isGood(sfd){ // conditions for the challengeString string formatting
    let ret = true
    if(sfd.charAt(0) == '#'){
        ret = false;
    }else if(sfd.length < 3){
        ret = false;
    }else if(!(sfd.indexOf('|') > -1)){
        ret = false;
    }else{
        ret = true;
    }
    return ret
}
function challengeStringToArray2(){ //convert challengeString to challengeArray
    ret = challengeString.split(/\r?\n/);
    ret = ret.filter(item => isGood(item))
    return ret
}

function challengeStringToArray(){ //convert challengeString to challengeArray
    let challengesSplitted = challengeString.split(/\r?\n/);
    let nowCategory = "";
    let ret = new Array();
    for (let i=0; i<challengesSplitted.length; i++){
        let line = challengesSplitted[i].trim();
        if(line.length > 1){
            if(line.startsWith("#")){
                //comment, skipping
            }else if(line.startsWith("%")){
                nowCategory = line.replaceAll("%", "").trim()
            }
            else if(nowCategory != ""){
                //append
                ret.push(nowCategory + " | " + line);
            }
        }else{
            console.log("Too short: Skipping line " + i + ": \"" + line + "\"");
        }
    }
    return ret;
}



function getRandomIndex(arr){ //select a random index
    let index = Math.floor(Math.random() * arr.length);
    return index;
}

function isFine(i){ //TODO conditions for the next challenge extracted
    return true
}

function selectChallenge(){ //returns the right challenge 
    if (challengeArray.length < 1){
        return "FINE | bravissimi avete vinto";
    }
    for (let i = 0; i < scheduled.length; i++){
        if (scheduled[i][0] == nTurns){
            return scheduled.splice(i, 1)[i][1];//[1];
        }
    }
    if(scheduled.length > 0){

    }
    let i = 0;
    do{
        i = getRandomIndex(challengeArray);
    } while(isFine(i) == false);
    nTurns++;
    return challengeArray.splice(i, 1)[0];
}

function changeColor(color) {
    document.body.style.background = color[0];
    document.getElementById('challenge').style.color = color[1]
    document.getElementById('category').style.color = color[1]
}

function getColor(cat){
    switch(cat.toLowerCase()){
        case "hot!":
            return ["#FF0000", "#000000"]; //ROSSO
            break;
        case "superpotere!":
            return ["#0508C6", "#000000"]; //BLU SCURO
            break;
        case "molestia!":
            return ["#FF00C4", "#000000"]; //fucsia
            break;
        case "penitenza!":
            return ["#000000", "#FFFFFF"]; //nero
            break;
        case "virus!":
            return ["#FFEA00", "#000000"]; //giallo
            break;
        case "imitazione!":
            return ["#00FFDC", "#000000"]; //celeste
            break;
        case "cin cin!":
            return ["#00FF06", "#000000"]; //verde chiaro
            break;
        case "sfida!":
            return ["#FF8DE2", "#000000"]; //verde chiaro
            break;
        case "così, a cazzo di cane!":
            return ["#FF9400", "#000000"]; //verde chiaro
            break;
        default:
            return ["#FFFFFF", "#000000"]; //BIANCO
        
    }
}

function extractPlayers(){
    playersTEMP = [];
    for (let i = 0; i < 3; i++){
        let pl = "";
        do{
            pl = players[getRandomIndex(players)];
        }while(playersTEMP.includes(pl));
        playersTEMP.push(pl);
    }
}

function setChallenge(sfd){ // do everything needed to set the challenge (text, color, ...)
    function myfun(item, index, arr) {
        arr[index] = item.trim()
        return arr[index]
    }
    let sfdSplit = sfd.replaceAll("$1", playersTEMP[0]).replaceAll("$2", playersTEMP[1]).replaceAll("$3", playersTEMP[2]).split('|');
    sfdSplit.forEach(myfun);
    var category = sfdSplit[0];
    var text = sfdSplit[1];
    if(sfdSplit.length > 3){
        var turnCounter = sfdSplit[2];
        var secondText = sfdSplit[3];
        if (sfdSplit.length > 4){
            //boh here happens something special
        } else{
            // the classic 4-elements challenge here
            scheduled.unshift([(parseInt(nTurns) + parseInt(turnCounter)), category + " | " + secondText]);
        }

    }

    document.getElementById("category").innerHTML = category;
    document.getElementById("challenge").innerHTML = text;
    changeColor(getColor(category));
    return text;
}

function changeBottle(){
    bottle_n++;
    if (bottle_n > 4){
        bottle_n = 1;
    }
    document.getElementById("bottle").src = "bottle" + bottle_n + ".png"
}

function removeTags(str) {
    if ((str===null) || (str===''))
    return false;
    else
    str = str.toString();
    return str.replace( /(<([^>]+)>)/ig, '');
 }

function next() {
    changeBottle();
    let out = selectChallenge();
    extractPlayers();
    let text = setChallenge(out);
    console.log(text);
    responsiveVoice.speak(removeTags(document.getElementById("challenge").innerHTML), 'Italian Female'); //add replace to remove all <text>
    
} 

function settings() {
    window.open("settings.html", "_self")
}
