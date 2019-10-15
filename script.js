"use strict";


function doStart() {
    formatDate(document.getElementById('currentDate'));
    formateTime(document.getElementById('currentTime'));
}

function formatDate(element) {
    //customizing the behaviour of the toLocaleDateString() method. Setting specific parameters (locales, options)
    const dateObject = {
        dayName: new Date().toLocaleDateString('en-GB', { weekday: 'long'}),
        dayNumber: new Date().toLocaleDateString('en-GB', { day: 'numeric'}),
        monthName: new Date().toLocaleDateString('en-GB', { month: 'long'}),
        year: new Date().toLocaleDateString('en-GB', { year: 'numeric'}),
    };

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