// Initialize the map
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://maps.geo.us-west-2.amazonaws.com/maps/v0/maps/FireMap/style-descriptor?key=NICETRY',
    center: [-121.9366, 37.3489], // Default center (longitude, latitude)
    zoom: 13
});

// manage active location points / map markers
let serviceLocations = [];
let markers = [];

export function addLocation(name, lat, lon) {
    let loc = {name: name, latitude: lat, longitude: lon};
    serviceLocations.push(loc);
}

export function setAllLocations() {
    // remove all previous markers from the map
    markers.forEach(marker => {
        marker.remove();
    })
    markers = [];

    // iterate through all locations from this GET request and add them to the map
    serviceLocations.forEach(location => {
        const marker = new maplibregl.Marker()
            .setLngLat([location.longitude, location.latitude])
            .setPopup(new maplibregl.Popup({offset: 25}).setHTML(`<h3>${location.name}</h3>`))
            .addTo(map);
        markers.push(marker);
    });

    serviceLocations = [];
}

//get the mapButton
const mapButton = document.getElementById('map-button');
let counter = 0;

// Add an event listener to the button for the 'click' event
mapButton.addEventListener('click', function() {
    const info = document.querySelector('.info-display');
    const map = document.querySelector('.map-display');

    counter++;
    const sizeSetting = (counter % 3)+1; // Add 1 to shift results to 1, 2, 3

    //depending on sizeSetting, shift size of info and map displays
    if(sizeSetting ===1){
        map.style.width = '50%';
        info.style.width = '50%';
    }
    else if(sizeSetting === 2){
        map.style.width = '70%';
        info.style.width = '30%';
    }
    else if(sizeSetting === 3)
    {
        map.style.width = '30%';
        info.style.width = '70%';
    }

});

var response_data;
async function submitSearch() {
            const query = document.getElementById('search').value;

            const response = await fetch('/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query })
            });

            const data = await response.json();
            response_data = data;
            const responseElement = document.getElementById('response');
            responseElement.classList.remove('hidden');
            responseElement.innerHTML = `<strong>Search Result:</strong> ${JSON.stringify(data)}`;
        }