import React from 'react';

// Watch list button component to display watch list
function LoadWatchList(props) {
    // get watch list and display it on screen
    const showWatchList = () => {
        const watchList = document.getElementById("watch-list");
        if (watchList.classList.contains("view-watch-list")) {
            watchList.classList.remove("view-watch-list");
            props.setData(props.savedData);
        } else {
            watchList.classList.add("view-watch-list");
            props.setData(props.watchData);
        }
        props.setSavedData(props.data);
    };
    return <button id="watch-list" onClick={showWatchList}>Watch List ({props.listNumber})</button>
}

export default LoadWatchList;