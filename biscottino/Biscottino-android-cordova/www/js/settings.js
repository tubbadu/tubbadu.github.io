//init2(); //TO BE REMOVED
storedPlayers = localStorage.getItem("playersTextArea");
if(storedPlayers != null){
    document.getElementById('text').value = storedPlayers;
}

function onSubmit(){
    let par = '';
    function append(player){
        if(player.trim().length > 1 && !(player.indexOf('%') > -1) && !(player.indexOf('$') > -1) && !(player.indexOf('/') > -1)){
            par += player.trim() + "/";
        }else{
            alert("skipped player: " + player + "\nbad formatting (player name must be at least 3 chars long and should not contain special chars)");
        }
    }
    let players = document.getElementById('text').value.split('\n');
    players.forEach(append);
    par = par.substring(0, par.length - 1);
    if(par.split('/').length >= 3){
        localStorage.setItem("playersTextArea", document.getElementById('text').value);
        window.screen.orientation.lock('landscape');
        window.open('biscottino.html?' + par, '_self');
    }else{
        alert("Error: should at least contains 3 players");
    }
}
/*
function tspeak(){
    TTS.speak({
        text: 'Welcome to the app!',
        locale: 'en-GB',
        rate: 0.75
    }, function () {
        alert('success');
    }, function (reason) {
        alert(reason);
        });
}*/

document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    //window.screen.orientation.lock('landscape');
   // sizeInit();
   init2();
}

function sizeInit(){
    document.getElementById("text").style.fontSize = (document.getElementById("main").offsetHeight / 10) + "px";
    document.getElementById("btn").style.fontSize = (document.getElementById("main").offsetHeight / 10) + "px";
}
window.addEventListener('resize', function(event) {
    console.log("resized");
    sizeInit();
}, true);
///////////////////////////////////

function splashScreen(){ // calling this function after everything is ready, so it will show for 1 sec the splash screen, and then will rotate the screen and do everything normally (note: the 2 divs IDs are 'splashScreenDiv' and 'settingsDiv'))
    console.log("splash screen")
    setTimeout(function () {
        if (true) {
            window.screen.orientation.lock('portrait');
            document.getElementById('splashScreenDiv').style.display = 'none';
            document.getElementById('settingsDiv').style.display = 'block';
            console.log("splashed screen")
        }
    }, 1500);
}

function isBeinModified(){
    // read params and do things
}


//by default, splashScreenDiv is set to block and settingsDiv is set to none
function init2(){
    let param = window.location.search.split('?')[1]; // perhaps it's better to read the post params
    if(param == undefined){
        //first run, show splash screen
        splashScreen();
    }else{
        //it's being modified, don't show splash screen
        document.getElementById('splashScreenDiv').style.display = 'none';
        document.getElementById('settingsDiv').style.display = 'block';
        //now get params and do things
        isBeinModified();
    }
}
