import React, {useState, useEffect} from 'react';
import config from './config';

function MoviePoster(props) {
    const posterPath = "https://image.tmdb.org/t/p/w300" + props.item.poster_path;
    const mykey = config.MY_KEY;
    const [isLoading, setIsLoading] = useState(true);
    const [idData, setIdData] = useState(null);
    useEffect(() => {
        const fetchData = async (pages) => {
            setIsLoading(true);
            const response = await fetch(`https://api.themoviedb.org/3/movie/${props.item.id}?language=en-US&api_key=${mykey}&page=${pages}`);
            const jsonData = await response.json();
            setIdData(jsonData);
            setIsLoading(false);
        }
        fetchData(1);
    }, []); // Empty dependency array ensures the effect runs only once

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <a className='imdb-link' href={'https://www.imdb.com/title/' + idData.imdb_id} target='_blank'>
            <img className='movie-img' src={posterPath} alt="Movie Poster" />
        </a>
    )
}

export default MoviePoster;