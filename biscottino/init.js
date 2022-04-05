/*var challengeDivHeight;

function setFontSize(){
    let s = document.getElementById("main").offsetWidth / 20;
    document.getElementById("challenge").style.fontSize = s;
    let actualChallengeDivHeight = document.getElementById("challenge").offsetHeight;
    while(actualChallengeDivHeight > challengeDivHeight){
        s = s-1;
        document.getElementById("challenge").style.fontSize = s;
        actualChallengeDivHeight = document.getElementById("challenge").offsetHeight;
    }
    return s;
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
    challengeDivHeight = document.getElementById("challenge").offsetHeight;
    document.getElementById("category").style.fontSize = (document.getElementById("main").offsetWidth / 19) + "px";
    //document.getElementById("challenge").style.fontSize = getFontSize() + "px";
}
sizeInit()

window.addEventListener('resize', function(event) {
    //console.log("resized");
    sizeInit();
}, true);


/* TODO forse posso chiamare le funzioni di altri file js a cazzo di cane senza fare nient'altro, non ho bisogno della variabile ausiliaria*/
