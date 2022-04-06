/**
 * ****TODO:****
 * set application fullscreen (seems not possible)
 * fix application landscape mode (not important)
 * use native TTS (important)
 * 
 * 
 * 
 *  
 **/




//const timeout = setTimeout(init, 500);
var challengeDivHeight;
var challengeString;
var challengeArray;
var players;
var playersTEMP;
var nTurns;
var scheduled;
var bottle_n;
var exCategory;



function fixPronounciation(txt){
	let out=txt.toLowerCase();
	let speechErrors = [
		["ale", "àle"],
		["gabe", "gàbé"],
		["shottino", "shottììno"], //NON VA
		["pompino", "pompìno"],
		["grattati", "gràttati"],
		["poggiali", "pòggiali"],
		["bevetene", "bevètene"],
		[" (", " ,("], //NOT SURE, MAY CAUSE PROBLEMS EDIT: DOESN'T WORK
		["che perdono", "che pèrdono"],
		["1 sorso", "un sorso"],
		["infilati", "infìlati"],
		["w", "viva"]
	];
	let punteggiaturaArray = " ,.!?:;".split("");

	for(let j=0; j<speechErrors.length; j++){
		for(let i=0; i<punteggiaturaArray.length; i++){
			out = out.replaceAll(" " + speechErrors[j][0] + punteggiaturaArray[i], " " + speechErrors[j][1] + punteggiaturaArray[i]);
		}
	}
	//console.log("reading: " + out)
	return out;
}

function init(){
	challengeString = challengesStringConfig;
	challengeArray = challengeStringToArray();
	players = window.location.search.split('?')[1].split('/');
	playersTEMP = [];
	nTurns = 0;
	scheduled = new Array;
	bottle_n = 1;
	console.log("challenges loaded");
}

function read(txt){
	nativeTTS(fixPronounciation(txt));
	//responsiveVoicesTTS(txt);
}

function nativeTTS(txt){
	TTS.speak({
		text: txt,
		locale: 'it-IT',
		rate: 1.25
	}, function () {
		console.log('read: ' +  txt);
	}, function (reason) {
		console.log("error:" + reason);
		});
}

//function responsiveVoicesTTS(txt){
//    responsiveVoice.speak(txt, 'Italian Female');
//}

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
			//console.log("Too short: Skipping line " + i + ": \"" + line + "\"");
		}
	}
	return ret;
}



function getRandomIndex(arr){ //select a random index
	let index = Math.floor(Math.random() * arr.length);
	return index;
}

function isFine(i){
	if(challengeArray[i].split("|")[0].trim() == exCategory){
		return false;
	}
	return true;
}

function selectChallenge(){ //returns the right challenge 
	if (challengeArray.length < 1){
		return "FINE | bravissimi avete vinto";
	}
	for (let i = 0; i < scheduled.length; i++){
		if (scheduled[i][0] == nTurns){
			console.log("scheduled:");
			console.log(scheduled);
			console.log("i: " + i);
			console.log("scheduled[i]:");
			console.log(scheduled[i]);
			console.log("scheduled[i][1]:");
			let ret = scheduled[i][1];
			console.log(scheduled[i][1]);
			scheduled.splice(i, 1)[1];
			return ret;
		}
	}
	if(scheduled.length > 0){

	}
	let i = 0;
	do{
		i = getRandomIndex(challengeArray);
	} while(isFine(i) == false);
	nTurns++;
	return " " + challengeArray.splice(i, 1)[0] + " ";
}

function changeColor(color) {
	document.body.style.background = color[0];
	document.getElementById('challenge').style.color = color[1]
	document.getElementById('category').style.color = color[1]
	document.getElementById('nTurn').style.color = color[1]
}

function getColor(cat){
	switch(cat.toLowerCase().trim()){
		case "hot!":
			return ["#FF0000", "#000000"]; //ROSSO
			break;
		case "superpotere!":
			return ["#0508C6", "#FFFFFF"]; //BLU SCURO
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
	function trimArray(item, index, arr) {
		arr[index] = item.trim()
		return arr[index]
	}
	let sfdSplit = sfd.replaceAll("$1", playersTEMP[0]).replaceAll("$2", playersTEMP[1]).replaceAll("$3", playersTEMP[2]).split('|');
	//sfdSplit.forEach(trimArray);
	var category = sfdSplit[0];
	exCategory = category;
	var text = sfdSplit[1];
	if(sfdSplit.length > 3){
		var turnCounter = sfdSplit[2];
		var secondText = sfdSplit[3];
		if (sfdSplit.length > 4){
			//boh here happens something special
		} else{
			// the classic 4-elements challenge here
			let toBeScheduled = new Array((parseInt(nTurns) + parseInt(turnCounter)), category + " | " + secondText);
			console.log("tobescheduled:") 
			console.log(toBeScheduled)
			scheduled.unshift(toBeScheduled);
			console.log(scheduled)
			//console.log("!!!!!!!!!!!!!!!!!!!!!new scheduled: " + scheduled + "s[0]=" + scheduled[0]);
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
	document.getElementById("bottle").src = "img/bottle" + bottle_n + ".png"
}

function removeTags(str) {
	if ((str===null) || (str===''))
	return false;
	else
	str = str.toString();
	return str.replace( /(<([^>]+)>)/ig, ' ');
}


function setFontSize(){
	let s = document.getElementById("main").offsetWidth / 20;
	//console.log("s = " + s)
	document.getElementById("challenge").style.fontSize = s + 'px';
	let actualChallengeDivHeight = document.getElementById("challenge").offsetHeight;
	while(actualChallengeDivHeight > challengeDivHeight){
		s = s-1;
		document.getElementById("challenge").style.fontSize = s + 'px';
		actualChallengeDivHeight = document.getElementById("challenge").offsetHeight;
		//console.log("-1")
	}
	//console.log("font size set.");
}

function sizeInit(){
	//setting main to fit the screen size TODO

	//setting table size to fit main
	document.getElementById("Table").style.height = document.getElementById("main").offsetHeight + "px";

	//setting biscottino button to x% of main width
	let x = 7;
	document.getElementById("biscottino").style.height = (document.getElementById("main").offsetWidth*x/100) + "px";
	document.getElementById("biscottino").style.width = document.getElementById("biscottino").offsetHeight + "px";

	//setting bottle button height to the same height of the biscottino
	document.getElementById("bottle").style.height = document.getElementById("biscottino").offsetHeight + "px";
	document.getElementById("bottle").style.width = 3*document.getElementById("bottle").offsetHeight + "px";

	//set text size TODO
	challengeDivHeight = document.getElementById("cazzopalle").offsetHeight;
	document.getElementById("category").style.fontSize = (document.getElementById("main").offsetWidth / 19) + "px";
	document.getElementById("nTurn").style.fontSize = (document.getElementById("main").offsetWidth / 40) + "px";
	//document.getElementById("challenge").style.fontSize = getFontSize() + "px";
	setFontSize();
}
sizeInit()

window.addEventListener('resize', function(event) {
	//console.log("resized");
	sizeInit();
}, true);

document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
	// Cordova is now initialized. Have fun!
	console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
	window.screen.orientation.lock('landscape');
}


function next() {
	changeBottle();
	let out = selectChallenge();
	extractPlayers();
	let text = setChallenge(out);
	setFontSize();
	document.getElementById("nTurn").innerHTML = nTurns;
	read(removeTags(document.getElementById("challenge").innerHTML));
} 

function settings() {
	window.open("settings.html?noSplash", "_self")
}
