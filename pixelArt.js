
/* ==========================================================
 * Global variables
 * ========================================================== */
var PDIM = 5; // 1 "pixel"s width and height in real pixels
var PPERROW = 0; // pixels per row
var PPERCOL = 0; // pixels per column

var BDIM = 50; // dimensions of the brushes

var CBDIM = 110; // dimensions of the custom brush
var CPDIM = 10; // 1 "pixel"s width and height in real pixel for the custom brush

var CPB = [];

var paintBrushRadius = 3;
var custom = false;
var selectedColor = "black";

var palette = [
	"grey",
	"purple",
	"blue",
	"green",
	"yellow",
	"orange",
	"red",
	"white",
	"black"];


var numPaletteColors = 9;
var numBrushes = 6;

function getNextColor(curColor){
	if(curColor == "black"){
		return "white";
	}
	else{
		return "black"
	}
}

function getPNum(col, row){
	return (PPERROW * row) + col;
}

function rgbStringParse(color){
	var start = color.indexOf("(") + 1;
	var end = color.indexOf(")");
	
	var temp = color.substring(start, end);
	
	var colors = temp.split(", ")
	
	for(i = 0; i < 3; i++){
		colors[i] = parseInt(colors[i]);
	}
	
	return colors;
}

function rgbToHsl(rgb){
	var hsl = [0, 0, 0];
	
	R = rgb[0]/255;
	G = rgb[1]/255;
	B = rgb[2]/255;
	
	var min = Math.min(R, G, B);
	var max = Math.max(R, G, B);
	
	var delta = max - min;
	
	if(delta == 0){
		hsl[0] = 0;
	} else if(max == R){		
		hsl[0] = (60.0 * (((G - B)/ delta)));
	} else if(max == G){		
		hsl[0] = (60.0 * (((B - R)/ delta) + 2.0));
	} else{		
		hsl[0] = (60.0 * (((R - G)/ delta) + 4.0));
	}
	
	hsl[2] = (max + min) / 2;
	
	if(delta == 0){
		hsl[1] = 0;
	}
	else{
		hsl[1] = delta / (1 - Math.abs((2 * hsl[2]) - 1));
	}
	
	hsl[1] *= 100;
	hsl[2] *= 100;
	
	return hsl;
}

function paintPixel(pixel, color){
	// pixel.style.opacity = 0;
	pixel.style.backgroundColor = color;
	pixel.setAttribute("color", color);
}

function paintPixels(centerPixel){
	// get color
	var color = selectedColor;
	
	var orow = parseInt(centerPixel.getAttribute("rowNum"));
	var ocol = parseInt(centerPixel.getAttribute("colNum"));
	
	if(custom){
		dimRow = CBDIM/CPDIM;
		dimCol = CBDIM/CPDIM;
		
		row = orow - parseInt(dimRow / 2);
		col = ocol - parseInt(dimCol / 2);
		
		if(row < 0){
			dimRow += row;
			row = 0;
		}
		if(col < 0){
			dimCol += col;
			col = 0;
		}
		
		for(i = 0; i < dimRow; i++){
			for(j = 0; j < dimCol; j++){
				if(CPB[i][j]){
					if((col+j >= PPERCOL) || (row+i) >= PPERROW){
						break;
					}
					var pNum = getPNum(col+j, row+i);
					var toPaint = document.getElementById("pixel" + pNum);
					paintPixel(toPaint, color);
				}
			}	
		}
		
	}
	else{
		// paint pixels
		for(i = 0; i < paintBrushRadius; i++){
			col = ocol - (paintBrushRadius - i) + 1;
			row = orow - i;
			var numToPaint = ((paintBrushRadius - i) * 2) - 1;
			
			if(col < 0){
				numToPaint += col;
				col = 0;
			}
			else if(col >= PPERCOL){
				break;
			}
			
			// top
			if(row >= 0){
				var pNum = getPNum(col, row);
				var toPaint = document.getElementById("pixel" + pNum);

				for(j = 0; j < numToPaint; j++){
					paintPixel(toPaint, color);
					toPaint = toPaint.nextSibling;
					
					if(toPaint == undefined)
						break;
				}
			}
			
			// bottom
			row = orow + i;
			if( row < PPERROW ){
				pNum = getPNum(col, row);
				toPaint = document.getElementById("pixel" + pNum);
				
				for(j = 0; j < numToPaint; j++){
					paintPixel(toPaint, color);
					toPaint = toPaint.nextSibling;
						if(toPaint == undefined)
							break;
				}
			}
		}
	}
}

function initializeCanvas(){
	var canvas = document.getElementById("canvas");
	var canvasStyle = window.getComputedStyle(canvas);
	var width = parseInt(canvasStyle.getPropertyValue("width"));
	var height = parseInt(canvasStyle.getPropertyValue("height"));
	
	PPERROW = width/PDIM;
	PPERCOL = height/PDIM;
	
	var count = 0;
	
	for( i=0; i < height; i += PDIM){
		
		var row = document.createElement("div");
		row.setAttribute("id", "row" + i/PDIM);
		
		for( j=0; j < width; j += PDIM){
			var pixel = document.createElement("div");
			pixel.setAttribute("class", "pixel");
			pixel.setAttribute("color", "red");
			
			pixel.setAttribute("rowNum", i/PDIM);
			pixel.setAttribute("colNum", j/PDIM);
			
			pixel.setAttribute("id", "pixel" + count);
			
			pixel.style.width = PDIM + "px";
			pixel.style.height = PDIM + "px";
			
			pixel.style.marginTop = i + "px";
			pixel.style.marginLeft = j + "px";
			
			pixel.addEventListener("mouseover", function(e){
				if( e.buttons == 1){
					paintPixels(event.target);
				}
			});
			
			pixel.addEventListener("mousedown", function(){
				paintPixels(event.target)
			});
			
			row.appendChild(pixel);
			count++;
		}
		
		canvas.appendChild(row);
	}
}

function initializeHueSelector(){
	var selector = document.getElementById("hueColorSelector");
	var width = window.getComputedStyle(selector).getPropertyValue("width");

	var n = parseInt(width);
	var pWidth = parseInt(width)/n;
	
	var weight = 360/n;
	
	var hue = 0;
	var count = 0;
	
	for(i = 0; i < n; i++){
		hue = i*weight;
		
		var pixel = document.createElement("div");
		pixel.setAttribute("class", "pixelHue");
		pixel.style.marginLeft = count * pWidth + "px";
		pixel.style.backgroundColor = "hsl(" + hue + ", 100%, 50%)";
		pixel.style.width = pWidth + "px";
		
		pixel.addEventListener("click", function(){
			var color = window.getComputedStyle(event.target).getPropertyValue("background-color");
			updateSelectedColor(color);
		});
		
		selector.appendChild(pixel);
		
		count++;
	}
}

function updateLightnessSelector(hue, saturation){
	var selector = document.getElementById("lightnessColorSelector");

	var width = window.getComputedStyle(selector).getPropertyValue("width");

	var n = parseInt(width);
	var pWidth = parseInt(width)/n;
	
	var weight = 100 / n;
	
	var lightness = 0;
	var count = 0;
	
	for(i = 0; i < n; i++){
		lightness = i*weight;
		
		var pixel = document.createElement("div");
		pixel.setAttribute("class", "pixelLightness");
		pixel.style.marginLeft = count * pWidth + "px";
		pixel.style.backgroundColor = "hsl(" + hue + ", " + saturation + "%, " + lightness + "%)";
		pixel.style.width = pWidth + "px";
		
		pixel.addEventListener("click", function(){
			var color = window.getComputedStyle(event.target).getPropertyValue("background-color");
			updateSelectedColor(color);
		});
		
		selector.appendChild(pixel);
		
		count++;
	}
}

function updateSaturationSelector(hue, lightness){
	var selector = document.getElementById("saturationColorSelector");

	var width = window.getComputedStyle(selector).getPropertyValue("width");

	var n = parseInt(width);
	var pWidth = parseInt(width)/n;
	
	var weight = 100 / n;
	
	var saturation = 0;
	var count = 0;
	
	for(i = 0; i < n; i++){
		saturation = i*weight;
		
		var pixel = document.createElement("div");
		pixel.setAttribute("class", "pixelSaturation");
		pixel.style.marginLeft = count * pWidth + "px";
		pixel.style.backgroundColor = "hsl(" + hue + ", " + saturation + "%, " + lightness + "%)";
		pixel.style.width = pWidth + "px";
		
		pixel.addEventListener("click", function(){
			var color = window.getComputedStyle(event.target).getPropertyValue("background-color");
			updateSelectedColor(color);
		});
		
		selector.appendChild(pixel);
		
		count++;
	}
}

function updateSelectedColor(color){
	
	var display = document.getElementById("selectedColor");
	var info = document.getElementById("selectedColorInfo");
	
	selectedColor = color;
	display.style.backgroundColor = color;
	
	var rgb = rgbStringParse(color);
	var hsl = rgbToHsl(rgb);
	
	info.style.color = "rgb(" + (255 - rgb[0]) + ", " + (255 - rgb[1]) + ", " + (255 - rgb[2]) + ")"
	info.innerHTML = "r: " + rgb[0] + "<br>g: " + rgb[1] + "<br>b: " + rgb[2];

	updateLightnessSelector(hsl[0], hsl[1]);
	updateSaturationSelector(hsl[0], hsl[2]);	
}

function addToPalette(){
	palette.push(selectedColor);
	
	if(palette.length > numPaletteColors){
		palette.shift();
	}
	
	colorPalette();
}

function colorPalette(){
	var paletteColors = document.getElementById("paletteColors");
	var paletteColor = paletteColors.firstChild;
	
	for(i = palette.length - 1; i >= 0; i--){
		if(paletteColor == undefined){
			break;
		}
		
		paletteColor.style.backgroundColor = palette[i];
		
		paletteColor = paletteColor.nextSibling;
	}
}

function initializePalette(){
	var paletteColors = document.getElementById("paletteColors");
	
	for(i = 0; i < numPaletteColors; i++){		
		var paletteColor = document.createElement("div");
		paletteColor.setAttribute("class", "paletteColor");
		
		paletteColor.addEventListener("click", function(){
			var color = window.getComputedStyle(event.target).getPropertyValue("background-color");
			updateSelectedColor(color);
		});
		
		paletteColors.appendChild(paletteColor);
	}
	
	colorPalette();
}

function initializeBrushes(){
	var sampleBrushes = document.getElementById("sampleBrushes");
	
	for(i = 0; i < numBrushes; i++){		
		var brush = document.createElement("div");
		brush.setAttribute("class", "sampleBrush");
		brush.setAttribute("id", "sampleBrush" + i);
		brush.setAttribute("brushNum", i);
		
		brush.addEventListener("click", function(){
			if(custom == false){
				var b = document.getElementById("sampleBrush" + (paintBrushRadius - 1));
				b.style.borderColor = "silver";
			}
			else{
				var b = document.getElementById("customBrush");
				b.style.borderColor = "silver";
			}
			
			var n = parseInt((event.target).getAttribute("brushNum"));
			paintBrushRadius = n + 1;
			
			var b = document.getElementById("sampleBrush" + n);
			b.style.borderColor = "black";
			
			custom = false;
			paintCustomBrush();
		});
		
		sampleBrushes.appendChild(brush);
	}
	
	initializeSampleBrushes();
	initializeCustomBrush();

	paintBrushRadius = parseInt(1);
	
	var b = document.getElementById("sampleBrush" + (paintBrushRadius - 1));
	b.style.borderColor = "black";
	
	paintCustomBrush();
}

function clearCustomBrush(){
	var customBrush = document.getElementById("customBrush");
	
	// paint pixels
	for(i = 0; i < (CBDIM/CPDIM); i++){
		var pixel = document.getElementById("cbrushpixel" + i*(CBDIM/CPDIM));
		for(j = 0; j < (CBDIM/CPDIM); j++){
			CPB[i][j] = false;
			pixel.style.backgroundColor = "white";
			pixel = pixel.nextSibling;
		}
	}	
}

function paintCustomBrush(){
	clearCustomBrush();
	
	var col = parseInt((CBDIM / CPDIM) / 2);
	var row = parseInt((CBDIM / CPDIM) / 2); 
	var i = ((CBDIM / CPDIM) * row) + col;

	var centerPixel = document.getElementById("cbrushpixel" + i);
	
	// get color
	var color = "black";
	
	var orow = parseInt(centerPixel.getAttribute("rowNum"));
	var ocol = parseInt(centerPixel.getAttribute("colNum"));
	
	paintPixel(centerPixel, color);
	
	// paint pixels
	for(i = 0; i < paintBrushRadius; i++){
		col = ocol - (paintBrushRadius - i) + 1;
		row = orow - i;
		
		var numToPaint = ((paintBrushRadius - i) * 2) - 1;
		
		if(col < 0){
			numToPaint += col;
			col = 0;
		}
		else if(col >= (BDIM / PDIM)){
			break;
		}
		
		// top
		if(row >= 0){
			var pNum = ((BDIM / PDIM) * row) + col;
			
			var toPaint = document.getElementById("cbrushpixel" + pNum);

			for(j = 0; j < numToPaint; j++){
				
				CPB[row][col + j] = true;
				
				paintPixel(toPaint, color);
				toPaint = toPaint.nextSibling;
				
				if(toPaint == undefined)
					break;
			}
		}
		
		// bottom
		row = orow + i;
		if( row < (BDIM / PDIM) ){
			var pNum = ((BDIM / PDIM) * row) + col;
			var toPaint = document.getElementById("cbrushpixel" + pNum);

			for(j = 0; j < numToPaint; j++){
				
				CPB[row][col + j] = true;
				
				paintPixel(toPaint, color);
				toPaint = toPaint.nextSibling;
				
				if(toPaint == undefined)
					break;
			}
		}
	}
}

function initializeCustomBrush(){
	var customBrush = document.getElementById("customBrush");
	var customBrushStyle = window.getComputedStyle(customBrush);
	CBDIM = parseInt(customBrushStyle.getPropertyValue("width"));
	
	var dim = CBDIM/CPDIM;
	CPB = new Array(dim);
	
	for(i=0; i < dim; i++){
		CPB[i] = new Array(dim);
		
		for(j=0; j < dim; j++){
			CPB[i][j] = false;
		}
	}
	
	
	var count = 0;
	for( i=0; i < CBDIM; i += CPDIM){
		
		var row = document.createElement("div");
		
		for( j=0; j < CBDIM; j += CPDIM){
			var pixel = document.createElement("div");
			pixel.setAttribute("class", "pixelCustomBrush");
			
			pixel.setAttribute("rowNum", i/CPDIM);
			pixel.setAttribute("colNum", j/CPDIM);
			
			pixel.setAttribute("id", "cbrushpixel" + count);
			
			pixel.style.width = CPDIM + "px";
			pixel.style.height = CPDIM + "px";
			
			pixel.style.marginTop = i + "px";
			pixel.style.marginLeft = j + "px";
			
			
			pixel.addEventListener("click", function(){
				if(custom == false){
					var b = document.getElementById("sampleBrush" + (paintBrushRadius - 1));
					b.style.borderColor = "silver";
				}
				
				var row = (event.target).getAttribute("rowNum");
				var col = (event.target).getAttribute("colNum");
				
				CPB[row][col] = !CPB[row][col];
				
				if(CPB[row][col]){
					(event.target).style.backgroundColor = "black";
				}else{
					(event.target).style.backgroundColor = "white";
				}
				
				b = document.getElementById("customBrush");
				b.style.borderColor = "black";
				
				custom = true;
			});
			
			pixel.addEventListener("oncontextmenu", function(){
				if(custom == false){
					var b = document.getElementById("sampleBrush" + (paintBrushRadius - 1));
					b.style.borderColor = "silver";
				}
				
				var row = (event.target).getAttribute("rowNum");
				var col = (event.target).getAttribute("colNum");
				
				CPB[row][col] = false;
				
				if(CPB[row][col]){
					(event.target).style.backgroundColor = "black";
				}else{
					(event.target).style.backgroundColor = "white";
				}
				
				b = document.getElementById("customBrush");
				b.style.borderColor = "black";
				
				custom = true;
			});
			
			pixel.addEventListener("mouseover", function(e){
				if(e.buttons > 0 && e.buttons <= 3){
					if(custom == false){
						var b = document.getElementById("sampleBrush" + (paintBrushRadius - 1));
						b.style.borderColor = "silver";
					}
					
					var row = (event.target).getAttribute("rowNum");
					var col = (event.target).getAttribute("colNum");
					
					if(e.buttons == 1){
						CPB[row][col] = true;
					}
					else{
						CPB[row][col] = false;
					}
					
					if(CPB[row][col]){
						(event.target).style.backgroundColor = "black";
					}else{
						(event.target).style.backgroundColor = "white";
					}
					
					b = document.getElementById("customBrush");
					b.style.borderColor = "black";
					
					custom = true;
				}
			});
			
			row.appendChild(pixel);
			count++;
		}
		
		customBrush.appendChild(row);
	}
}

function initializeSampleBrushes(){
	var sampleBrushes = document.getElementById("sampleBrushes");
	
	var brush = sampleBrushes.firstChild;
	
	var brushStyle = window.getComputedStyle(brush);
	
	BDIM = parseInt(brushStyle.getPropertyValue("width"));
	
	for(n=0; n < numBrushes; n++){
		
		var count = 0;
		
		for( i=0; i < BDIM; i += PDIM){
			
			var row = document.createElement("div");
			
			for( j=0; j < BDIM; j += PDIM){
				var pixel = document.createElement("div");
				pixel.setAttribute("class", "pixel");
				
				pixel.setAttribute("rowNum", i/PDIM);
				pixel.setAttribute("colNum", j/PDIM);
				pixel.setAttribute("brushNum", n);
				
				pixel.setAttribute("id", "brush" + n + "pixel" + count);
				
				pixel.style.width = PDIM + "px";
				pixel.style.height = PDIM + "px";
				
				pixel.style.marginTop = i + "px";
				pixel.style.marginLeft = j + "px";
				
				pixel.style.backgroundColor = "grey";
				pixel.style.opacity = 0;
				
				row.appendChild(pixel);
				count++;
			}
			
			brush.appendChild(row);
		}
		
		brush = brush.nextSibling;
	}
	
	// correctly display brushes
	for(i = 0; i < numBrushes; i++){
		paintBrush(i);
	}
}

function toHex(dec){
	return dec.toString(16);
}

function paintBrush(n){
	var col = parseInt((BDIM / PDIM) / 2); 
	var i = ((BDIM / PDIM) * col) + col;

	var centerPixel = document.getElementById("brush" + n + "pixel" + i);
	
	// get color
	var color = "black";
	
	var orow = parseInt(centerPixel.getAttribute("rowNum"));
	var ocol = parseInt(centerPixel.getAttribute("colNum"));
	
	paintPixel(centerPixel, color);
	paintBrushRadius = n + 1;
	
	// paint pixels
	for(i = 0; i < paintBrushRadius; i++){
		col = ocol - (paintBrushRadius - i) + 1;
		row = orow - i;
		
		var numToPaint = ((paintBrushRadius - i) * 2) - 1;
		
		if(col < 0){
			numToPaint += col;
			col = 0;
		}
		else if(col >= (BDIM / PDIM)){
			break;
		}
		
		// top
		if(row >= 0){
			var pNum = ((BDIM / PDIM) * row) + col;
			
			var toPaint = document.getElementById("brush" + n + "pixel" + pNum);

			for(j = 0; j < numToPaint; j++){
				
				toPaint.style.opacity = 1;
				paintPixel(toPaint, color);
				toPaint = toPaint.nextSibling;
				
				if(toPaint == undefined)
					break;
			}
		}
		
		// bottom
		row = orow + i;
		if( row < (BDIM / PDIM) ){
			var pNum = ((BDIM / PDIM) * row) + col;
			var toPaint = document.getElementById("brush" + n + "pixel" + pNum);

			for(j = 0; j < numToPaint; j++){
				
				toPaint.style.opacity = 1;
				paintPixel(toPaint, color);
				toPaint = toPaint.nextSibling;
				
				if(toPaint == undefined)
					break;
			}
		}
	}
}

function convert(){
	var canvas = document.getElementById("canvas");
	var row = canvas.firstChild;
	
	alertMsg = "P3\n"+ PPERCOL + " " + PPERROW;
	alertMsg += "\n255\n"
	
	for(i = 0; i < PPERROW; i++){

		if(row == null)
			break;
		
		var pixel = row.firstChild;
		var count = 0;
		
		for(j = 0; j < PPERCOL; j++){
			var style = window.getComputedStyle(pixel);
			var color = style.getPropertyValue("background-color");
			var rgb = rgbStringParse(color);
			
			for(k = 0; k < 3; k++){
				var val = "" + rgb[k];
				alertMsg += val;
				alertMsg += " ";
			}
			
			
			
			count++;
			if(count%5 == 0){
				alertMsg += "\n";
			}
			else{
				alertMsg += "  ";
			}
			
			pixel = pixel.nextSibling;
		}
		if(count%5 != 0){
			alertMsg += "\n";
		}
		row = row.nextSibling;
	}
	
	var download = document.getElementById("download");
	
	if(download.href != ""){
		window.URL.revokeObjectURL(download.href);	
	}
	else{
		download.style.display = "initial";
	}
	
	var img = new Blob([alertMsg], {type: "text/plain"});

	download.href = window.URL.createObjectURL(img);	
}

/* ==========================================================
 * onload
 * ========================================================== */
window.onload = function(){
	updateSelectedColor("rgb(255, 0, 0)");
	
	var paletteAdd = document.getElementById("paletteAdd");
	
	paletteAdd.addEventListener("click", addToPalette);
	
	initializeCanvas();
	initializeHueSelector();
	initializePalette();
	initializeBrushes();
	
	var convertButton = document.getElementById("convert");
	convertButton.addEventListener("click", convert);
}