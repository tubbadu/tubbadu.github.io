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
    window.screen.orientation.lock('landscape');
   // sizeInit();
}



function sizeInit(){
    //document.getElementById("mainDiv").style.width = window.screen.availWidth + "px";
    document.getElementById("text").style.fontSize = (document.getElementById("main").offsetHeight / 10) + "px";
    document.getElementById("btn").style.fontSize = (document.getElementById("main").offsetHeight / 10) + "px";
}
window.addEventListener('resize', function(event) {
    console.log("resized");
    sizeInit();
}, true);