"use strict";

let todayIs = '';

function doStart() {
    doFormatDateAndTime();
    doRefreshData();
    doGetCurrentWeather()
    setInterval(() => {
        if(todayIs !== new Date().toLocaleDateString('en-GB', { weekday: 'long'})) doRefreshData();
        doFormatDateAndTime();
    }, 1500);
}

function doFormatDateAndTime(){
    formatDate(document.getElementById('currentDate'));
    formateTime(document.getElementById('currentTime'));
}

function doRefreshData() {
    deleteChilds(document.getElementById('tasksTable'));
    processTasks().then();
}

function formatDate(element) {
    //customizing the behaviour of the toLocaleDateString() method. Setting specific parameters (locales, options)
    const dateObject = {
        dayName: new Date().toLocaleDateString('en-GB', { weekday: 'long'}),
        dayNumber: new Date().toLocaleDateString('en-GB', { day: 'numeric'}),
        monthName: new Date().toLocaleDateString('en-GB', { month: 'long'}),
        year: new Date().toLocaleDateString('en-GB', { year: 'numeric'}),
    };

    todayIs = dateObject.dayName;

    function doGetDayOrdinal(day) {
        const ordinalValue = day % 10;

        if (ordinalValue === 1) return String(`${day}st`);
        if (ordinalValue === 2) return String(`${day}nd`);
        if (ordinalValue === 3) return String(`${day}rd`);
        return String(`${day}th`);
    }

    element.textContent = `${dateObject.dayName} ${doGetDayOrdinal(dateObject.dayNumber)} ${dateObject.monthName} ${dateObject.year}`;
}

function formateTime(element) {
    element.textContent = new Date().toLocaleTimeString('en-GB',
        {hour12: true, hour: '2-digit', minute: '2-digit',}).toUpperCase();

    element.textContent.indexOf(':')
}


function doGetCurrentWeather() {
    const copenhagenCityString = 'Copenhagen,dk';
    const key = 'af3c97ae17d94dfc69fe90e9b0eaacca';
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + copenhagenCityString+ '&units=metric&APPID=' + key)
        .then(function(resp) { return resp.json() }) // Convert data to json
        .then(function(data) {
            console.table(data);
            const main = data.main;
            const weather = data.weather;


            document.getElementById('temperature').textContent = parseInt(main['temp']) + '°C';
            document.getElementById('humidity').textContent = main['humidity'] + '%';

            const conditionsElement = document.getElementById('conditions');
            if(Array.isArray(weather)) {
                weather.forEach((condition) => {
                    if(conditionsElement.innerText === '') conditionsElement.innerText += condition['main'] ; // Will look like ' Fog'
                    else conditionsElement.innerText += ', ' + condition['main'] ; // Will look like ' Fog , cold, rainy'
                })
            } else {
                conditionsElement.innerText = weather['main'];
            }
        })
        .catch(function() {
            // catch any errors
        });
}

function doChangeTitle(event) {
    event.preventDefault();

    document.title = document.getElementById('changeTitle').value;
}


let previousStyleClass;

function doChangeStyle(newClass) {
    let bodyElement = document.getElementById('body');
    bodyElement.classList.remove(previousStyleClass);
    previousStyleClass = newClass;

    bodyElement.classList.add(newClass);
}

let tasksData;

async function processTasks() {
    try {
        // Calling fetch within a function in order to pass the returned data to .json() to be converted into a javascript object
        const jsonTasks = await (await fetch("./tasks.json")).json();

        tasksData = jsonTasks ? jsonTasks : [];
        showTasksData(tasksData);

    } catch(error) {
        tasksData = [];
        console.error('Cannot read tasks list, reason: ' + error.message);
    }
}

function showTomorrowsTasksData() {
    toggleLoader();
    const taskElement = document.getElementById('tasksTable');
    const taskEntryTemplate = document.getElementById('taskEntry');

    deleteChilds(taskElement);

    tasksData.forEach((taskEntry) => {
        let temporaryTaskTemplate = taskEntryTemplate.content.cloneNode(true);
        const newTaskEntry = buildTaskEntry(temporaryTaskTemplate, taskEntry, true);

        if(newTaskEntry) taskElement.appendChild(newTaskEntry);
    });

    toggleLoader();
}

function showTasksData() {
    const taskElement = document.getElementById('tasksTable');
    const taskEntryTemplate = document.getElementById('taskEntry');

    tasksData.forEach((taskEntry) => {
        let temporaryTaskTemplate = taskEntryTemplate.content.cloneNode(true);
        const newTaskEntry = buildTaskEntry(temporaryTaskTemplate, taskEntry);

        if(newTaskEntry) taskElement.appendChild(newTaskEntry);
    });
    toggleLoader();
}

function buildTaskEntry(element, taskData, showTomorrowsTasks = false) {
    if(showTomorrowsTasks) {
        let tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));

        tomorrow = tomorrow.toLocaleDateString('en-GB', { weekday: 'long'});

        if(taskData.day === tomorrow){
            element.firstElementChild.children[0].textContent = taskData.time;
            element.firstElementChild.children[2].textContent = taskData.description;

            return element;
        }
    } else if(taskData.day === new Date().toLocaleDateString('en-GB', { weekday: 'long'})){
        element.firstElementChild.children[0].textContent = taskData.time;
        element.firstElementChild.children[2].textContent = taskData.description;

        return element;
    }
}

function deleteChilds(parentElement) {
    let child = parentElement.lastElementChild;
    while(child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
}


function toggleLoader() {
    const loader = document.getElementById('loader')
    loader.classList.toggle('d-none');
}