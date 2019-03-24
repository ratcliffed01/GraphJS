    function getXmlHttpRequestBpc() {
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

    var counter = Math.floor(Math.random() * 1000);

function getLabelPos(centreX, centreY, startseg, endseg){

	// the start of the piechart is 3oclock and goes clockwise
	// the base point is the centre of the piechart

	var rad = 0;
	var x = 0;
	var y = 0;

	var startdeg = startseg * (180/Math.PI);
	var enddeg = endseg * (180/Math.PI);
	var middeg = (startdeg + enddeg)/2;
	var deg = (enddeg - startdeg);

	if (deg < 15)	middeg = middeg + 1;

	var labelRadius = centreY;
	var labeldeg = 0;

	switch (true)
	{
		case (middeg>0 && middeg<90):
			labelRadius = labelRadius - (labelRadius/10);	//subtract 10% from radius
			labeldeg = middeg;
			rad = labeldeg * (Math.PI/180);				//degrees to radians
			x = centreX + labelRadius*Math.cos(rad);
			y = centreY + labelRadius*Math.sin(rad);
			break;

		case (middeg>90 && middeg<180):
			labelRadius = labelRadius - (labelRadius/20);	//subtract 5% from radius
			labeldeg = middeg - 90;
			rad = labeldeg * (Math.PI/180);
			x = centreX - labelRadius*Math.sin(rad);
			y = centreY + labelRadius*Math.cos(rad);
			break;

		case (middeg>180 && middeg<270):
			labelRadius = labelRadius - (labelRadius/20);	//subtract 5% from radius
			labeldeg = middeg - 190;
			rad = labeldeg * (Math.PI/180);
			x = centreX - labelRadius*Math.cos(rad);
			y = centreY - labelRadius*Math.sin(rad);
			break;
		
		case (middeg>270 && middeg<360):
			labelRadius = labelRadius - (labelRadius/10);	//subtract 10% from radius
			labeldeg = middeg - 270;
			rad = labeldeg * (Math.PI/180);
			x = centreX + labelRadius*Math.sin(rad);
			y = centreY - labelRadius*Math.cos(rad);
			break;		
	}

	var pos = new Array(2);

	//alert("x="+x+" y="+y+" deg="+deg+" sdeg="+startdeg+" mdeg="+middeg);
	pos[0] = x;
	pos[1] = y;

	return pos;
}

//===================================================================================
function displayPieChart(canvas, ctx, xmlDoc, xw){

	var d = xmlDoc.getElementsByTagName("desc");
	var vy = xmlDoc.getElementsByTagName("valuey");
	var col = xmlDoc.getElementsByTagName("colour");

	var desc = new Array(12);
	var v1 = new Array(12);
	var v2 = new Array(12);
	var c = new Array(12);

	var pos = new Array(2);

	var h = 400;
	var h1 = 0;
	var tot = 0;

	var cnt = 0;
	while (cnt < d.length){
		desc[cnt] = d[cnt].childNodes[0].nodeValue;
		v1[cnt] = vy[cnt].childNodes[0].nodeValue;
		c[cnt] = col[cnt].childNodes[0].nodeValue;
		tot += Number(v1[cnt]);
		cnt++;
	}

	var q = String.fromCharCode(34);		//quotes

	var startseg = 0;
	var endseg = 0;
	var data = v1;
	var myTotal = tot; // Automatically calculated so don't touch
	var myColor = c; // Colors of each slice

	var dx = 0;
   	var dy = 0;
	var i =0;
	var dd = 0;		//sin requires radians
	var offset = 0;

	// now find what radius can be used up to 500
	var r = (canvas.width - (xw + 200))/2;
	if (r > 250) r = 250;

	//alert("pie - r="+r+" xw="+xw+" cw="+canvas.width);
	while (i < data.length && data[i]!=null) {
	  	ctx.fillStyle = myColor[i];
	  	ctx.beginPath();
	  	ctx.moveTo((xw + 100 + r), r);
	  	// Arc Parameters: x, y, radius, startingAngle (radians), endingAngle (radians), antiClockwise (boolean)
	  	endseg += (Math.PI * 2 * (data[i] / myTotal));
	  	ctx.arc((xw + 100 + r), r, r, startseg, endseg , false);
	  	ctx.lineTo((xw + 100 + r), r);
	  	ctx.fill();
	  	ctx.fillStyle = "black";
    	  	ctx.font = "bold 15px Arial";

	  	pos = getLabelPos((xw + 100 + r), r, startseg, endseg);
	  	dx = pos[0];
	  	dy = pos[1];

	  	//alert("dx="+dx+" dy="+dy+" i="+i+" deg="+dd+" perc="+Math.floor(data[i]*100 / myTotal));

	  	ctx.fillText(Math.floor(data[i]*100 / myTotal)+"%", dx, dy,60);
	  	startseg += Math.PI * 2 * (data[i] / myTotal);
	  	ctx.restore();
	  	i++;
	}
	return (xw + 120 + 2*r);		//bargraph width + space(100) + pie chart + space(50)
}
//=========================================================================
function displayIndex(canvas, ctx, xmlDoc, xw){

	var d = xmlDoc.getElementsByTagName("desc");
	var col = xmlDoc.getElementsByTagName("colour");
	var dx = xw;
	var dy = 30;

	//alert("di - xw="+xw+" cw="+canvas.width);
	var cnt = 0;
	while (cnt < d.length){

	  	ctx.fillStyle = col[cnt].childNodes[0].nodeValue;
		ctx.font = "bold 50px Arial";
		dx = xw;
		ctx.fillText("-", dx, dy);

	  	ctx.fillStyle = "white";
		ctx.font = "15px Arial";
		dx += 40;
		ctx.fillText(d[cnt].childNodes[0].nodeValue, dx, dy);

		dy = dy + 30;
		cnt++;
	}
}

//=============================================================================
function drawGrid(ctx, x, y, c){
	ctx.save();
    	ctx.strokeStyle = c;
    	ctx.beginPath();
    	ctx.moveTo(50,y - 100);
    	ctx.lineTo(x,y - 100);
    	ctx.stroke();
    	ctx.beginPath();
    	ctx.moveTo(50,0);
    	ctx.lineTo(50,y - 100);
    	ctx.stroke();
    	ctx.restore();
}

//==============================================================================
function displayBarChartP(canvas, ctx, xmlDoc){

	var d = xmlDoc.getElementsByTagName("desc");
	var vy = xmlDoc.getElementsByTagName("valuey");
	var col = xmlDoc.getElementsByTagName("colour");

	var desc = new Array(12);
	var v1 = new Array(12);
	var v2 = new Array(12);
	var c = new Array(12);
	var txt = new Array(12);

	var pos = new Array(2);

	var h = 400;
	var h1 = 0;
	var max = 0;

	var cnt = 0;
	while (cnt < d.length){
		desc[cnt] = d[cnt].childNodes[0].nodeValue;
		v1[cnt] = vy[cnt].childNodes[0].nodeValue;
		c[cnt] = col[cnt].childNodes[0].nodeValue;
		if (max < Number(v1[cnt])){
			max = Number(v1[cnt]);
		}
		txt[cnt] = Number(v1[cnt]) + "";
		if (Number(v1[cnt]) > 1000){
			txt[cnt] = Number(v1[cnt])/1000 + ""; 
			txt[cnt] = txt[cnt].substring(0,4) + "K";
			if (txt[cnt].substring(0,4).endsWith("."))
				txt[cnt] = txt[cnt].substring(0,3) + "K"; 
		}
		if (Number(v1[cnt]) > 1000000){
			txt[cnt] = Number(v1[cnt])/1000000 + ""; 
			txt[cnt] = txt[cnt].substring(0,4) + "M";
			if (txt[cnt].substring(0,4).endsWith("."))
				txt[cnt] = txt[cnt].substring(0,3) + "M"; 
		}
		cnt++;
	}

	max = max + (max/10);
	var q = String.fromCharCode(34);		//quotes

	var data = v1;
	var myColor = c; // Colors of each slice

	var i =0;

	var baseX = 50;
	var baseY = canvas.height - 100;

	var xw = baseX + ((cnt+1) * 50);		// width of x axis
	if (xw > canvas.width) xw = canvas.width;
	drawGrid(ctx, xw, canvas.height, "white");

	var x = baseX + 50;
	var y = baseY;
	var w = 20;
	var h = 0;

	// now draw bars
	while (i < data.length && data[i]!=null && x < xw ) {
		ctx.save();
    		ctx.fillStyle=myColor[i];
		h = ((data[i]*100)/max) * (baseY/100);
		y = baseY - h;
    		ctx.fillRect(x,y,w,h);				//draw rectangle
    		ctx.fillStyle = "white";
		ctx.font = "15px Arial";
		ctx.fillText(desc[i], x, baseY + 15);
		ctx.fillText(txt[i], x, y - 5);
		x += 50;
    		ctx.restore();
	  	i++;
	}

	//display xml name and caption
	var cap = xmlDoc.getElementsByTagName("caption");
	var f = xmlDoc.getElementsByTagName("filename");

	caption = cap[0].childNodes[0].nodeValue;
	filen = f[0].childNodes[0].nodeValue;
	caption = filen + " - " + caption;
	ctx.save();
    	ctx.fillStyle = "white";
	ctx.font = "15px Arial";
	ctx.fillText(caption, (xw - caption.length), baseY + 50);
    	ctx.restore();

	return xw;		//width of the graph
}

function displayCharts(xml){

	xmlDoc = xml.responseXML;

	var canvas = document.getElementById("bar");
	var ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	var xw = displayBarChartP(canvas, ctx, xmlDoc);
	xw = displayPieChart(canvas, ctx, xmlDoc, xw);
	displayIndex(canvas, ctx, xmlDoc, xw);

}

//===============================================================
function openBarPieChart(){

	var xx = document.getElementById("FF1").files[0].name;

        var xmlHttp = getXmlHttpRequestBpc();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4) {
		displayCharts(this);
                //alert("alltxt="+xmlHttp.status);
	    }
        }
    	xmlHttp.open("GET", xx, true);
        xmlHttp.send();

}