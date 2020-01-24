function hideInfo(){
    document.getElementById("info").style.visibility  = "hidden";
}
function showInfo(){
    document.getElementById("info").style.visibility  = "visible";
    document.getElementById('description').innerHTML = "";

    document.getElementById('vu').innerHTML ="" ;
}
function hideBrain(){

    var brain= document.getElementById("brain");
    if(brain!=null)
   brain.parentNode.removeChild(brain);

}
