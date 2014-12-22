window.onload = loadScript;
function initialize()
		{
		  var mapProp = {
		    center: new google.maps.LatLng(37.3492,-121.9381),
		    zoom:17,
		    styles:[
			    {
			        "stylers": [
			            {
			                "visibility": "off"
			            }
			        ]
			    },
			    {
			        "featureType": "road",
			        "stylers": [
			            {
			                "visibility": "on"
			            },
			            {
			                "color": "#ffffff"
			            }
			        ]
			    },
			    {
			        "featureType": "road.arterial",
			        "stylers": [
			            {
			                "visibility": "on"
			            },
			            {
			                "color": "#fee379"
			            }
			        ]
			    },
			    {
			        "featureType": "road.highway",
			        "stylers": [
			            {
			                "visibility": "on"
			            },
			            {
			                "color": "#fee379"
			            }
			        ]
			    },
			    {
			        "featureType": "landscape",
			        "stylers": [
			            {
			                "visibility": "on"
			            },
			            {
			                "color": "#f3f4f4"
			            }
			        ]
			    },
			    {
			        "featureType": "water",
			        "stylers": [
			            {
			                "visibility": "on"
			            },
			            {
			                "color": "#7fc8ed"
			            }
			        ]
			    },
			    {},
			    {
			        "featureType": "road",
			        "elementType": "labels",
			        "stylers": [
			            {
			                "visibility": "off"
			            }
			        ]
			    },
			    {
			        "featureType": "poi.park",
			        "elementType": "geometry.fill",
			        "stylers": [
			            {
			                "visibility": "on"
			            },
			            {
			                "color": "#83cead"
			            }
			        ]
			    },
			    {
			        "elementType": "labels",
			        "stylers": [
			            {
			                "visibility": "off"
			            }
			        ]
			    },
			    {
			        "featureType": "landscape.man_made",
			        "elementType": "geometry",
			        "stylers": [
			            {
			                "weight": 0.9
			            },
			            {
			                "visibility": "off"
			            }
			        ]
			    }
			],
		    mapTypeId: google.maps.MapTypeId.ROADMAP
		  };
		  var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
		}

		function loadScript()
		{
		  var script = document.createElement("script");
		  script.type = "text/javascript";
		  script.src = "http://maps.googleapis.com/maps/api/js?key=&sensor=false&callback=initialize";
		  document.body.appendChild(script);
		}