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
            const response = await fetch(`https://api.themoviedb.org/3/movie/${props.item.id}?language=en-US&api_key=${mykey}`);
            const jsonData = await response.json();
            setIdData(jsonData);
            setIsLoading(false);
        }
        fetchData();
    }, [props.page]);

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