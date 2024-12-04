import React from 'react';

function NoMoviesFound(data) {
    if (document.getElementById('search').value === '') {
        return (
            <p id="no-movies-found">Please enter a movie or TV show in the search bar.</p>
        )
    }
    if (data && data.data == '') {
        return (
            <p id="no-movies-found">There is no data that matches your search query.</p>
        )
    }
}

export default NoMoviesFound;