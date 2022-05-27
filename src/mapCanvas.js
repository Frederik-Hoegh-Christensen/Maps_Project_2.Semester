export function initMap(){
    // The center on init
   const copenhagen = { lat: 55.676098, lng: 12.568337 };
 
   //map init options
   const options = {
     zoom: 11,
     center: copenhagen,
     streetViewControl: false,
     mapTypeControl: false,
   }
    // The map, centered at Copenhagen
   const mapCanvas = new google.maps.Map(document.getElementById("map"), options);
 
   removeDefaultMapPins(mapCanvas);
 }


export function removeDefaultMapPins(map){
    let removePOI = [
      {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
          { "visibility": "off" }
        ]
      },
      {
        "featureType": "poi.business",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      }
    ]
    map.setOptions({styles: removePOI})
  }