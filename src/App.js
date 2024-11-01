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
            const sortedData = jsonData.results.sort((a, b) => b.popularity - a.popularity);
            setData(sortedData);
            //console.log("data: ", data.results.title);
        };
        fetchData();
    }, [input]);
    const handleSort = (sortOption) => {
        console.log("DATA", data);
        const sortedData = [...data].sort((a, b) => b[sortOption] - a[sortOption]);
        document.querySelectorAll(".sorting-buttons").forEach(button => {
            button.classList.remove("active-button");
        });
        if (sortOption === "popularity") {
            document.getElementById("popularity-button").classList.add("active-button");
        } else if (sortOption === "vote_average") {
            document.getElementById("rating-button").classList.add("active-button");
        }
        setData(sortedData);
    }
    const sortDatesOld = (sortOption) => {
        document.querySelectorAll(".sorting-buttons").forEach(button => {
            button.classList.remove("active-button");
        });
        document.getElementById("oldest-button").classList.add("active-button");
        const sortedData = [...data].sort((a, b) => new Date(a[sortOption]) - new Date(b[sortOption]));
        setData(sortedData);
    }
    const sortDatesNew = (sortOption) => {
        document.querySelectorAll(".sorting-buttons").forEach(button => {
            button.classList.remove("active-button");
        });
        document.getElementById("newest-button").classList.add("active-button");
        const sortedData = [...data].sort((a, b) => new Date(b[sortOption]) - new Date(a[sortOption]));
        setData(sortedData);
    }
    const suggest = (suggestion) => {
        console.log("CLICKED", data);
        let genres = 0;
        document.getElementById("search").value = 'bob';
        const sortedData = [...data].sort((a, b) => b[suggestion] - a[suggestion]);
        setData(sortedData);
    }
    return (
        <div className='movie-container'>
            <SortingButtons handleSort={handleSort} sortDatesOld={sortDatesOld} sortDatesNew={sortDatesNew}/>
            <div className='movie-section'>
                    {data && data.map((item, index) => (
                        <MovieInfo data={data} key={index} item={item} suggest={suggest}/>
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
            <button id="popularity-button" className="sorting-buttons active-button" autoFocus onClick={() => props.handleSort('popularity')}>Popularity</button>
            <button id="rating-button" className="sorting-buttons" onClick={() => props.handleSort('vote_average')}>Rating</button>
            <button id="oldest-button" className="sorting-buttons" onClick={() => props.sortDatesOld('release_date')}>Oldest</button>
            <button id="newest-button" className="sorting-buttons" onClick={() => props.sortDatesNew('release_date')}>Newest</button>
        </>
      );
}
function MovieInfo({suggest, item, data}) {
    if (item.poster_path !== null) {
        const streamLink = `https://www.justwatch.com/us/search?q=${item.title}`
        let posterPath = "https://image.tmdb.org/t/p/w300" + item.poster_path;
        return (
            <div className='movie-information'>
                <button className='suggestions-button movie-button' onClick={() => suggest('vote_average')}>Suggest</button>
                <button className='movie-button'><a href={streamLink} target='_blank'>Stream</a></button>
                <button className='info-button movie-button'>Info</button>
                <button className='overview-button movie-button'>Overview</button>
                {data && <img className='movie-img' src={posterPath} />}
                {data && <h2 className='movie-names'>{item.title}</h2>}
                {/*console.log(props.data)*/}
                <MovieData data={data} item={item} />
                <MovieOverview data={data} item={item} />
            </div>
        );
    }
}
function MovieData({data, item}) {
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
        </div>
    );
}
function MovieOverview({data, item}) {
    return (
        <div className='overview'>
            <p>{data && item.overview}</p>
        </div>
    );
}

export default App;