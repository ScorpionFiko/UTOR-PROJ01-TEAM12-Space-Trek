// sets up the max attribute of the days to current date
$(document).ready(function () {
    $(document).foundation();
    clearControlPanel();
    loadDailyImage();
});

function loadDailyImage() {
    const apodImage = document.getElementById("orbit-image");
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
const ApodAPI_KEY = "q6MAM0NRPdrz7ICmAHstyfpVH1KIkOHnta2GaO4x";

// retrieves stored data
function getMissionsData() {
    missionsData = [];
    if (localStorage.getItem(missionDataLocalStorage) !== null) {
        missionsData = JSON.parse(localStorage.getItem(missionDataLocalStorage));
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
// event listener on captain's log button to load the stored data
$("#captainsLogBtn").on("click", function (event) {
    getMissionsData();
    loadMissionsData();
});


// funciton to load the mission data in the captaion's log
function loadMissionsData() {
    if (missionsData.length === 0) {
        return;
    }
    let tableBody = $("#captainsLogData").children('tbody');
    // clearing table body
    tableBody.empty();
    missionsData.forEach((mission, index) => {
        // adding row
        tableBody.append($('<tr>', {
            id: "tableRow-" + index
        }));
        // adding data column
        $("#tableRow-" + index).append($('<td>', {
            id: "tableData-" + index
        }));
        // adding accordeon
        $("#tableData-" + index).append($('<ul>', {
            id: "accordionUL-" + index,
            class: "accordion ",
        }));
        $("#accordionUL-" + index).attr("data-accordion", "");
        $("#accordionUL-" + index).attr("data-allow-all-closed", "true");
        $("#accordionUL-" + index).append($('<li>', {
            id: "accordionLI-" + index,
            class: "accordion-item"
        }));
        $("#accordionLI-" + index).attr("data-accordion-item", "");
        $("#accordionLI-" + index).append($('<a>', {
            id: "accordionLIHref-" + index,
            class: "accordion-title custom-button",
            href: "#",
            html: "Mission Date: " + mission.missionDate + ((mission.type === "space") ? " - Space" : " - Mars")
        }));
        $("#accordionLI-" + index).append($('<div>', {
            id: "accordionLIDiv-" + index,
            class: "accordion-content body"
        }));
        $("#accordionLIDiv-" + index).attr("data-tab-content", "");
        $("#accordionLIDiv-" + index).append($('<div>', {
            id: "accordionDivImage-" + index,
            role: "region",
        }));
        mission.missionData.forEach((image, imIndex) => {
            $("#accordionDivImage-" + index).append($('<p>', {
                html: image.title
            }));

            $("#accordionDivImage-" + index).append($('<img>', {
                id: "accordionDivImageMission-" + imIndex,
                src: image.url,
                alt: image.title,
                class: ((image.blurred) ? "blurred_image" : "")
            }));
        });

    });
    $(document).foundation();
    $("#captainsLogData").DataTable({ searching: false, info: false });
}

// starting the space mission; no action takes place while we have invalid inputs
function startSpaceMission(event) {
    if (spaceStartDateOK && spaceEndDateOK) {
        event.preventDefault();
        getNasaApodImagesInRange(dayjs($("#spaceStartDate").val()).format("YYYY-MM-DD"), dayjs($("#spaceEndDate").val()).format("YYYY-MM-DD")).then(images => {
            let missionDate = dayjs().unix();
            if (images.length === 0) {
                images = [{
                    date: dayjs($("#spaceEndDate").val()).format("YYYY-MM-DD"),
                    url: "https://apod.nasa.gov/apod/image/2301/ngc6355_hubble_1080.jpg",
                    title: "Mission date: " + missionDate + "<br >No Images recorded",
                    blurred: true
                }];
            }
            displayImagesInOrbit($("#missionImagesContainer"), images);
            saveImages(missionDate, "space", images);
        });
    } else {
        event.stopPropagation();
    }
}
// function to save images to local storage
function saveImages(missionDate, missionType, imageData) {
    getMissionsData();
    missionsData.push({
        missionDate: missionDate,
        missionType: missionType,
        missionData: imageData
    });
    localStorage.setItem(missionDataLocalStorage, JSON.stringify(missionsData));
}

// starting the space mission; no action takes place while we have invalid inputs
function startRoverMission(event) {
    if (roverDateOK && roverCameraOK) {
        event.preventDefault();
        getNasaRoverImages(dayjs($("#roverDate").val()).format("YYYY-MM-DD"), $("#roverCamera").val());
    } else {
        event.stopPropagation();
    }

}

// function to display the images obtained from the API's
function displayImagesInOrbit(orbitElement, imageData) {
    let orbitElementUL = orbitElement.children("ul");
    let orbitElementNav = orbitElement.children("nav");
    $(orbitElementUL).empty();
    $(orbitElementUL).append($("<button>", {
        class: "orbit-previous",
        html: '<span class="show-for-sr">Previous Slide</span>&#9664;&#xFE0E;'
    }));
    $(orbitElementUL).append($("<button>", {
        class: "orbit-next",
        html: '<span class="show-for-sr">Next Slide</span>&#9654;&#xFE0E;'
    }));
    $(orbitElementNav).empty();
    imageData.forEach((image, index) => {
        $(orbitElementUL).append($("<li>", {
            class: "orbit-slide",
            id: "imageItem-" + index
        }));
        $("#imageItem-" + index).attr("data-slide", index + 2);

        $("#imageItem-" + index).append($('<img>', {
            id: "orbit-image-" + index,
            class: "orbit-image " + ((image.blurred) ? "blurred_image" : ""),
            src: image.url,
            alt: "image of " + image.title
        }));
        $("#imageItem-" + index).append($('<figcaption>', {
            id: "orbit-figcaption-" + index,
            class: "orbit-caption " + ((image.blurred) ? "custom-orbit-caption" : ""),
            html: image.title,
        }));
        $(orbitElementNav).append($("<button>", {
            class: ((index === 0) ? "is-active" : ""),
            html: '<span class="show-for-sr">Slide ' + index + 1 + '.</span>' +
                ((index === 0) ? '<span class="show-for-sr">Current Slide</span>' : ""),
            id: "imageNav-" + index
        }));
        $("#imageNav-" + index).attr("data-slide", index);
    });
    Foundation.reInit($(orbitElement));

}


// Space Exploration

function getNasaApodImagesInRange(startDate, endDate) {
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

// code that gives image from mars rover API

function getNasaRoverImages(roverDate, roverCamera) {
    const marsUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${roverDate}&camera=${roverCamera}&api_key=${ApodAPI_KEY}&page=1`;
    let imageArray = [];

    fetch(marsUrl)
        .then(response => response.json())
        .then(data => {
            const images = data.photos;

            images.forEach(image => {
                const imageData = {
                    title: "Camera: " + image.camera.full_name + "<br>Date: " + image.earth_date,
                    date: image.earth_date,
                    url: image.img_src
                };
                imageArray.push(imageData);
            });
            let missionDate = dayjs().unix();
            if (imageArray.length === 0) {
                imageArray = [{
                    date: dayjs($("#spaceEndDate").val()).format("YYYY-MM-DD"),
                    url: "https://apod.nasa.gov/apod/image/2301/ngc6355_hubble_1080.jpg",
                    title: "Mission date: " + missionDate + "<br >No Images recorded",
                    blurred: true
                }];
            }
            displayImagesInOrbit($("#missionImagesContainer"), imageArray);
            saveImages(missionDate, "Mars", imageArray);
    
        })

        .catch(error => console.error(error));

};

