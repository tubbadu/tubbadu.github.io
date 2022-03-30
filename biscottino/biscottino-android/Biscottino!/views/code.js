/** formatting:
 *
 * [category] | [text] | [optional: extra msg turns delay] | [optional: extra msg text] | [optional: others]
 * #comment line (note: the FIRST char must be a '#' !
 */




var challengeString;
var challengeArray;
fetch('https://tubbadu.github.io/biscottino/challenges.config')
.then(response => {
    if (!response.ok) {
        alert("HTTP error " + response.status);
        throw new Error("HTTP error " + response.status);
        
    }
    alert("fecthed done")
    return response.text();
})
.then(text => {
    challengeString = text;
    challengeArray = challengeStringToArray();
})
.catch(error => {
    // Handle/report error
});

var players = window.location.search.split('?')[1].split('/');
var playersTEMP = []
var nTurns = 0;
var scheduled = [];
var bottle_n = 1;

function isGood(sfd){ // conditions for the challengeString string formatting
    var ret = true
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
function challengeStringToArray(){ //convert challengeString to challengeArray
    ret = challengeString.split(/\r?\n/);
    ret = ret.filter(item => isGood(item))
    return ret
}


function getRandomIndex(arr){ //select a random index
    var index = Math.floor(Math.random() * arr.length);
    return index;
}

function isFine(i){ //TODO conditions for the next challenge extracted
    return true
}

function selectChallenge(){ //returns the right challenge 
    //console.log(nTurns + "         -        " + scheduled)
    if (challengeArray.length < 1){
        return "FINE | bravissimi avete vinto";
    }
    for (var i = 0; i < scheduled.length; i++){
        if (scheduled[i][0] == nTurns){
            return scheduled.splice(i, 1)[i][1];//[1];
        }
    }
    if(scheduled.length > 0){

    }
    var i = 0;
    do{
        i = getRandomIndex(challengeArray);
    } while(isFine(i) == false);
    nTurns++;
    return challengeArray.splice(i, 1)[0];
}

function changeColor(color) {
    document.body.style.background = color[0];
    document.getElementById("mainDiv").style.background = color[0];
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
        case "molestia":
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
        default:
            return ["#FFFFFF", "#000000"]; //BIANCO
        
    }
}

function extractPlayers(){
    playersTEMP = [];
    for (var i = 0; i < 3; i++){
        var pl = "";
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

function next() {
    changeBottle()
    let out = selectChallenge();
    extractPlayers();
    let text = setChallenge(out);
    console.log(text)
    responsiveVoice.speak(document.getElementById("challenge").innerHTML, 'Italian Female');
} 

function settings() {
    window.open("settings.html", "_self")
}
