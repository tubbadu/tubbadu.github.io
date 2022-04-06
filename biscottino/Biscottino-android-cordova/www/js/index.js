// global variables
var challengeDivHeight;
var challengeString;
var challengeArray;
var players;
var playersTEMP;
var nTurns;
var scheduled;
var bottle_n;
var exCategory;
var gameStarted = false;
var autoRead = true;

/////////////////////// splash screen //////////////////////////////////////////////////////////////
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
	// Cordova is now initialized. Have fun!
	console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
	window.screen.orientation.lock('portrait');
	splashScreen();
}

function splashScreen(){ // calling this function after everything is ready, so it will show for 1 sec the splash screen, and then will rotate the screen and do everything normally (note: the 2 divs IDs are 'splashScreenDiv' and 'settingsDiv'))
	console.log("splash screen")
	setTimeout(function () {
		if (true) {
			show("settings");
			console.log("splashed screen");
		}
	}, 1500);
}

/////////////////////// settings //////////////////////////////////////////////////////////////
storedPlayers = localStorage.getItem("playersTextArea");
if(storedPlayers != null){
	document.getElementById('text').value = storedPlayers;
}

function onSubmit(){
	function append(pl){
		if(pl.trim().length > 1 && !(pl.indexOf('%') > -1) && !(pl.indexOf('$') > -1) && !(pl.indexOf('/') > -1)){
			players.push(pl.trim());
		}else if(pl.trim().length == 0){
			console.log("silently skipping empty player");
		}else{
			alert("skipped player: " + pl + "\nbad formatting (player name must be at least 2 chars long and should not contain special chars)");
		}
	}
	players = new Array(); //reset player list
	let inputPlayers = document.getElementById('text').value.split('\n');
	inputPlayers.forEach(append); // append good players

	if(players.length < 3){
		alert("Errore: il numero di giocatori dev'essere minimo 3")
	}else{
		//start the game
		startBiscottino();
	}
}

function changeAutoread(){
	autoRead = !autoRead;
	if(autoRead){
		document.getElementById("autoread").style.backgroundColor = "#99ff33";
	}else{
		document.getElementById("autoread").style.backgroundColor = "red";
	}
}

/////////////////////// biscottino //////////////////////////////////////////////////////////////
function startBiscottino(){
	show("biscottino");
	if(!gameStarted){
		challengeString = challengesStringConfig;
		challengeArray = challengeStringToArray();
		playersTEMP = [];
		nTurns = 0;
		scheduled = new Array();
		bottle_n = 1;
		console.log("challenges loaded");
		gameStarted = true;
	}
	sizeInit();
}

window.addEventListener('resize', function(event) {
	//console.log("resized");
	sizeInit();
}, true);

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

function isFine(i){ // if the just extracted challenge is good (category different from before, ecc)
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

function changeColor(color) { // change text and background color
	document.body.style.background = color[0];
	document.getElementById('challenge').style.color = color[1]
	document.getElementById('category').style.color = color[1]
	document.getElementById('nTurn').style.color = color[1]
}

function getColor(cat){ // get the correct color of the given category
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
		case "hardcore!":
			return ["#5e5e5e", "#ff3300"];
			break;
		default:
			return ["#FFFFFF", "#000000"]; //BIANCO
		
	}
}

function extractPlayers(){ // extract 3 players and set put them in playersTEMP
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

function changeBottle(){ //change the button bottle image
	bottle_n++;
	if (bottle_n > 4){
		bottle_n = 1;
	}
	document.getElementById("bottle").src = "img/bottle" + bottle_n + ".png"
}

function removeTags(str) { // returns the string without html tags
	if ((str===null) || (str===''))
	return false;
	else
	str = str.toString();
	return str.replace( /(<([^>]+)>)/ig, ' ');
}

function setFontSize(){ // automatically set font size in order to fit in the page
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

function sizeInit(){ //set the size of everything in order to best fit in the page
	//setting main to fit the screen size TODO
	console.log("resizing; main size: " + document.getElementById("main").offsetHeight + ", " + document.getElementById("main").offsetWidth);
	//setting table size to fit main
	document.getElementById("Table").style.height = document.getElementById("main").offsetHeight + "px";
	document.getElementById("Table").style.width = document.getElementById("main").offsetWidth + "px";

	//setting biscottino button to x% of main width
	let x = 7;
	document.getElementById("biscottino").style.height = (document.getElementById("main").offsetWidth*x/100) + "px";
	document.getElementById("biscottino").style.width = document.getElementById("biscottino").offsetHeight + "px";

	//setting nTurn size like biscottino
	document.getElementById("nTurn").style.height = document.getElementById("biscottino").offsetHeight + "px";
	document.getElementById("nTurn").style.width = document.getElementById("biscottino").offsetWidth + "px";

	//setting bottle button height to the same height of the biscottino
	document.getElementById("bottle").style.height = document.getElementById("biscottino").offsetHeight + "px";
	document.getElementById("bottle").style.width = 3*document.getElementById("bottle").offsetHeight + "px";

	//setting speaker heihjt to the same as biscottino
	document.getElementById("speaker").style.height = document.getElementById("biscottino").offsetHeight + "px";
	document.getElementById("speaker").style.width = document.getElementById("speaker").offsetHeight + "px";

	//do other magic things
	//document.getElementById("top_td").style.width = document.getElementById("top").offsetWidth;

	//set text size TODO
	challengeDivHeight = document.getElementById("cazzopalle").offsetHeight;
	document.getElementById("category").style.fontSize = (document.getElementById("main").offsetWidth / 19) + "px";
	document.getElementById("nTurn").style.fontSize = (document.getElementById("main").offsetWidth / 40) + "px";
	//document.getElementById("challenge").style.fontSize = getFontSize() + "px";
	setFontSize();
}

function readText(){
	read(removeTags(document.getElementById("challenge").innerHTML));
}

function next() {
	changeBottle();
	let out = selectChallenge();
	extractPlayers();
	let text = setChallenge(out);
	setFontSize();
	document.getElementById("nTurn").innerHTML = nTurns;
	if(autoRead) readText();
} 

function settings() {
	stopRead();
	show("settings");
}

/////////////////////// others //////////////////////////////////////////////////////////////
function show(str){
	if(str == "splashScreen"){
		document.getElementById('splashScreen').style.display = 'block';
		document.getElementById('settings').style.display = 'none';
		document.getElementById('biscottino').style.display = 'none';
		window.screen.orientation.lock('portrait');
	} else if(str == "biscottino"){
		document.getElementById('splashScreen').style.display = 'none';
		document.getElementById('settings').style.display = 'none';
		document.getElementById('biscottino').style.display = 'block';
		console.log(removeTags(document.getElementById("category").innerHTML));
		if(removeTags(document.getElementById("category").innerHTML).trim() != 'Biscottino!'){
			changeColor(getColor(document.getElementById("category").innerHTML));
		}else{
			document.body.style.backgroundImage = "url('../img/biscottiniSfondoVerticale.png')";
		}
		window.screen.orientation.lock('landscape');
		fixZoom() //TODO TO BE FIXED
	} else if(str == "settings"){
		document.getElementById('splashScreen').style.display = 'none';
		document.getElementById('settings').style.display = 'block';
		document.getElementById('biscottino').style.display = 'none';
		document.body.style.backgroundImage = "url('../img/biscottiniSfondoVerticale.png')";
		window.screen.orientation.lock('portrait');
	} 
}

function read(txt){
	nativeTTS(fixPronounciation(txt));
	//responsiveVoicesTTS(txt);
}

function stopRead(){
	read(" ");
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
/*
function responsiveVoicesTTS(txt){
    responsiveVoice.speak(txt, 'Italian Female');
}
*/

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

function fixZoom(){
	window.screen.orientation.lock('portrait');
	window.screen.orientation.lock('landscape');
}