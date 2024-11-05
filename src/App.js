// fix oldest and newest staying sorted when searching new movie title
// create an 'add to watchlist feature'
// add arrows to move to the next page of 20 movies after getting suggestions

import React, {useState, useEffect} from 'react';
import config from './config';

const mykey = config.MY_KEY;
function App() {
    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);

    let input = document.getElementById("search").value;

    // SET PAGE BACK TO 1 WHEN STARTING NEW SEARCH
    document.getElementById("search-button").addEventListener("click", () => {
        setPage(1);
    });
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            setPage(1);
        }
    });
    document.getElementById("trending-button").addEventListener("click", () => {
        setPage(1);
    });

    useEffect(() => {
        const fetchData = async () => {
            let response;
            if (document.getElementById("search").value === 'trending') {
                response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${page}&api_key=${mykey}`);
            } else {                
                response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${mykey}&page=${page}&query=${input}`);
            }
            const jsonData = await response.json();
            let sortedData;
            if (document.getElementById("popularity-button").classList.contains("active-button")) {
                sortedData = jsonData.results.sort((a, b) => b.popularity - a.popularity);
                console.log("popular");
            } else if (document.getElementById("rating-button").classList.contains("active-button")) {
                sortedData = jsonData.results.sort((a, b) => b.vote_average - a.vote_average);
                console.log("rate");
            } else if (document.getElementById("oldest-button").classList.contains("active-button")) {
                sortedData = [...data].sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
                console.log("old");
            } else if (document.getElementById("newest-button").classList.contains("active-button")) {
                sortedData = [...data].sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
            } else {
                sortedData = jsonData.results.sort((a, b) => b.popularity - a.popularity);
            }
            setData(sortedData);
        };
        fetchData();
    }, [page, input]);
    const handleSort = (sortOption) => {
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
    const suggest = (id) => {
        //const fetchData = async () => {
            //const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US&api_key=${mykey}`);
            //const jsonData = await response.json();
            //console.log(jsonData);
            // displays all movies that belong to the same collection
            /*if (jsonData.belongs_to_collection !== null) {
                const collection = jsonData.belongs_to_collection.id;
                const fetchCollection = async () => {
                    const collectionResponse = await fetch(`https://api.themoviedb.org/3/collection/${collection}?api_key=${mykey}`);
                    const collectionJsonData = await collectionResponse.json();
                    setData(collectionJsonData.parts);
                };
                fetchCollection();
            }*/
            const fetchSuggestions = async () => {
                const suggestionResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=${page}&api_key=${mykey}`);
                const suggestionJsonData = await suggestionResponse.json();
                console.log(suggestionJsonData)
                setData(suggestionJsonData.results);
            };
            fetchSuggestions();
        //};
        //fetchData();
    }
    return (
        <div className='movie-container'>
            <SortingButtons handleSort={handleSort} sortDatesOld={sortDatesOld} sortDatesNew={sortDatesNew}/>
            <div className='movie-section'>
                    {data && data.map((item, index) => (
                        <MovieInfo data={data} key={index} item={item} suggest={suggest}/>
                    ))}
            </div>
            <SeeMore page={page} setPage={setPage} data={data}/>
        </div>
    );
}
function SeeMore({page, setPage, data}) {
    function goNext() {
        if (data.length === 20) {
            setPage(page + 1);
            console.log(data);
            document.getElementById("search-bar").scrollIntoView({
                behavior: "smooth",
            });
        }
    }
    function goPrevious() {
        if (page !== 1) {
            setPage(page - 1);
            console.log(data);
            document.getElementById("search-bar").scrollIntoView({
                behavior: "smooth",
              });
        }
    }
    if (page !== 1 && (data && data.length !== 20)) {
        return (
            <div id="more-data-buttons">
                <button id="previous" onClick={goPrevious}>{'<<'}</button>
                </div>
        )
    } else if (page === 1 && (data && data.length === 20)) {
        return (
            <div id="more-data-buttons">
                <button id="next" onClick={goNext}>{'>>'}</button>
                </div>
        )
    } else {
        return (
            <div id="more-data-buttons">
                <button id="previous" onClick={goPrevious}>{'<<'}</button>
                <button id="next" onClick={goNext}>{'>>'}</button>
            </div>
        );
    }
}
function SortingButtons(props) {
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
                <button className='suggestions-button movie-button' onClick={() => suggest(item.id)}>Suggest</button>
                <button className='movie-button'><a href={streamLink} target='_blank'>Stream</a></button>
                <button className='info-button movie-button'>Info</button>
                <button className='overview-button movie-button'>Overview</button>
                {data && <img className='movie-img' src={posterPath} alt="Movie Poster" />}
                {data && <h2 className='movie-names'>{item.title}</h2>}
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