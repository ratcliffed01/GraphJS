
    function getXmlHttpRequestBc() {
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

function drawGrid(ctx, x, y, c){
	ctx.save();
    	ctx.strokeStyle = c;
    	ctx.beginPath();
    	ctx.moveTo(100,y - 100);
    	ctx.lineTo(x,y - 100);
    	ctx.stroke();
    	ctx.beginPath();
    	ctx.moveTo(100,0);
    	ctx.lineTo(100,y - 100);
    	ctx.stroke();
    	ctx.restore();
}

function displayBarChart(xml){

	xmlDoc = xml.responseXML;
	var d = xmlDoc.getElementsByTagName("desc");
	var vy = xmlDoc.getElementsByTagName("valuey");
	var col = xmlDoc.getElementsByTagName("colour");
	var cap = xmlDoc.getElementsByTagName("caption");
	var f = xmlDoc.getElementsByTagName("filename");

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

	var canvas = document.getElementById("bar");
	var ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	var data = v1;
	var myColor = c; // Colors of each slice

	var i =0;

	var baseX = 100;
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
	caption = cap[0].childNodes[0].nodeValue;
	filen = f[0].childNodes[0].nodeValue;
	caption = filen + " - " + caption;
	ctx.save();
    	ctx.fillStyle = "white";
	ctx.font = "15px Arial";
	ctx.fillText(caption, (canvas.width/2 - caption.length/2), baseY + 50);
    	ctx.restore();

}

//===============================================================
function openCanvBarChart(){

	var xx = document.getElementById("FF").files[0].name;
	//alert("opencanvbarchart - "+xx);

	var xhr = getXmlHttpRequestBc();
	xhr.open('GET', xx, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
		displayBarChart(this);
                //alert("alltxt="+xhr.responseText);
	    }
        }
        xhr.send();

}