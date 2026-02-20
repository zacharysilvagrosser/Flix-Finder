import React from 'react';

function NoMoviesFound(data) {
    // Use props instead of direct DOM access
    if (!data || !data.data || data.data.length === 0) {
        return (
            <p id="no-movies-found">Please enter a movie or TV show in the search bar.</p>
        )
    }
    if (Array.isArray(data.data) && data.data.length === 0) {
        return (
            <p id="no-movies-found">There is no data that matches your search query.</p>
        )
    }
}

export default NoMoviesFound;