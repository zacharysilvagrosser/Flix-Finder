import React, { useState } from 'react';

// Watch list button on movieinfo component
function WatchList(props) {
    // add new movie to a new array of watch list movies
    function addToWatchlist(newItem) {
        // only add new watch list item if not already in the watch list
        const isDuplicate = props.watchData.some((title) => {
            if (title.title) {
                // for movies
                return title.title === newItem.title;
            } else {
                // for TV
                return title.name === newItem.name;
            }
        });
        if (!isDuplicate) {
            props.setWatchData([...props.watchData, newItem]);
            props.setListNumber(props.listNumber + 1);
            props.setWatchTitles([...props.watchTitles, props.item.title]);
        }
    }
    function deleteFromWatchlist(movieTitle) {
        if (movieTitle == props.item.title) {
            // for movies
            props.setWatchData(prevItems => prevItems.filter(movie => movie.title !== movieTitle));
            props.setData(prevItems => prevItems.filter(movie => movie.title !== movieTitle));
        } else {
            // for TV
            props.setWatchData(prevItems => prevItems.filter(movie => movie.name !== movieTitle));
            props.setData(prevItems => prevItems.filter(movie => movie.name !== movieTitle));
        }
        props.setListNumber(props.listNumber - 1);
    }
    // change Watch List button to Delete button if currently viewing Watch List
    if (document.getElementById("watch-list").classList.contains("view-watch-list")) {
        return <button className='watch-list-button movie-button' onClick={() => deleteFromWatchlist((props.item.title ? props.item.title : props.item.name))}>Delete</button>
    } else {
        return <button className='watch-list-button movie-button' onClick={() => addToWatchlist(props.item)}>{props.watchTitles.includes(props.item.title) ? 'Listed' : 'Watch List'}</button>
    }
}

export default WatchList;