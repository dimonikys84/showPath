

//Кодирование ссылки

function base64_encode( data ) {	// Encodes data with MIME base64
	// 
	// +   original by: Tyler Akins (http://rumkin.com)
	// +   improved by: Bayron Guevara

	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var o1, o2, o3, h1, h2, h3, h4, bits, i=0, enc='';

	do { // pack three octets into four hexets
		o1 = data.charCodeAt(i++);
		o2 = data.charCodeAt(i++);
		o3 = data.charCodeAt(i++);

		bits = o1<<16 | o2<<8 | o3;

		h1 = bits>>18 & 0x3f;
		h2 = bits>>12 & 0x3f;
		h3 = bits>>6 & 0x3f;
		h4 = bits & 0x3f;

		// use hexets to index into b64, and append result to encoded string
		enc += b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	} while (i < data.length);

	switch( data.length % 3 ){
		case 1:
			enc = enc.slice(0, -2) + '==';
		break;
		case 2:
			enc = enc.slice(0, -1) + '=';
		break;
	}

	return enc;
}

// Декодирование ссылки

function base64_decode( data ) {	// Decodes data encoded with MIME base64
	// 
	// +   original by: Tyler Akins (http://rumkin.com)


	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var o1, o2, o3, h1, h2, h3, h4, bits, i=0, enc='';

	do {  // unpack four hexets into three octets using index points in b64
		h1 = b64.indexOf(data.charAt(i++));
		h2 = b64.indexOf(data.charAt(i++));
		h3 = b64.indexOf(data.charAt(i++));
		h4 = b64.indexOf(data.charAt(i++));

		bits = h1<<18 | h2<<12 | h3<<6 | h4;

		o1 = bits>>16 & 0xff;
		o2 = bits>>8 & 0xff;
		o3 = bits & 0xff;

		if (h3 == 64)	  enc += String.fromCharCode(o1);
		else if (h4 == 64) enc += String.fromCharCode(o1, o2);
		else			   enc += String.fromCharCode(o1, o2, o3);
	} while (i < data.length);

	return enc;
}

// Полчение параметров из ссылки

function parseGetParams() { 
   var $_GET = {}; 
   var __GET = window.location.search.substring(1).split("&"); 
   for(var i=0; i<__GET.length; i++) { 
      var getVar = __GET[i].split("="); 
      $_GET[getVar[0]] = typeof(getVar[1])=="undefined" ? "" : getVar[1]; 
   } 
   return $_GET; 
}

// Обновление параметров в ссылке

function pushUrl() {
    var imgSrc = document.getElementById("imgSrc").value;
    var vMode = document.getElementById("vMode").value;
    
    history.replaceState({state: 1}, "state 1","?vmode=" + vMode + "&imgsrc=" + base64_encode(imgSrc));
    
    makeScene();

}

// Узнаем размер изображения

function imageSize(imgSrc) {
	$("body").append("<img class='scopeImg' src='" + imgSrc + "'>");
	var sizes = [];
	var width = $(".scopeImg").width();
	var height = $(".scopeImg").height();
	sizes.push(width,height);
	$(".scopeImg").remove();
	
	return sizes;
	
}

// Создание\Обновление сцены

function makeScene() {
    var GETArr = parseGetParams();   
	var imgSrcDec = base64_decode(GETArr.imgsrc);
	var imgSizes =  imageSize(imgSrcDec);

	var imgWidth = imgSizes[0];
	var imgHeight = imgSizes[1];
	
	
//if (GETArr.vmode == "true") {
//    var panel = document.getElementById("panel").remove();
//} else {
//    document.getElementById("imgSrc").value = base64_decode(GETArr.imgsrc);
//    document.getElementById("imgWidth").value = GETArr.width;
//    document.getElementById("imgHeight").value = GETArr.height;
//    document.getElementById("vMode").value = GETArr.vmode;   
//}
//    
   
$("svg").remove();
    
    
var maxWidth = imgWidth;
var maxHeight = imgHeight;


var paper = Snap(maxWidth, maxHeight);

var img = paper.image(imgSrcDec, 0, 0, maxWidth, maxHeight);

var circ = paper.circle(100, 100, 30);

circ.attr({
    fill: "#fff",
});

img.attr({
    mask: circ
});
    
// Анимация круга

function anim(){
    var ry = Math.random() * maxWidth/150 + 1;
    var tx = Math.random() * maxWidth - 100 + 1;
    var ty = Math.random() * maxHeight - 100 + 1;
    
    setTimeout(function() {
        
        circ.animate({transform: "t" + tx + "," + ty +"s" + ry}, 1000, mina.easeinout, function(){anim()});  
    
    }, 500);
};

setInterval(anim(),0); 
}

makeScene();

 $("input").keyup(function(event){
       if(event.keyCode == 13){
          pushUrl(); 
       }
    });