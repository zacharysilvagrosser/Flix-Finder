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
    let tvGenres = item.genre_ids.map(genre => {
        switch(genre) {
            case 16:
                return "Animation";
                break;
            case 18:
                return "Drama";
                break;
            case 35:
                return "Comedy";
                break;
            case 37:
                return "Western";
                break;
            case 80:
                return "Crime";
                break;
            case 99:
                return "Documentary";
                break;
            case 9648:
                return "Mystery";
                break;
            case 10751:
                return "Family";
                break;
            case 10762:
                return "Kids";
                break;
            case 10763:
                return "News";
                break;
            case 10764:
                return "Reality";
                break;
            case 10765:
                return "Sci-Fi & Fantasy";
                break;
            case 10766:
                return "Soap";
                break;
            case 10767:
                return "Talk";
                break;
            case 10768:
                return "War & Politics";
                break;
            case 10759:
                return "Action & Adventure";
                break;
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
                <p>{data && item.release_date == '' ? `Release Date: Unknown` : `Release Date: ${formatDate(item.release_date)}`}</p>
                <p><br></br>{data && item.overview}</p>
            </div>
        );
    } else {
        return (
            <div className='info'>
                <p>{data && `Genres: ${tvGenres.join(', ')}`}</p>
                <p>{data && `Rating: ${item.vote_average.toFixed(1)}/10`}</p>
                <p>{data && `Popularity: ${item.popularity.toFixed(0)}`}</p>
                <p>{data && item.first_air_date == undefined ? `Air Date: Unknown` : `Air Date: ${formatDate(item.first_air_date)}`}</p>
                <p><br></br>{data && item.overview}</p>
            </div>
        )
    }
}

export default MovieData;