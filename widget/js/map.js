let usa = {lat: 37.09024, lng: -95.712891},
    defaultLocation = usa;

let mapView = {
    settings: {
        zoomLevel: {city: 14, country: 3},
        images: {
            currentLocation: 'google_marker_blue_icon.png',
            place : 'google_marker_red_icon.png',
            selected : 'google_marker_green_icon.png'
        }
    },
    lastKnownLocation: defaultLocation,
    initMap: (places) => {
        //Create the map first (Don't wait for location)
        mapView.createMap();

        //Center map once location is obtained
        buildfire.geo.getCurrentPosition({}, (err, position) => {
            if(!err && position && position.coords){
                mapView.lastKnownLocation = {lat: position.coords.latitude, lng: position.coords.longitude};

                window.map.setCenter(mapView.lastKnownLocation);
                window.map.setZoom(mapView.settings.zoomLevel.city);

                mapView.addMarker(map, mapView.lastKnownLocation, mapView.settings.images.currentLocation);
            }
        });

        //TODO: If there is only one entry, it returns an object
        if(places && places.length){
            places.forEach((place) => {
                mapView.addMarker(map, place, 'google_marker_red_icon.png');
            });
        }
    },
    updateMap: (newPlaces) => {
        //Add new markers
        newPlaces.forEach((place) => {
            mapView.addMarker(map, place, 'google_marker_red_icon.png');
        });
    },
    centerMap: () => { window.map.setCenter(mapView.lastKnownLocation) },
    addMarker: (map, place, iconType) => {
        let marker = new google.maps.Marker({
            position: place.address,
            map: map,
            icon: mapView.createMarker(iconType)
        });

        marker.addListener('click', () => {
            let locationDetails = document.getElementById('locationDetails');
            locationDetails.querySelector('#name').innerHTML = place.title;
            locationDetails.style.height = '30px';
            locationDetails.querySelector('#distance').innerHTML = place.distance;
        });
    },
    createMarker:(imageType) => {
        const iconBaseUrl = 'https://app.buildfire.com/app/media/';

        return {
            url: iconBaseUrl + imageType,
            // This marker is 20 pixels wide by 20 pixels high.
            scaledSize: new google.maps.Size(20, 20),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is at the center of the circle
            anchor: new google.maps.Point(10, 10)
        };
    },
    createMap: () =>{
        let locationBottomLeft = google.maps.ControlPosition.BOTTOM_LEFT,
            locationBottomRight = google.maps.ControlPosition.BOTTOM_RIGHT,
            mapTypeId = google.maps.MapTypeId.ROADMAP,
            zoomPosition = google.maps.ControlPosition.RIGHT_TOP;

        let zoomTo = (mapView.lastKnownLocation != defaultLocation) ? mapView.settings.zoomLevel.city : mapView.settings.zoomLevel.country,
            centerOn = (mapView.lastKnownLocation != defaultLocation) ? mapView.lastKnownLocation : defaultLocation ;

        let options = {
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            zoom: zoomTo,
            center: centerOn,
            mapTypeId: mapTypeId,
            zoomControlOptions: {
                position: zoomPosition
            }
        };

        map = new google.maps.Map(document.getElementById('mapView'), options);

        let centerControlDiv = document.createElement('div'),
            filterMapDiv = document.createElement('div');

        new CenterControl(centerControlDiv);
        new FilterControl(filterMapDiv);

        centerControlDiv.index = 1;

        window.map.controls[locationBottomLeft].push(centerControlDiv);
        window.map.controls[locationBottomRight].push(filterMapDiv);
    }
};