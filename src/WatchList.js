import React from 'react';

// Watch list button on movieinfo component
function WatchList(props) {
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
            // add to watch list
            props.setWatchData([...props.watchData, newItem]);
            props.setWatchTitles([...props.watchTitles, props.item.title]);
        } else {
            // delete from watch list
            if (props.item.title) {
                // for movies
                props.setWatchData(prevItems => prevItems.filter(movie => movie.title !== props.item.title));
                props.setWatchTitles(prevItems => prevItems.filter(movie => movie !== props.item.title));
            } else {
                // for TV
                props.setWatchData(prevItems => prevItems.filter(movie => movie.name !== props.item.name));
                props.setWatchTitles(prevItems => prevItems.filter(movie => movie !== props.item.name));
            }
        }
    }
    function deleteFromWatchlist(movieTitle) {
        if (movieTitle === props.item.title) {
            // for movies
            props.setWatchData(prevItems => prevItems.filter(movie => movie.title !== movieTitle));
            props.setData(prevItems => prevItems.filter(movie => movie.title !== movieTitle));
            props.setWatchTitles(prevItems => prevItems.filter(movie => movie !== props.item.title));
        } else {
            // for TV
            props.setWatchData(prevItems => prevItems.filter(movie => movie.name !== movieTitle));
            props.setData(prevItems => prevItems.filter(movie => movie.name !== movieTitle));
            props.setWatchTitles(prevItems => prevItems.filter(movie => movie !== props.item.title));
        }
    }
    // Show 'Listed' when item is on the watch list
    let listed = false;
    if ((props.watchTitles.includes(props.item.title) && props.item.title !== undefined) || (props.watchTitles.includes(props.item.name) && props.item.name !== undefined)) {
        listed = true;
    }
    // change Watch List button to Delete button if currently viewing Watch List
    if (document.getElementById("watch-list").classList.contains("view-watch-list")) {
        return <button className='watch-list-button movie-button' onClick={() => deleteFromWatchlist((props.item.title ? props.item.title : props.item.name))}>Remove</button>
    } else {
        return <button className='watch-list-button movie-button' onClick={() => addToWatchlist(props.item)}>{listed ? 'Remove' : 'Watch List'}</button>
    }
}

export default WatchList;