import React from 'react';
import config from './config';

function Suggest(props) {
    const mykey = config.MY_KEY;
    // fetch similar movies from API to display suggested movies to watch
    const suggest = (id) => {
        const fetchSuggestions = async () => {
            const suggestionResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=${props.page}&api_key=${mykey}`);
            const suggestionJsonData = await suggestionResponse.json();
            props.setData(suggestionJsonData.results);
            props.setSavedData(suggestionJsonData.results);
            document.getElementById('search').value = 'Suggested similar movies';
        };
        fetchSuggestions();
    }
    return <button className='suggestions-button movie-button' onClick={() => suggest(props.item.id)}>Suggest</button>
}

export default Suggest;