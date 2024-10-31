// sort movies based on imdb rating, release date, or vote count
// search button that auto types into a google search in another page with the streaming sites for the movie (or link website that tracks that)
// on hover, poster opacity fades and buttons to search for similar movies, find it on streaming, imdb rating atc, appear

import React, {useState, useEffect} from 'react';
import config from './config';

function App() {
    const mykey = config.MY_KEY;
    const [data, setData] = useState(null);

    let input = document.getElementById("search").value;
    document.getElementById("movie-display").style.visibility = "hidden";
    document.getElementById("search-bar").classList.remove("search-bar-large");
    document.getElementById("search-bar").classList.add("search-bar-small");
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${mykey}&query=${input}`);
            const jsonData = await response.json();
            const sortedData = jsonData.results.sort((a, b) => b.vote_count - a.vote_count);
            setData(sortedData);
            //console.log("data: ", data.results.title);
        };
        fetchData();
    }, [input]);
    const handleSort = (sortOption) => {
        console.log("DATA", data);
        const sortedData = [...data].sort((a, b) => b[sortOption] - a[sortOption]);
        setData(sortedData);
    }
    const sortDatesOld = (sortOption) => {
        const sortedData = [...data].sort((a, b) => new Date(a[sortOption]) - new Date(b[sortOption]));
        setData(sortedData);
    }
    const sortDatesNew = (sortOption) => {
        const sortedData = [...data].sort((a, b) => new Date(b[sortOption]) - new Date(a[sortOption]));
        setData(sortedData);
    }
    return (
        <div className='movie-container'>
            <SortingButtons handleSort={handleSort} sortDatesOld={sortDatesOld} sortDatesNew={sortDatesNew}/>
            <div className='movie-section'>
                    {data && data.map((item, index) => (
                        <MovieInfo data={data} key={index} item={item} />
                    ))}
            </div>
        </div>
    );
}
function SortingButtons(props) {
    const [isHighlighted, setIsHighlighted] = useState(false);

    const handleClick = () => {
        setIsHighlighted(!isHighlighted);
    };

    return (
        <>
            <button className="sorting-buttons" onClick={() => props.handleSort('vote_count')}>Vote Count</button>
            <button className="sorting-buttons" id="rating" onClick={() => props.handleSort('vote_average')}>Rating</button>
            <button className="sorting-buttons" onClick={() => props.sortDatesOld('release_date')}>Oldest</button>
            <button className="sorting-buttons" onClick={() => props.sortDatesNew('release_date')}>Newest</button>
        </>
      );
}
function MovieInfo({data, item}) {
    if (item.poster_path !== null) {
        function suggest() {
            console.log("CLICKED");
        }
        const streamLink = `https://www.justwatch.com/us/search?q=${item.title}`
        let posterPath = "https://image.tmdb.org/t/p/w300" + item.poster_path;
        return (
            <div className='movie-information'>
                <button className='suggestions-button movie-button' onClick={suggest}>Suggest</button>
                <button className='movie-button'><a href={streamLink} target='_blank'>Stream</a></button>
                <button className='info-button movie-button'>Info</button>
                <button className='overview-button movie-button'>Overview</button>
                {data && <img className='movie-img' src={posterPath} />}
                {data && <h2 className='movie-names'>{item.title}</h2>}
                {/*console.log(data)*/}
                <MovieOverview data={data} item={item} />
            </div>
        );
    }
}
function MovieOverview({data, item}) {
    return (
        <div className='overview'>
            <p>{data && item.overview}</p>
        </div>
    );
}

export default App;