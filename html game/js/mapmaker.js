var map = {};
var addedElements = [];
var removedElements = [];

var selectedElement;
var displayedCategory;
var selectedCategory;

var Buildings = {
	"castle": {		"width": "110px",
					"height": "100px",
					"url": "castle2.png"		},
		
	"hut": {		"width": "30px",
					"height": "25px",
					"url": "hut.png"		},
					
	"strawHut": {	"width": "30px",
					"height": "30px",
					"url": "straw_hut.png"		},
	
	"strawHut": {	"width": "30px",
					"height": "30px",
					"url": "straw_hut.png"		},
};


var Natural = {
	"tree": {		"width": "40px",
					"height": "40px",
					"url": "tree.png"		},
		
	"deadTree": {	"width": "40px",
					"height": "40px",
					"url": "dead_tree.png"	},
					
	"rock": {		"width": "20px",
					"height": "20px",
					"url": "rock.png"		},
	
	"smallHill": {		"width": "100px",
					"height": "50px",
					"url": "hill.png"	},
					
	"largeHill": {	"width": "120px",
					"height": "80px",
					"url": "hill.png"		}
};

var Misc = {
	
};

var Terrain = {
	"snow": 	"white", 
	"dirt":		"brown",
	
};

var Themes = {
	
};


/* ==========================================================
 * drawing
 * ========================================================== */
function mapClick(e){
	
	var mapRect = document.getElementById("map").getBoundingClientRect();
    var xPosition = e.clientX - mapRect.left;
    var yPosition = e.clientY - mapRect.top;
	
	
	if(selectedCategory == Terrain){
		drawOnMap(xPosition, yPosition);
	} 
	else{
		addElementToMap(xPosition, yPosition);
	}
}

function drawOnMap(xPosition, yPosition){
	console.log(xPosition, yPosition);
	
	var canvas = document.getElementById("mapCanvas");
	
	var ctx = canvas.getContext("2d");
	
	ctx.beginPath();
	
	ctx.arc(xPosition, yPosition, 50, 0, Math.PI * 2, true);
	//ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
	
	
	var grd = ctx.createRadialGradient(xPosition,yPosition,0,xPosition,yPosition,50);
	
	grd.addColorStop(0,"rgba(255, 0, 0, 1");
	grd.addColorStop(1,"rgba(255, 0, 0, 0");

	// Fill with gradient
	ctx.fillStyle = grd;
	
	ctx.fill();
	
	ctx.closePath();
}

function addElementToMap(xPosition, yPosition){
	// clear all removed elements from memory
	removedElements = [];
	
	// get element's dimensions
	var elWidth = selectedCategory[selectedElement].width;
	var elHeight = selectedCategory[selectedElement].height;
	
	// get maps's dimensions
	var mapWidth = document.getElementById("map").clientWidth;
	var mapHeight = document.getElementById("map").clientHeight;
	
	// element's rect
	var elTop = (yPosition - (parseInt(elHeight) / 2));
	var elBottom = (yPosition + (parseInt(elHeight) / 2));
	var elLeft = (xPosition - (parseInt(elWidth) / 2));
	var elRight = (xPosition + (parseInt(elWidth) / 2));
	
	var elBackgroundPos = "";
	
	
	// adjust rect based on map
	if( elTop < 0){
		elTop = 0;
		elBackgroundPos = "bottom ";
	}
	
	if( elBottom >  parseInt(mapHeight)){
		elBottom =  parseInt(mapHeight);
		elBackgroundPos = "top ";
	}
	
	if( elLeft < 0){
		elLeft = 0;
		elBackgroundPos += "right";
	}
	if( elRight > parseInt(mapWidth)){
		elRight =  parseInt(mapWidth);
		elBackgroundPos += "left";
	}

	// Create new element
	var newElement = document.createElement("div");
	
	// set ID and class
	newElement.className = "mapElement";
	var numItems = $(".mapElement").length;
	newElement.id = "mapElement" + numItems;
	
	// add to the array of element added to the map
	addedElements.unshift("mapElement" + numItems);
	
	// save element type
	newElement.type = selectedElement;
	
	// set posistion within the map
	newElement.style.marginLeft = elLeft + "px";
	newElement.style.marginTop = elTop + "px";
	
	// set width and height (adjusted for map margins)
	newElement.style.width = elRight - elLeft + "px";
	newElement.style.height = elBottom - elTop + "px";
	
	// adjust background
	newElement.style.backgroundImage = "url(\"../images/" + selectedCategory[selectedElement].url + "\")";
	newElement.style.backgroundSize = elWidth + " " + elHeight;
	newElement.style.backgroundPosition = elBackgroundPos;
	
	// set zIndex based on the lowest point of the element
	newElement.style.zIndex = parseInt(elBottom);
		
	
	// add new element to map
	document.getElementById("mapFeatures").appendChild(newElement);
}

/* ==========================================================
 * selection
 * ========================================================== */
function updateSelections(){
	// remove all childern of selection div
	var selectionDiv = document.getElementById("selection");
	while (selectionDiv.firstChild) {
		selectionDiv.removeChild(selectionDiv.firstChild);
	}
	
	if(displayedCategory == Terrain){
		return;
	}
	else if(displayedCategory == Themes){
		return;
	}
	else{
		for(var key in displayedCategory){
			var newElement = document.createElement("div");
			newElement.className = "selectionElement";
			newElement.id = key;
			
			newElement.style.width = displayedCategory[key].width;
			newElement.style.height = displayedCategory[key].height;
			newElement.style.backgroundImage = "url(\"../images/" + displayedCategory[key].url + "\")";
			newElement.style.backgroundSize = displayedCategory[key].width + " " + displayedCategory[key].height;
			
			newElement.addEventListener("click", function(){
				console.log(event.target.id);
				
				if(selectedCategory == displayedCategory){
					el = document.getElementById(selectedElement);
					el.style.borderColor = "black";
				}
				
				selectedCategory = displayedCategory;
				selectedElement = event.target.id;
				
				document.getElementById(selectedElement).style.borderColor = "red";
			});
			
			selectionDiv.appendChild(newElement);
		}
		
		if(selectedCategory == displayedCategory){
			document.getElementById(selectedElement).style.borderColor = "red";
		}
	}
}

/* ==========================================================
 * onload
 * ========================================================== */
window.onload = function(){
	var m = document.getElementById("map");
	m.addEventListener("click", mapClick);
	
	m.addEventListener("mousemove", function(e){
		if(e.buttons == 1 && selectedCategory == Terrain){
			var mapRect = document.getElementById("map").getBoundingClientRect();
			var xPosition = e.clientX - mapRect.left;
			var yPosition = e.clientY - mapRect.top;
			
			drawOnMap(xPosition, yPosition);
		}
	});
	
	//setInterval(checkDraw, 10);
	
	var b = document.getElementById("BuildingsCategoryButton");
	b.addEventListener("click", function(){
		displayedCategory = Buildings;
		updateSelections();
	});
	
	b = document.getElementById("NaturalCategoryButton");
	b.addEventListener("click", function(){
		displayedCategory = Natural;
		updateSelections();
	});
	
	b = document.getElementById("MiscCategoryButton");
	b.addEventListener("click", function(){
		displayedCategory = Misc;
		updateSelections();
	});
	
	b = document.getElementById("TerrainCategoryButton");
	b.addEventListener("click", function(){
		displayedCategory = Terrain;
		updateSelections();
	});
	
	b = document.getElementById("ThemesCategoryButton");
	b.addEventListener("click", function(){
		displayedCategory = Themes;
		updateSelections();
	});
	
	
	displayedCategory = Buildings;
	selectedCategory = Terrain;
	selectedElement = "castle";
	
	var mouseDown = false;
	
	updateSelections();
}


/* ==========================================================
 * keyboard
 * ========================================================== */
document.onkeydown = function(key){
	if (key.keyCode == 90 && key.ctrlKey) {
        undo();
    }
	else if (key.keyCode == 89 && key.ctrlKey) {
        redo();
    }
};

function undo(){
	if(addedElements.length > 0){
		var idToRemove = addedElements.shift();
		var removedElement = document.getElementById(idToRemove);
		removedElement.parentNode.removeChild(removedElement);
		removedElements.unshift(removedElement);
	}
}

function redo(){
	if(removedElements.length > 0){
		var el = removedElements.shift();
		addedElements.unshift(el.id);
		document.getElementById("mapFeatures").appendChild(el);
	}
}