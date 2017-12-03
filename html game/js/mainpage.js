

/* ==========================================================
 * onload
 * ========================================================== */
window.onload = function(){
	
	var b = document.getElementById("playGameButton");
	b.style.display = "none";
	
	b.onclick = function(){
		window.location.href = "game.html";
	}
	
	b = document.getElementById("mapMakerButton");
	
	b.onclick = function(){
		window.location.href = "html/mapMaker.html";
	}
}