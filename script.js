"use strict";


function doStart() {
    formatDate(document.getElementById('currentDate'));
    formateTime(document.getElementById('currentTime'));
}

function formatDate(element) {
    //customizing the behaviour of the toLocaleDateString() method. Setting specific parameters (locales, options)
    element.textContent = new Date().toLocaleDateString('en-GB',
        { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})
}

function formateTime(element) {
    element.textContent = new Date().toLocaleTimeString('en-GB',
        {hour12: true, hour: '2-digit', minute: '2-digit',}).toUpperCase();
}


// function doGetDayOrdinal(day) {
//     const ordinalValue = day % 10;
//
//     if (ordinalValue === 1) return String(${day}st);
//     if (ordinalValue === 2) return String(${day}nd);
//     if (ordinalValue === 3) return String(${day}rd);
//     return String(${day}th);
// }