import React, {useState, useEffect} from 'react';
import Filters from './Filters';
import LoadWatchList from './LoadWatchlist';
import SortingButtons from './SortingButtons';
import MovieData from './MovieData';
//import SeeMore from './SeeMore';
import NoMoviesFound from './NoMoviesFound';
import config from './config';

const mykey = config.MY_KEY;
function App(props) {
    // update styling of search bar and header
    document.getElementById("search-bar").classList.remove("search-bar-large");
    document.getElementById("search-bar").classList.add("search-bar-small");
    document.querySelectorAll('.search-bar-elements').forEach(i => {
    //    i.style = "font-size: 1.2rem; width: 24%; height: 3rem; margin-left: .5rem";
        i.classList.add('search-bar-elements-small');
    });
    document.getElementById("search-div").classList.remove("search-div-large");
    document.getElementById("search-div").classList.add("search-div-small");
    document.getElementById("search-buttons-div").style = "margin-top: .5rem";
    document.getElementById("page-header").classList.add("page-header-small");
    document.getElementById("search-buttons-div").classList.remove("search-buttons-div-large");
    document.getElementById("search-buttons-div").classList.add("search-buttons-div-small");
    document.getElementById("discover-option").style.display = "none";
    // variable to update sorted data
    const [sorted, setSorted] = useState('popularity');
    // usestate variables for filter checkboxes 
    const [sixties, setSixties] = useState(true);
    const [seventies, setSeventies] = useState(true);
    const [eighties, setEighties] = useState(true);
    const [ninties, setNinties] = useState(true);
    const [thousands, setThousands] = useState(true);
    const [tens, setTens] = useState(true);
    const [twenties, setTwenties] = useState(true);
    const [rate5, setRate5] = useState(true);
    const [rate6, setRate6] = useState(true);
    const [rate7, setRate7] = useState(true);
    const [rate8, setRate8] = useState(true);
    const [isAdult, setIsAdult] = useState(false);
    // useState variable to track changes in user search input
    const [userSearch, setUserSearch] = useState(document.getElementById("search").value);
    // useState variable containing API movie data and page number returned
    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    // save data when switching to watch list so you can click it again to revert to the previous data
    const [savedData, setSavedData] = useState(null);
    // load previous watch list data before setting it to an empty array
    const [watchData, setWatchData] = useState(() => {
        const storedData = localStorage.getItem('watchLaterData');
        return storedData ? JSON.parse(storedData) : [];
    });
    const [listNumber, setListNumber] = useState(watchData.length);
    // SET PAGE BACK TO 1 WHEN STARTING NEW SEARCH
    function resetPage() {
        setPage(1);
        document.getElementById("watch-list").classList.remove("view-watch-list");
    }
    document.getElementById("search-button").addEventListener("click", () => {
        resetPage();
    });
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            resetPage();
        }
    });
    document.getElementById("trending-button").addEventListener("click", () => {
        resetPage();
    });
    // eventlisteners to update user search input so new data will be fetched
    document.getElementById("search-button").addEventListener('click', () => {
        setUserSearch(document.getElementById("search").value);
        props.setSearchClicked(!props.searchClicked);
    });
    document.getElementById("trending-button").addEventListener('click', () => {
        document.getElementById("search").value = 'Trending';
        setUserSearch(document.getElementById("search").value);
        props.setSearchClicked(!props.searchClicked);
    });
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            setUserSearch(document.getElementById("search").value);
            props.setSearchClicked(!props.searchClicked);
        }
    });
    function convertGenreIDs() {
        switch(document.getElementById('discover-button').value) {
            case "Adventure":
                return 12;
                break;
            case "Fantasy":
                return 14;
                break;
            case "Animation":
                return 16;
                break;
            case "Drama":
                return 18;
                break;
            case "Horror":
                return 27;
                break;
            case "Action":
                return 28;
                break;
            case "Comedy":
                return 35;
                break;
            case "History":
                return 36;
                break;
            case "Western":
                return 37;
                break;
            case "Thriller":
                return 53;
                break;
            case "Crime":
                return 80;
                break;
            case "Documentary":
                return 99;
                break;
            case "Science Fiction":
                return 878;
                break;
            case "Mystery":
                return 9648;
                break;
            case "Music":
                return 10402;
                break;
            case "Romance":
                return 10749;
                break;
            case "Family":
                return 10751;
                break;
            case "War":
                return 10752;
                break;
            case "TV Movie":
                return 10770;
                break;
        }
    }
    let [allData, allIDs]= [[], []];
    useEffect(() => {
        const fetchMovieData = async () => {
            const response = await fetch(`https://api.themoviedb.org/3/movie/12?language=en-US&api_key=${mykey}`);
            const jsonData = await response.json();
            console.log(jsonData);
        }
        fetchMovieData();
        const fetchData = async (pages) => {
            let response;
            const genreID = convertGenreIDs();
            if (document.getElementById("search").value === 'Trending') {
                response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${pages}&api_key=${mykey}`);
            } else if (document.getElementById("search").value === `Discover: ${document.getElementById('discover-button').value}`) {
                response = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=false&language=en-US&page=${pages}&with_genres=${genreID}&api_key=${mykey}`);
            } else {                
                response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${mykey}&include_adult=true&page=${pages}&query=${userSearch}&total_pages=True&include_video=false`);
            }
            const jsonData = await response.json();
            // collect multiple pages of data to display at once
            jsonData.results.forEach(i => {
                // ensure that duplicate movies dont get rendered
                if (!allIDs.includes(i.id)) {
                    allData.push(i);
                }
                allIDs.push(i.id);
            });
            if (document.getElementById('render-data-option').value === '# of results') {
                document.getElementById('render-data-option').value = 20;
            }
            if (pages === document.getElementById('render-data-option').value / 20 || pages == jsonData.total_pages) {
                // Keep data sorted between fetch requests
                switch (sorted) {
                    case 'popularity':
                        setData(allData.sort((a, b) => b.popularity - a.popularity));
                        setSavedData(allData.sort((a, b) => b.popularity - a.popularity));
                        break;
                    case 'rating':
                        setData(allData.sort((a, b) => b.vote_average - a.vote_average));
                        setSavedData(allData.sort((a, b) => b.vote_average - a.vote_average));
                        break;
                    case 'oldest':
                        setData(allData.sort((a, b) => new Date(a.release_date) - new Date(b.release_date)));
                        setSavedData(allData.sort((a, b) => new Date(a.release_date) - new Date(b.release_date)));
                        break;
                    case 'newest':
                        setData(allData.sort((a, b) => new Date(b.release_date) - new Date(a.release_date)));
                        setSavedData(allData.sort((a, b) => new Date(b.release_date) - new Date(a.release_date)));
                        break;
                }
            }
            return jsonData.total_pages;
        };
        fetchData(1).then(totalPages => {
            for (let i = 2; i <= totalPages; i++) {
                if (document.getElementById('render-data-option').value == 20) {
                    break;
                }
                fetchData(i);
                if (i == (document.getElementById('render-data-option').value / 20)) {
                    break;
                }
                console.log("TOTAL totalPages:", totalPages, i, allData);
            }
        });
    }, [props.searchClicked, userSearch]);

    // update local storage data whenever watch list movies change
    useEffect(() => {
        localStorage.setItem('watchLaterData', JSON.stringify(watchData));
    }, [watchData]);
    return (
        <div className='movie-container'>
            <div id='top-bar-buttons'>
                <div id='watch-list-and-filters'>
                    <LoadWatchList setData={setData} savedData={savedData} listNumber={listNumber}/>
                    <Filters setSixties={setSixties} setSeventies={setSeventies} setEighties={setEighties} setNinties={setNinties} setThousands={setThousands} setTens={setTens} setTwenties={setTwenties}
                    setRate5={setRate5} setRate6={setRate6} setRate7={setRate7} setRate8={setRate8} setIsAdult={setIsAdult}/>
                </div>
                <SortingButtons data={data} setData={setData} setSorted={setSorted}/>
            </div>
            <div id='movie-section'>
                {data && data.map((item, index) => (
                    <MovieData data={data} setData={setData} setSavedData={setSavedData} sorted={sorted} key={index} page={page} item={item} watchData={watchData} setWatchData={setWatchData} listNumber={listNumber} setListNumber={setListNumber} sixties={sixties}
                    seventies={seventies} eighties={eighties} ninties={ninties} thousands={thousands} tens={tens} twenties={twenties} rate5={rate5} rate6={rate6} rate7={rate7} rate8={rate8} isAdult={isAdult}/>
                ))}
                <NoMoviesFound data={data}/>
            </div>
            {/*<SeeMore data={data} page={page} setPage={setPage}/>*/}
        </div>
    );
}

export default App;