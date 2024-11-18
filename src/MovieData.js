import React from 'react';
import MovieInfo from './MovieInfo';
import WatchList from './WatchList';
import Suggest from './Suggest';

// individual movie component with all movie information displayed with it
function MovieData(props) {
    const convertedDate = props.item.release_date.substring(0, 4);
    const rating = props.item.vote_average;

    if (props.item.poster_path !== null &&
    ((props.sixties && convertedDate <= 1969) || (props.seventies && convertedDate <= 1979 && convertedDate >= 1970) || (props.eighties && convertedDate <= 1989 && convertedDate >= 1980) ||
    (props.ninties && convertedDate <= 1999 && convertedDate >= 1990) || (props.thousands && convertedDate <= 2009 && convertedDate >= 2000)|| (props.tens && convertedDate <= 2019 && convertedDate >= 2010) || (props.twenties && convertedDate >= 2020))
    && ((props.rate5 && rating < 6) || (props.rate6 && rating < 7 && rating >= 6) || (props.rate7 && rating < 8 && rating >= 7) || (props.rate8 && rating >= 8))) {
        if (!props.isAdult && props.item.adult) {
            return;
        } else {
            const streamLink = `https://www.justwatch.com/us/search?q=${props.item.title}`
            let posterPath = "https://image.tmdb.org/t/p/w300" + props.item.poster_path;
            return (
                <div className='movie-information'>
                    <Suggest item={props.item} setData={props.setData} setSavedData={props.setSavedData} sorted={props.sorted} page={props.page} mykey={props.mykey}/>
                    <button className='movie-button'><a href={streamLink} target='_blank'>Stream</a></button>
                    <button className='info-button movie-button'>Info</button>
                    <WatchList data={props.data} item={props.item} watchData={props.watchData} setWatchData={props.setWatchData} listNumber={props.listNumber} setListNumber={props.setListNumber} setData={props.setData}/>
                    {props.data && <img className='movie-img' src={posterPath} alt="Movie Poster" />}
                    {props.data && <h2 className='movie-names'>{props.item.title}</h2>}
                    <MovieInfo data={props.data} item={props.item}/>
                </div>
            );
        }
    }
}

export default MovieData;