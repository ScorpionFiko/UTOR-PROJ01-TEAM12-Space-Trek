let searchButton = document.querySelector("#search")
let API_KEY = "OEdcnYDoxZyp8JlBVdLDc3ek7SHhW1cpsApg9LeI"
searchButton.addEventListener("click", ()=>{
    console.log("search");
    sendApiRequest()
})

async function sendApiRequest(){
    
    let response = await fetch('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2015-6-3&camera&api_key=OEdcnYDoxZyp8JlBVdLDc3ek7SHhW1cpsApg9LeI');
    console.log(response)
    let data = await response.json()
    console.log(data)
    useApiData(data)
    
}

function useApiData(data) {
    document.querySelector("#content").innerHTML += '<img src="${data.photos[].img_src}">'


}

document.getElementById("roverMissionStart").addEventListener("click", function(event){
    event.preventDefault();
    let dateOnMars = document.getElementById("roverDate").value;
    let camera = document.getElementById("roverCamera").value;
    let Mars_API_KEY = "OEdcnYDoxZyp8JlBVdLDc3ek7SHhW1cpsApg9LeI"
    let Mars_API_url = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2015-6-3&api_key=OEdcnYDoxZyp8JlBVdLDc3ek7SHhW1cpsApg9LeI";
    fetch(Mars_API_url)
    .then(response => response.JSON())
    .then(data => {
        let images = data.photos.map(photo => {
            return{
                date: photo.earth_date,
                url: photo.img_src,
                title: "${camera.full_name}"

            };

        });
        console.log(images);
    })
})                          