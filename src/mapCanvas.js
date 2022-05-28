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

   addMarker(mapCanvas, {
       coords: copenhagen,
       title: "Copenhagen",
   })
   addMarker(mapCanvas, {
      coords: {lat: 55.65957337484047, lng: 12.590903511449048},
      title: 'ITU Campus'
   })
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

export function addMarker(map, properties){
    let marker = new google.maps.Marker({
        position: properties.coords,
        map: map,
        title: properties.title,
    })
    marker.addListener("click", () => {
        console.log(marker.title + " was clicked");
    })
    marker.setMap(map);
}