import React from 'react';

function NoMoviesFound(props) {
    const { data, showingWatchList } = props;
    if (!data || !data || data.length === 0) {
        if (showingWatchList) {
            return (
                <p id="no-movies-found">Your watch list is empty. Add movies or TV shows to see them here!</p>
            );
        } else {
            return (
                <p id="no-movies-found">No search results found.</p>
            );
        }
    }
    if (Array.isArray(data) && data.length === 0) {
        return (
            <p id="no-movies-found">There is no data that matches your search query.</p>
        );
    }
}

export default NoMoviesFound;