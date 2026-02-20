import React from 'react';
import MovieInfo from './MovieInfo';
import WatchList from './WatchList';
import Suggest from './Suggest';
import MoviePoster from './MoviePoster';

// individual movie component with all movie information displayed with it
function MovieData(props) {
    // Info button hover state (must be at top, not conditional)
    const [showInfo, setShowInfo] = React.useState(false);
    let date, title;
    if (props.item.release_date !== undefined) {
        // object names for movies
        date = props.item.release_date;
        title = props.item.title;
    } else if (props.item.first_air_date !== undefined) {
        // object names for TV
        date = props.item.first_air_date;
        title = props.item.name;
    }
    // Helper functions for filtering
    const getYear = (dateStr) => dateStr ? parseInt(dateStr.substring(0, 4), 10) : undefined;
    const isGenreMatch = () => {
        const { selectedGenres, item } = props;
        if (!selectedGenres || selectedGenres.length === 0) return true;
        return item.genre_ids && item.genre_ids.some((id) => selectedGenres.includes(id));
    };
    const isDateMatch = (year) => (
        (props.sixties && year <= 1969) ||
        (props.seventies && year >= 1970 && year <= 1979) ||
        (props.eighties && year >= 1980 && year <= 1989) ||
        (props.ninties && year >= 1990 && year <= 1999) ||
        (props.thousands && year >= 2000 && year <= 2009) ||
        (props.tens && year >= 2010 && year <= 2019) ||
        (props.twenties && year >= 2020)
    );
    const isRatingMatch = (rating) => (
        (props.rate5 && rating < 6) ||
        (props.rate6 && rating >= 6 && rating < 7) ||
        (props.rate7 && rating >= 7 && rating < 8) ||
        (props.rate8 && rating >= 8)
    );
    const isAdultContent = () => {
        const { item } = props;
        const adultKeywords = [
            'sex', 'S&M', 'intercourse', 'porn',
            'busty', 'horny', 'breast', 'seduc'
        ];
        return item.adult || adultKeywords.some(word => item.overview && item.overview.includes(word));
    };

    if (date !== undefined) {
        const year = getYear(date);
        const rating = props.item.vote_average;
        if (
            isGenreMatch() &&
            isDateMatch(year) &&
            isRatingMatch(rating)
        ) {
            if (!props.isAdult && isAdultContent()) {
                return;
            }
            const streamLink = `https://www.justwatch.com/us/search?q=${title}`;
            // Determine if this is a TV show
            const isTV = !!props.item.first_air_date;
            const tvClass = isTV ? 'tv-show' : '';
            return (
                <div className='movie-information'>
                    <div className='movie-header'>
                        {props.data && <h2 className={`movie-names ${tvClass}`}>{title}</h2>}
                        <div className='watchlist-plus'>
                            <WatchList data={props.data} item={props.item} watchData={props.watchData} setWatchData={props.setWatchData} listNumber={props.listNumber} setData={props.setData} watchTitles={props.watchTitles} setWatchTitles={props.setWatchTitles}/>
                        </div>
                    </div>
                    <div className='movie-poster-info-area'>
                        {props.data && (showInfo ? <MovieInfo data={props.data} item={props.item}/> : <MoviePoster item={props.item} page={props.page}/>) }
                    </div>
                    <div className='movie-buttons'>
                        <Suggest item={props.item} setData={props.setData} setSavedData={props.setSavedData} sorted={props.sorted} page={props.page} mykey={props.mykey} className={tvClass} />
                        <button className={`movie-button ${tvClass}`} title="Find where to stream this title"><a href={streamLink} target='_blank' rel='noreferrer'>Stream</a></button>
                        <button className={`info-button movie-button ${tvClass}`} title="Display movie information"
                            onClick={() => setShowInfo(show => !show)}
                        >{showInfo ? 'Close Info' : 'Info'}</button>
                    </div>
                </div>
            );
        }
    }
}

export default MovieData;