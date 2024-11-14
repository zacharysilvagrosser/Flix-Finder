import React from 'react';

// Watch list button on movieinfo component
function WatchList(props) {
    // add new movie to a new array of watch list movies
    function addToWatchlist(newItem) {
        // only add new watch list item if not already in the watch list
        const isDuplicate = props.watchData.some((title) => {
            return title.title === newItem.title;
        });
        if (!isDuplicate) {
            props.setWatchData([...props.watchData, newItem]);
            props.setListNumber(props.listNumber + 1);
        }
    }
    function deleteFromWatchlist(movieTitle) {
        props.setWatchData(prevItems => prevItems.filter(movie => movie.title !== movieTitle));
        props.setData(prevItems => prevItems.filter(movie => movie.title !== movieTitle));
        props.setListNumber(props.listNumber - 1);
    }

    if (document.getElementById("watch-list").classList.contains("view-watch-list")) {
        return <button className='watch-list-button movie-button' onClick={() => deleteFromWatchlist(props.item.title)}>Delete</button>
    } else {
        return <button className='watch-list-button movie-button' onClick={() => addToWatchlist(props.item)}>Watch List</button>
    }
}

export default WatchList;