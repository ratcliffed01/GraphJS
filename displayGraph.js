    function getXmlHttpRequest() {
        try {
            // Firefox, Opera 8.0+, Safari
            return new XMLHttpRequest();
        }
        catch (e) {
            // Internet Explorer
            try {
                return new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e) {
                try {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch (e) {
                    alert("Your browser does not support AJAX!");
                    return null;
                }
            }
        }
    }
function executeFormular(ctx, range, baseX, baseY, totX, totY, f){
	var i = range.xstart;
	var x = baseX;
	var y = baseY;

	var res = "";
	var rad = 0;

	while (i < range.xend){
    		ctx.moveTo(x,y);
		i++;
		if (f.indexOf("sin")>-1 || f.indexOf("cos")>-1 || f.indexOf("tan")>-1){
			rad = i * (Math.PI/180);
		}else{
			rad = i;
		}
		res = f.replace(/xx/g,rad);
		y = baseY - (eval(res) / range.yend) * (totY);
		x = baseX + (i / range.xend) * (totX)
    		ctx.lineTo(x,y);
    		ctx.stroke();
		//alert("x="+x+" y="+y+" sin="+Math.sin(i * (Math.PI/180)));
	}
}
function displaySin(ctx, range, baseX, baseY, totX, totY){
	var i = range.xstart;
	var x = baseX;
	var y = baseY;

	while (i < range.xend){
    		ctx.moveTo(x,y);
		i++;
		y = baseY - ((Math.sin(i * (Math.PI/180))) / range.yend) * (totY);
		x = baseX + (i / range.xend) * (totX)
    		ctx.lineTo(x,y);
    		ctx.stroke();
		//alert("x="+x+" y="+y+" sin="+Math.sin(i * (Math.PI/180)));
	}
}

function displayCos(ctx, range, baseX, baseY, totX, totY){
	var i = range.xstart;
	var x = baseX;				//cosine starts at 1 which is top of graph
	var y = 0;
    	ctx.strokeStyle = "red";
    	ctx.beginPath();
	while (i < range.xend){
    		ctx.moveTo(x,y);
		i++;
		y = baseY - ((Math.cos(i * (Math.PI/180))) / range.yend) * (totY);
		x = baseX + (i / range.xend) * (totX)
    		ctx.lineTo(x,y);
    		ctx.stroke();
		//alert("x="+x+" y="+y+" sin="+Math.sin(i * (Math.PI/180)));
	}
}

    var counter = Math.floor(Math.random() * 1000);

function drawCircle(ctx,r,baseX,baseY,fill){
	var i = 0;
	var x = baseX + r;				
	var y = baseY;
    	ctx.beginPath();
	while (r > 0){
		while (i < 360){
    			ctx.moveTo(x,y);
			i++;
			y = baseY + r*(Math.sin(i * (Math.PI/180)));
			x = baseX + r*(Math.cos(i * (Math.PI/180)));
    			ctx.lineTo(x,y);
    			ctx.stroke();
			//alert("x="+x+" y="+y+" bx="+baseX+" sin="+Math.cos(i * (Math.PI/180)));
		}
		if (fill){
			i = 0;
			r = r - 1;
		}else{
			break;
		}
	}
}

function drawGridh(ctx, canvas, x, y, c, range, cap, xtype){
	//alert("x="+x+" y="+y);
	var h = canvas.height - 100;
	if (range.ystart<0) h = canvas.height;
	ctx.save();
    	ctx.strokeStyle = c;
    	ctx.beginPath();
    	ctx.moveTo(0,y);
    	ctx.lineTo(canvas.width,y);
    	ctx.stroke();
    	ctx.beginPath();
    	ctx.moveTo(x,0);
    	ctx.lineTo(x,h);
    	ctx.stroke();

	ctx.fillStyle = "white";
    	ctx.font = "15px Arial";

	if (xtype == "Formular"){
		ctx.fillText(range.xend, canvas.width - 25, y + 17);
		ctx.fillText(range.yend, x+5,10);
		if (range.ystart<0)
			ctx.fillText(range.ystart, x+5,canvas.height);
		if (range.xstart<0){
			ctx.fillText(range.xstart, 5,y + 17);
			ctx.fillText("0", x + 7, y + 17);
		}else{
			ctx.fillText(range.xstart, x + 7, y + 17);
		}
	}
	ctx.fillText(cap, canvas.width/2 - cap.length/2, canvas.height);
    	ctx.restore();

}

function getFormularRange(xmlDoc){

	var xs = xmlDoc.getElementsByTagName("xstart");
	var xe = xmlDoc.getElementsByTagName("xend");
	var ys = xmlDoc.getElementsByTagName("ystart");
	var ye = xmlDoc.getElementsByTagName("yend");

	var range = {	xstart:xs[0].childNodes[0].nodeValue	,
			xend:xe[0].childNodes[0].nodeValue	, 
			ystart:ys[0].childNodes[0].nodeValue	, 
			yend:ye[0].childNodes[0].nodeValue		};

	return range;
}

function getDataRange(xmlDoc) {

	var d = xmlDoc.getElementsByTagName("desc");
	var vx = xmlDoc.getElementsByTagName("valuex");
	var vy = xmlDoc.getElementsByTagName("valuey");
	var i = 0;
	var minx = Number(vx[0].childNodes[0].nodeValue);
	var maxx = Number(vx[0].childNodes[0].nodeValue);
	var miny = Number(vy[0].childNodes[0].nodeValue);
	var maxy = Number(vy[0].childNodes[0].nodeValue);

	while (i < d.length){
		if (minx > Number(vx[i].childNodes[0].nodeValue)) minx = Number(vx[i].childNodes[0].nodeValue);
		if (maxx < Number(vx[i].childNodes[0].nodeValue)) maxx = Number(vx[i].childNodes[0].nodeValue);
		if (miny > Number(vy[i].childNodes[0].nodeValue)) miny = Number(vy[i].childNodes[0].nodeValue);
		if (maxy < Number(vy[i].childNodes[0].nodeValue)) maxy = Number(vy[i].childNodes[0].nodeValue);
		i++;
	}

	maxx = Math.ceil(maxx + maxx/10);
	maxy = Math.floor(maxy + maxy/10);
	if (minx > 0) minx = 0;
	if (miny > 0) miny = 0;

	//alert("mx="+minx+" my="+miny+" maxy="+maxy+" i="+i+" maxx="+maxx);

	var range = {	xstart:minx	,
			xend:maxx	, 
			ystart:miny	, 
			yend:maxy		};

	return range;

}

function displayData(ctx, range, baseX, baseY, totX, totY, xmlDoc){

	var i = range.xstart;
	var x = baseX;				
	var y = baseY;

	var d = xmlDoc.getElementsByTagName("desc");
	var vx = xmlDoc.getElementsByTagName("valuex");
	var vy = xmlDoc.getElementsByTagName("valuey");

    	ctx.beginPath();
	while (i < range.xend){
    		ctx.strokeStyle = "red";
    		ctx.moveTo(x,y);
		y = baseY - ( vy[i].childNodes[0].nodeValue / range.yend) * (totY);
		x = baseX + ((i + 1)/ range.xend) * (totX)
    		ctx.lineTo(x,y);
    		ctx.stroke();
		//alert("x="+x+" y="+y+" sin="+Math.sin(i * (Math.PI/180)));
		drawCircle(ctx,4,x,y,false);

		ctx.fillStyle = "white";
	    	ctx.font = "15px Arial";
		ctx.fillText(d[i].childNodes[0].nodeValue, x, baseY + 15);
		ctx.fillText(vy[i].childNodes[0].nodeValue, x + 5, y);
		i++;
	}
}

function displayGraph(xml){

	xmlDoc = xml.responseXML;
	var c1 = xmlDoc.getElementsByTagName("caption");
	var t = xmlDoc.getElementsByTagName("type");
	var cap = c1[0].childNodes[0].nodeValue;
	var xtype = t[0].childNodes[0].nodeValue;

	if (xtype == "Formular"){
		var f = xmlDoc.getElementsByTagName("formular");
		var c = xmlDoc.getElementsByTagName("colour");

		var range = getFormularRange(xmlDoc);

		var col = c[0].childNodes[0].nodeValue;
		var formular = f[0].childNodes[0].nodeValue;
		cap += " " + formular;
	}else{
		var range = getDataRange(xmlDoc);
	}

	var q = String.fromCharCode(34);		//quotes

	var canvas = document.getElementById("can");
	var ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	var totX = 0;
	var totY = 0;
	var baseX = 0;
	var baseY = 0;
	if (range.xstart<0 && range.ystart<0){
		baseX = canvas.width/2;
		baseY = canvas.height/2;
		totX = canvas.width/2;
		totY = canvas.height/2;

	} else if (range.xstart>-1 && range.ystart<0){
		baseX = 0;
		baseY = canvas.height/2;
		totX = canvas.width;
		totY = canvas.height/2;

	} else if (range.xstart<0 && range.ystart>-1){
		baseX = canvas.width/2;
		baseY = canvas.height - 100;
		totX = canvas.width/2;
		totY = canvas.height - 100;

	} else {
		baseX = 0;
		baseY = canvas.height - 100;
		totX = canvas.width;
		totY = canvas.height - 100;

	}

	drawGridh(ctx, canvas, baseX, baseY, "white", range, cap, xtype);

	ctx.save();
    	ctx.strokeStyle = col;
    	ctx.beginPath();

	if (xtype == "Formular"){
		executeFormular(ctx, range, baseX, baseY, totX, totY, formular);
	}else{
		displayData(ctx, range, baseX, baseY, totX, totY, xmlDoc);
	}
	//displaySin(ctx, range, baseX, baseY, totX, totY);

	//displayCos(ctx, range, baseX, baseY, totX, totY);

	//display blue circle
	drawCircle(ctx,10,200,200,false);

    	ctx.restore();

	//var theinstruct = "Math.sin(30)";
	//var y = eval(theinstruct);
	//alert("y="+y);
}

function openGraphFile(){

	var allText = "";
	var xx = document.getElementById("FF2").files[0].name;

        var xmlHttp = getXmlHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4) {
		displayGraph(this);
                //alert("alltxt="+xmlHttp.status+" - "+allText);
	    }
        }
    	xmlHttp.open("GET", xx, true);
        xmlHttp.send();

}