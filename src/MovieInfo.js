import React from 'react';

// List of movie data in the Info button of movieinfo component
function MovieData({data, item}) {
    // convert all genre ids to words
    let genres = item.genre_ids.map(genre => {
        switch(genre) {
            case 12:
                return "Adventure";
            case 14:
                return "Fantasy";
            case 16:
                return "Animation";
            case 18:
                return "Drama";
            case 27:
                return "Horror";
            case 28:
                return "Action";
            case 35:
                return "Comedy";
            case 36:
                return "History";
            case 37:
                return "Western";
            case 53:
                return "Thriller";
            case 80:
                return "Crime";
            case 99:
                return "Documentary";
            case 878:
                return "Science Fiction";
            case 9648:
                return "Mystery";
            case 10402:
                return "Music";
            case 10749:
                return "Romance";
            case 10751:
                return "Family";
            case 10752:
                return "War";
            case 10770:
                return "TV Movie";
            default:
                return "None";
        }
    });
    let tvGenres = item.genre_ids.map(genre => {
        switch(genre) {
            case 16:
                return "Animation";
            case 18:
                return "Drama";
            case 35:
                return "Comedy";
            case 37:
                return "Western";
            case 80:
                return "Crime";
            case 99:
                return "Documentary";
            case 9648:
                return "Mystery";
            case 10751:
                return "Family";
            case 10762:
                return "Kids";
            case 10763:
                return "News";
            case 10764:
                return "Reality";
            case 10765:
                return "Sci-Fi & Fantasy";
            case 10766:
                return "Soap";
            case 10767:
                return "Talk";
            case 10768:
                return "War & Politics";
            case 10759:
                return "Action & Adventure";
            default:
                return "None";
        }
    });
    function formatDate(date) {
        const [year, month, day] = date.split('-');
        return `${month}/${day}/${year}`;
    }
    if (item.release_date) {
        return (
            <div className='info'>
                <p>{data && `Genres: ${genres.join(', ')}`}</p>
                <p>{data && `Rating: ${item.vote_average.toFixed(1)}/10`}</p>
                <p>{data && `Popularity: ${item.popularity.toFixed(0)}`}</p>
                <p>{data && item.release_date === '' ? `Release Date: Unknown` : `Release Date: ${formatDate(item.release_date)}`}</p>
                <p><br></br>{data && item.overview}</p>
            </div>
        );
    } else {
        return (
            <div className='info'>
                <p>{data && `Genres: ${tvGenres.join(', ')}`}</p>
                <p>{data && `Rating: ${item.vote_average.toFixed(1)}/10`}</p>
                <p>{data && `Popularity: ${item.popularity.toFixed(0)}`}</p>
                <p>{data && item.first_air_date === undefined ? `Air Date: Unknown` : `Air Date: ${formatDate(item.first_air_date)}`}</p>
                <p><br></br>{data && item.overview}</p>
            </div>
        )
    }
}

export default MovieData;