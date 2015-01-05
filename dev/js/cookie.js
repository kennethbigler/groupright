
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
    alert(cookies);
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
        alert(name);
        var value="";
        document.cookie = name + "=" + value + expires;                    
    }
    window.location = ""; // TO REFRESH THE PAGE
}
