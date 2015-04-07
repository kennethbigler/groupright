
function genCookieDictionary(){
	var x = document.cookie;
	var x_arr = x.split(";");
	var y = {};
	for(var i = 0; i < x_arr.length; i++){
		var z = x_arr[i].split("=");
		if(z.length > 1) y[z[0].trim()] = z[1].trim();
	}
	return y;
};

function installCookie( user, data, extended, postFn ){
	
	var extra = "";
	if(extended){
		var now = new Date();
		var time = now.getTime();
		var expireTime = time + 30*24*60*60;
		now.setTime(expireTime);
		extra = "expires="+now.toGMTString()+';';
	}
	
	document.cookie="accesscode="+data.trim()+";"+extra+'path=/; secure';
	document.cookie="user="+user+";"+extra+'path=/; secure';
	
	postFn();
}

function checkCookie(goodFn,badFn){

	var _cookies = genCookieDictionary();
	
	if(_cookies.accesscode && _cookies.user){
	
		var obj = {"code":_cookies.accesscode,"email":_cookies.user,"function":"remember_user"};
	
		// Contact Server
		$.ajax("https://www.groupright.net/dev/groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200:goodFn,
				211:badFn
			}
		
		});
	}
};
function eatCookies()
{   
    var cookies = document.cookie.split(";");
    //alert(cookies);
    for (var i = 0; i < cookies.length; i++)
    {   
        var spcook =  cookies[i].split("=");
        deleteCookie(spcook[0]);
    }
    function deleteCookie(cookiename)
    {
        var d = new Date();
        d.setDate(d.getDate() - 1);
        var expires = ";expires="+d;
        var name=cookiename;
        //alert(name);
        var value="";
        document.cookie = name + "=" + value + expires;                    
    }
    window.location = ""; // TO REFRESH THE PAGE
}

// =======================================
// OTHER UTILITY

//==================================================
// URL PARAMETER PARSING
//==================================================
function getGETArguments(){
	var prmstr = window.location.search.substr(1);
	return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ){
	var params = {};
	var prmarr = prmstr.split("&");
	for (var i = 0; i < prmarr.length; i++){
		var tmparr = prmarr[i].split("=");
		params[tmparr[0]] = tmparr[1];
	}
	return params;
}

