import React from 'react';

// List of movie data in the Info button of movieinfo component
function MovieData({data, item}) {
    // convert all genre ids to words
    let genres = item.genre_ids.map(genre => {
        switch(genre) {
            case 12:
                return "Adventure";
                break;
            case 14:
                return "Fantasy";
                break;
            case 16:
                return "Animation";
                break;
            case 18:
                return "Drama";
                break;
            case 27:
                return "Horror";
                break;
            case 28:
                return "Action";
                break;
            case 35:
                return "Comedy";
                break;
            case 36:
                return "History";
                break;
            case 37:
                return "Western";
                break;
            case 53:
                return "Thriller";
                break;
            case 80:
                return "Crime";
                break;
            case 99:
                return "Documentary";
                break;
            case 878:
                return "Science Fiction";
                break;
            case 9648:
                return "Mystery";
                break;
            case 10402:
                return "Music";
                break;
            case 10749:
                return "Romance";
                break;
            case 10751:
                return "Family";
                break;
            case 10752:
                return "War";
                break;
            case 10770:
                return "TV Movie";
                break;
            default:
                return "None";
        }
    });
    function formatDate(date) {
        const [year, month, day] = date.split('-');
        return `${month}/${day}/${year}`;
    }
    return (
        <div className='info'>
            <p>{data && `Genres: ${genres.join(', ')}`}</p>
            <p>{data && `Rating: ${item.vote_average.toFixed(1)}/10`}</p>
            <p>{data && `Popularity: ${item.popularity.toFixed(0)}`}</p>
            <p>{data && `Release Date: ${formatDate(item.release_date)}`}</p>
            <p><br></br>{data && item.overview}</p>
        </div>
    );
}

export default MovieData;