import React from 'react';

function NoMoviesFound(data) {
    if (data && data.data == '') {
        return (
            <p id="no-movies-found">There are no movies that match your search query.</p>
        )
    }
}

export default NoMoviesFound;