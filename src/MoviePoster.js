import React, {useState, useEffect} from 'react';

function MoviePoster(props) {
    let posterPath;
    if (props.item.poster_path) {
        posterPath = "https://image.tmdb.org/t/p/w300" + props.item.poster_path;
    } else {
        posterPath = require('./missing-img.png'); 
    }
    const mykey = process.env.REACT_APP_API_KEY;
    const [isLoading, setIsLoading] = useState(true);
    const [idData, setIdData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            // Determine if item is a movie or TV show
            let endpoint = 'movie';
            // TMDB returns 'media_type' for trending/mixed, or use heuristics
            if (props.item.media_type) {
                endpoint = props.item.media_type;
            } else if (props.item.first_air_date && !props.item.release_date) {
                endpoint = 'tv';
            }
            try {
                const response = await fetch(`https://api.themoviedb.org/3/${endpoint}/${props.item.id}?language=en-US&api_key=${mykey}`);
                const jsonData = await response.json();
                setIdData(jsonData);
            } catch (err) {
                setIdData(null);
            }
            setIsLoading(false);
        }
        fetchData();
    }, [props.page, mykey, props.item.id, props.item.media_type, props.item.first_air_date, props.item.release_date]);

    if (isLoading) {
        return <div>Loading...</div>;
    }
    // Only show IMDb link if available
    const imdbLink = idData && idData.imdb_id ? 'https://www.imdb.com/title/' + idData.imdb_id : undefined;
    return (
        imdbLink ? (
            <a className='imdb-link' href={imdbLink} target='_blank' rel='noreferrer'>
                <img className='movie-img' src={posterPath} alt="Movie Poster" />
            </a>
        ) : (
            <img className='movie-img' src={posterPath} alt="Movie Poster" />
        )
    );
}

export default MoviePoster;