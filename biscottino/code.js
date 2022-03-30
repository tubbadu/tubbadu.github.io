/** formatting:
 *
 * [category] | [text] | [optional: extra msg turns delay] | [optional: extra msg text] | [optional: others]
 * #comment line (note: the FIRST char must be a '#' !
 */


/*
const challengeString = `#begin
Cin Cin! | Bevete tutti
Virus! | $1 è brutto! per 3 turni niente bere | 3 | $1 non è più brutto
penitenza! | $1 $2 $3 muoiono male
Molestia! | $1 beve 3 sorsi mentre tutti gli altri gli toccano il culo!
Molestia! | $1 beve 3 sorsi mentre $2 gli fa il solletico!
Molestia! | $1 infila un dito nel naso di $2 (per favore, della mano...), poi entrambi bevono 2 sorsi
Molestia! | $1 è un calippo! Si spalma un po' della sua bevuta in faccia e $2 la lecca!
Molestia! | I giocatori a destra e a sinistra di $1 gli mordono un braccio, poi tutti e tre bevono un sorso!
Molestia! | $1 è alla gogna! Deve bere 10 piccoli, lenti sorsi mentre tutti gli altri lo fissano con gli occhi spalancati!
Molestia! | Orgia su $1!!!!!!! Se poi sopravvive all'aggressione, beve pure due sorsi, e che cazzo
Molestia! | Per 3 turni $1 si siede sulle gambe di $2, che si siede sulle gambe di $3, che se prova a lamentarsi si beve pure due sorsi, stronzo | 3 | Ok potete rialzarvi dalle gambe di quel poveretto...
Molestia! | Rapidissimo, $1 tira uno schiaffo in faccia a $2! | 0 | Se ha schivato o si è protetto, beve due sorsi e si prende un altro schiaffo!
Molestia! | $1 lecca il naso a $2, e poi ognuno beve 2 sorsi!
Molestia! | $1, bevi 3 bei sorsi e alita violentemente in faccia a $2! Se $2 non sbocca complimenti, puoi far bere 3 sorsi a chi vuoi tu!
Molestia! | $1, fai annusare la tua ascella a $2! E poi beviti anche due sorsi, puzzone dimmerda!
Molestia! | $1, togliti i calzini e poggiali delicatamente sulla faccia di $2 e $3, che dovranno tenerli per i prossimi 3 turni! E perchè no, bevete un goccio tutti e 3! | 3 | Potete togliervi i calzini dalla faccia! Che schifo Madonna...
Molestia! | $1, dai una testata a $2! Così, tanto per fare...
Molestia! | $1, prendi la faccia di $2 e lanciatela nelle tette urlando "COME QUESTE????"
Molestia! | $1, grattati il buco del culo e fai annusare il ditino a $2! Se puzza vattelo a lavare mentre ti bevi 3 sorsi, sporcaccione!<br>(tip of the day: non usare l'antipulci per lavartelo)
Molestia! | Sembra un clitoride! $1, fai un ditalino all'orecchio di $2!
Molestia! | $1, dai una tettata in faccia a $2, poi bevete entrambi 2 sorsi!
Molestia! | $1 Motorboat a $2!
Molestia! | Presto, mettete tutti il dito medio della vostra mano destra nel naso del vostro vicino di sinistra! Non potete toglierlo per nessun motivo, pena 3 sorsi per entrambi! | 3 | Okay potete smettere di scaccolarvi a vicenda...
Molestia! | $1 deve bere 3 sorsi dal suo bicchiere, tenuto da $2 in mezzo alle cosce!
Molestia! | $1 deve bere 3 sorsi dal suo bicchiere, tenuto da $2 con le tette!
Molestia! | Presto, toccate tutti un culo diverso dal vostro! L'ultimo a farlo beve 3 sorsi! | 0 | Per chi ha toccato il culo a Baccolino, complimenti buongustai, bevete 2 sorsi per festeggiare!
Molestia! | $1, solletica delicatamente l'ascella di $2... con la punta della lingua! | 0 | Dio fa raga siete davvero disgustosi, ma chi cazzo l'ha scritta sta porcata, uno psicopatico?
#end`;*/

var challengeString;
var challengeArray;
fetch('https://tubbadu.github.io/biscottino/challenges.config')
.then(response => {
    if (!response.ok) {
        alert("HTTP error: please try again, or contact that dumbass of the developer, it's surely his fault...")
        throw new Error("HTTP error " + response.status);
    }
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
    changeBottle();
    let out = selectChallenge();
    extractPlayers();
    let text = setChallenge(out);
    console.log(text);
    responsiveVoice.speak(document.getElementById("challenge").innerHTML.replaceAll('<br>', ' '), 'Italian Female');
    
} 

function settings() {
    window.open("settings.html", "_self")
}
