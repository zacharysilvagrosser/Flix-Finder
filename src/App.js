// fix oldest and newest staying sorted when searching new movie title
// create an 'add to watchlist feature'
// click movie to get more details like actors?
// make it update when search button clicked not input change

// clicking on watch list again should toggle back to your search and remove active button statis 

// FETCH COLLECTION DATA
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

import React, {useState, useEffect} from 'react';
import config from './config';

const mykey = config.MY_KEY;
function App() {
    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    // load previous watch list data before setting it to an empty array
    const [watchData, setWatchData] = useState(() => {
        const storedData = localStorage.getItem('watchLaterData');
        return storedData ? JSON.parse(storedData) : [];
    });
    const [listNumber, setListNumber] = useState(watchData.length);
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

    let input = document.getElementById("search").value;
    useEffect(() => {
        const fetchData = async () => {
            let response;
            if (document.getElementById("search").value === 'trending') {
                response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${page}&api_key=${mykey}`);
            } else {                
                response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${mykey}&page=${page}&query=${input}`);
            }
            const jsonData = await response.json();
            // sort data by the currently selected filter buttons
            let sortedData;
            if (document.getElementById("popularity-button").classList.contains("active-button")) {
                sortedData = jsonData.results.sort((a, b) => b.popularity - a.popularity);
            } else if (document.getElementById("rating-button").classList.contains("active-button")) {
                sortedData = jsonData.results.sort((a, b) => b.vote_average - a.vote_average);
            } else if (document.getElementById("oldest-button").classList.contains("active-button")) {
                sortedData = [...data].sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
            } else if (document.getElementById("newest-button").classList.contains("active-button")) {
                sortedData = [...data].sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
            } else {
                sortedData = jsonData.results.sort((a, b) => b.popularity - a.popularity);
            }
            setData(sortedData);
        };
        fetchData();
    }, [page, input]);

    // sorting functions for sorting movies by different parameters
    let sortedMovies;
    function sortMovies(sortType) {
        document.querySelectorAll(".sorting-buttons").forEach(button => {
            button.classList.remove("active-button");
        });
        document.getElementById(sortType + "-button").classList.add("active-button");
        setData(sortedMovies);
    }
    const handleSort = (sortOption) => {
        sortedMovies = [...data].sort((a, b) => b[sortOption] - a[sortOption]);
        if (sortOption === "popularity") {
            sortMovies("popularity");
        } else if (sortOption === "vote_average") {
            sortMovies("rating");
        }
    }
    const sortDatesOld = (sortOption) => {
        sortedMovies = [...data].sort((a, b) => new Date(a[sortOption]) - new Date(b[sortOption]));
        sortMovies("oldest");
    }
    const sortDatesNew = (sortOption) => {
        sortedMovies = [...data].sort((a, b) => new Date(b[sortOption]) - new Date(a[sortOption]));
        sortMovies("newest");
    }
    // fetch similar movies from API to display suggested movies to watch
    const suggest = (id) => {
            const fetchSuggestions = async () => {
                const suggestionResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=${page}&api_key=${mykey}`);
                const suggestionJsonData = await suggestionResponse.json();
                setData(suggestionJsonData.results);
            };
            fetchSuggestions();
    }
    // get watch list from local storage and display it on screen
    const showWatchList = () => {
        document.getElementById("watch-list").classList.add("view-watch-list");
        setData(JSON.parse(localStorage.getItem('watchLaterData')));
    };
    // add new movie to a new array of watch list movies
    function addToWatchlist(newItem) {
        // only add new watch list item if not already in the watch list
        const isDuplicate = watchData.some((title) => {
            return title.title === newItem.title;
        });
        if (!isDuplicate) {
            setWatchData([...watchData, newItem]);
            setListNumber(listNumber + 1);
        }
    }
    function deleteFromWatchlist(movieTitle) {
        setWatchData(prevItems => prevItems.filter(movie => movie.title !== movieTitle));
        setData(prevItems => prevItems.filter(movie => movie.title !== movieTitle));
        setListNumber(listNumber - 1);
    }
    // update local storage data whenever watch list movies change
    useEffect(() => {
        localStorage.setItem('watchLaterData', JSON.stringify(watchData));
    }, [watchData]);
    return (
        <div className='movie-container'>
            <LoadWatchList showWatchList={showWatchList} listNumber={listNumber}/>
            <SortingButtons handleSort={handleSort} sortDatesOld={sortDatesOld} sortDatesNew={sortDatesNew}/>
            <div id='movie-section'>
                {data && data.map((item, index) => (
                    <MovieInfo data={data} key={index} item={item} suggest={suggest} addToWatchlist={addToWatchlist} deleteFromWatchlist={deleteFromWatchlist}/>
                ))}
                <NoMoviesFound />
            </div>
            <SeeMore page={page} setPage={setPage} data={data}/>
        </div>
    );
}
function NoMoviesFound() {
    if (document.querySelectorAll(".movie-information").length == 0) {
        return (
            <p id="no-movies-found">There are no movies that match your search query.</p>
        )
    }
}
// Watch list button component to display watch list
function LoadWatchList(props) {
    return (
        <button id="watch-list" onClick={() => props.showWatchList()}>Watch List ({props.listNumber})</button>
    )
}
// Filter buttons on top of movie display that sort movies by categories
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
// individual movie component with all movie information displayed with it
function MovieInfo({suggest, item, data, addToWatchlist, deleteFromWatchlist}) {
    console.log(data)
    if (item.poster_path !== null) {
        const streamLink = `https://www.justwatch.com/us/search?q=${item.title}`
        let posterPath = "https://image.tmdb.org/t/p/w300" + item.poster_path;
        return (
            <div className='movie-information'>
                <button className='suggestions-button movie-button' onClick={() => suggest(item.id)}>Suggest</button>
                <button className='movie-button'><a href={streamLink} target='_blank'>Stream</a></button>
                <button className='info-button movie-button'>Info</button>
                <WatchList data={data} item={item} addToWatchlist={addToWatchlist} deleteFromWatchlist={deleteFromWatchlist}/>
                {data && <img className='movie-img' src={posterPath} alt="Movie Poster" />}
                {data && <h2 className='movie-names'>{item.title}</h2>}
                <MovieData data={data} item={item} />
            </div>
        );
    }
}
// Watch list button on movieinfo component
function WatchList(props) {
    if (document.getElementById("watch-list").classList.contains("view-watch-list")) {
        return <button className='watch-list-button movie-button' onClick={() => props.deleteFromWatchlist(props.item.title)}>Delete</button>
    } else {
        return <button className='watch-list-button movie-button' onClick={() => props.addToWatchlist(props.item)}>Watch List</button>
    }
}
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
            <p><br></br>{data && item.overview}</p>
        </div>
    );
}
// forward and backward buttons to display individual pages of 20 movies at a time on screen
function SeeMore({page, setPage, data}) {
    function goNext() {
        if (data && data.length === 20) {
            setPage(page + 1);
            document.getElementById("search-bar").scrollIntoView({
                behavior: "smooth",
            });
        }
    }
    function goPrevious() {
        if (data && page !== 1) {
            setPage(page - 1);
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
    } else if (page === 1 && (data && data.length < 20)) {
        return;
    } else {
        return (
            <div id="more-data-buttons">
                <button id="previous" onClick={goPrevious}>{'<<'}</button>
                <button id="next" onClick={goNext}>{'>>'}</button>
            </div>
        );
    }
}

export default App;