// sets up the max attribute of the days to current date
$(document).ready(function () {
    clearControlPanel();
    loadDailyImage();
    getMissionsData();
});

function loadDailyImage() {
    const apodImage = document.getElementById("orbit-image");
    const ApodAPI_KEY = "q6MAM0NRPdrz7ICmAHstyfpVH1KIkOHnta2GaO4x";
    const ApodAPI_URL = `https://api.nasa.gov/planetary/apod?api_key=${ApodAPI_KEY}`;

    fetch(ApodAPI_URL)
        .then(response => response.json())
        .then(data => {
            apodImage.src = data.url;
            apodImage.alt = data.title;
        })
        .catch(error => console.error(error));
}

//helper variables
let spaceStartDateOK = false;
let spaceEndDateOK = false;
let roverDateOK = false;
let roverCameraOK = false;
let missionDataLocalStorage = "missionData"
let missionsData = [];


function getMissionsData() {
    missionsData=[];
    if (localStorage.getItem(missionDataLocalStorage) !== null) {
        missionsData=JSON.parse(localStorage.getItem(missionDataLocalStorage));
    }
}
//click listeners to ensure that we have valid date range
// upon change:
//  - sets the min attribute of end date to the startDate
//  - if there is already an end date that is prior to the start date, the end date is changed
$("#spaceStartDate").on("change", function (event) {
    $("#spaceEndDate").attr("min", dayjs($("#spaceStartDate").val()).format("YYYY-MM-DD"));
    if (dayjs($("#spaceStartDate").val()) > dayjs($("#spaceEndDate").val())) {
        $("#spaceEndDate").val($("#spaceStartDate").val());
    }

});
// upon change:
//   - sets the max attribute of start date equal to end date
$("#spaceEndDate").on("change", function (event) {
    $("#spaceStartDate").attr("max", dayjs($("#spaceEndDate").val()).format("YYYY-MM-DD"));
});

// event listener on the Control Panel; the only valid selections are:
//  - the accordeon clicks
//  - the buttons 
$("#missionControlPanel").on("click", function (event) {
    if (event.target.matches("a")) {
        clearControlPanel();
    }
    if (event.target.matches("#spaceMissionStart")) {
        // these framework listeners are required to prevent further action on invalid input
        startSpaceMission(event);
    }
    if (event.target.matches("#roverMissionStart")) {
        // these framework listeners are required to prevent further action on invalid input
        startRoverMission(event);
    }
});
// removes any data from the control panel as the users flips between options
// NOTE: if there's already an error, the error messaging will remain
function clearControlPanel() {
    $("#spaceStartDate").val("");
    $("#spaceStartDate").attr("max", dayjs().format("YYYY-MM-DD"));
    $("#spaceStartDate").removeAttr("min");
    $("#spaceEndDate").val("");
    $("#spaceEndDate").attr("max", dayjs().format("YYYY-MM-DD"));
    $("#spaceEndDate").removeAttr("min");
    $("#roverDate").val("");
    $("#roverDate").attr("max", dayjs().format("YYYY-MM-DD"));
    $("#roverCamera").val("");
    spaceStartDateOK = false;
    spaceEndDateOK = false;
    roverDateOK = false;
    roverCameraOK = false;

}
// event listeners for good input and sets the helper variables to true
$("#spaceStartDate").on("valid.zf.abide", function (ev, el) {
    spaceStartDateOK = true;
});
$("#spaceEndDate").on("valid.zf.abide", function (ev, el) {
    spaceEndDateOK = true;
});
$("#roverDate").on("valid.zf.abide", function (ev, el) {
    roverDateOK = true;
});
$("#roverCamera").on("valid.zf.abide", function (ev, el) {
    roverCameraOK = true;
});

// import testing data
import { provideTestData } from "./testdata.js";

// starting the space mission; no action takes place while we have invalid inputs
function startSpaceMission(event) {
    if (spaceStartDateOK && spaceEndDateOK) {
        event.preventDefault();
        getNasaApodImagesInRange(dayjs($("#spaceStartDate").val()).format("YYYY-MM-DD"), dayjs($("#spaceEndDate").val()).format("YYYY-MM-DD")).then(images => {
            displayMissionImages(images);
          });
    } else {
        event.stopPropagation();
    }
}
// starting the space mission; no action takes place while we have invalid inputs
function startRoverMission(event) {
    if (roverDateOK && roverCameraOK) {
        event.preventDefault();
        displayMissionImages([]);
    } else {
        event.stopPropagation();
    }
}

// function to display the images obtained from the API's
function displayMissionImages(imageData) {
    let missionDate = dayjs().unix();
    if (imageData.length === 0) {
        displayMissionImages([{
            date: dayjs($("#spaceEndDate").val()).format("YYYY-MM-DD"),
            url: "https://apod.nasa.gov/apod/image/2301/ngc6355_hubble_1080.jpg",
            title: "Mission date: " + missionDate + "<br >No Images recorded",
            blurred: true
        }]);
    } else {
        $("#missionImages").empty();
        $("#missionImages").append($("<button>", {
            class: "orbit-previous",
            html: '<span class="show-for-sr">Previous Slide</span>&#9664;&#xFE0E;'
        }));
        $("#missionImages").append($("<button>", {
            class: "orbit-next",
            html: '<span class="show-for-sr">Next Slide</span>&#9654;&#xFE0E;'
        }));
        $("#missionImagesNav").empty();
        imageData.forEach((image, index) => {
            $("#missionImages").append($("<li>", {
                class: "orbit-slide",
                id: "imageItem-" + index
            }));
            $("#imageItem-" + index).attr("data-slide", index+2);
            
            $("#imageItem-" + index).append($('<img>', {
                id: "orbit-image-" + index,
                class: "orbit-image " + ((image.blurred) ? "blurred_image": ""),
                src: image.url,
                alt: "image of " + image.title
            }));
            $("#imageItem-" + index).append($('<figcaption>', {
                id: "orbit-figcaption-" + index,
                class: "orbit-caption " + ((image.blurred) ? "custom-orbit-caption": ""),
                html: image.title,
            }));
            $("#missionImagesNav").append($("<button>", {
                class: ((index === 0) ? "is-active":""),
                html: '<span class="show-for-sr">Slide ' + index + 1 + '.</span>' + 
                      ((index === 0) ? '<span class="show-for-sr">Current Slide</span>':""),
                id: "imageNav-" + index
            }));
            $("#imageNav-" + index).attr("data-slide", index);
        });

    }
    Foundation.reInit($('.orbit'));
    missionsData.push({
        missionDate: missionDate,
        missionType: "space",
        missionData: imageData
    });
    localStorage.setItem(missionDataLocalStorage, JSON.stringify(missionsData));
}


// Space Exploration

function getNasaApodImagesInRange(startDate, endDate) {
  const ApodAPI_KEY = "q6MAM0NRPdrz7ICmAHstyfpVH1KIkOHnta2GaO4x";
  const ApodAPIUrl = `https://api.nasa.gov/planetary/apod?api_key=${ApodAPI_KEY}`;
  const dateRange = [];
  let currentDate = new Date(startDate);
  endDate = new Date(endDate);

  while (currentDate <= endDate) {
    dateRange.push(currentDate.toISOString().slice(0, 10));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return Promise.all(
    dateRange.map(date => {
      return fetch(`${ApodAPIUrl}&date=${date}`)
        .then(response => response.json())
        .then(data => {
          return {
            date: date,
            url: data.url,
            title: data.title
          };
        })
        .catch(error => {
          console.error(error);
        });
    })
  );
}
