// sets up the max attribute of the days to current date
$(document).ready(function () {
    clearControlPanel();
    loadDailyImage();

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

// starting the space mission; no action takes place while we have invalid inputs
function startSpaceMission(event) {
    if (spaceStartDateOK && spaceEndDateOK) {
        alert("fetch and display SPACE images");
        event.preventDefault();
        event.stopPropagation();
    } else {
        alert("must NOT fetch and display SPACE images");

    }
}
// starting the space mission; no action takes place while we have invalid inputs
function startRoverMission(event) {
    if (roverDateOK && roverCameraOK) {
        alert("fetch and display ROVER images");
        event.preventDefault();
        event.stopPropagation();
    } else {
        alert("must NOT fetch and display ROVER images");

    }
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

document.getElementById("spaceMissionStart").addEventListener("click", function(e) {
  e.preventDefault();
  const startDate = document.getElementById("spaceStartDate").value;
  const endDate = document.getElementById("spaceEndDate").value;

  getNasaApodImagesInRange(startDate, endDate).then(images => {
    console.log(images);
  });
});