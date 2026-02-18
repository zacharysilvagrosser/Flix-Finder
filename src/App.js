import React, {useState, useEffect} from 'react';
import Filters from './Filters';
import LoadWatchList from './LoadWatchlist';
import SortingButtons from './SortingButtons';
import MovieData from './MovieData';
import SeeMore from './SeeMore';
import NoMoviesFound from './NoMoviesFound';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const mykey = process.env.REACT_APP_API_KEY;
function App(props) {
    const { currentUser } = useAuth();
    useEffect(() => {
        const searchBar = document.getElementById("search-bar");
        const searchDiv = document.getElementById("search-div");
        const searchButtonsDiv = document.getElementById("search-buttons-div");
        const pageHeader = document.getElementById("page-header");
        const discoverOption = document.getElementById("discover-option");

        if (!searchBar || !searchDiv || !searchButtonsDiv || !pageHeader) {
            return;
        }

        searchBar.classList.remove("search-bar-large");
        searchBar.classList.add("search-bar-small");
        document.querySelectorAll('.search-bar-elements').forEach(i => {
            i.classList.add('search-bar-elements-small');
            i.classList.remove('bottom-bar');
        });
        searchDiv.classList.remove("search-div-large");
        searchDiv.classList.add("search-div-small");
        searchButtonsDiv.style = "margin-top: .5rem";
        pageHeader.classList.remove("page-header-large");
        pageHeader.classList.add("page-header-small");
        searchButtonsDiv.classList.remove("search-buttons-div-large");
        searchButtonsDiv.classList.add("search-buttons-div-small");
        if (discoverOption) {
            discoverOption.style.display = "none";
        }
    }, []);
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
    // track the current search query from routing
    const userSearch = props.searchValue || document.getElementById("search")?.value || '';
    const pageSize = 20;
    // useState variable containing API movie data and page number returned
    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    const [nextPage, setNextPage] = useState(1);
    // save data when switching to watch list so you can click it again to revert to the previous data
    const [savedData, setSavedData] = useState(null);
    // load previous watch list data - will be synced with Firestore if user is logged in
    const [watchData, setWatchData] = useState([]);
    const [isWatchListLoaded, setIsWatchListLoaded] = useState(false);
    // track titles in the Watch List so the movies 'Watch List' button can change to 'Listed' if it's already in the watchlist
    const [watchTitles, setWatchTitles] = useState([]);
    // SET PAGE BACK TO 1 WHEN STARTING NEW SEARCH
    function resetPage() {
        setPage(1);
        setNextPage(1);
        document.getElementById("watch-list").classList.remove("view-watch-list");
    }
    useEffect(() => {
        resetPage();
    }, [props.searchClicked]);
    function convertGenreIDs() {
        switch(document.getElementById('discover-button').value) {
            case "Adventure":
                return 12;
            case "Fantasy":
                return 14;
            case "Animation":
                return 16;
            case "Drama":
                return 18;
            case "Horror":
                return 27;
            case "Action":
                return 28;
            case "Comedy":
                return 35;
            case "History":
                return 36;
            case "Western":
                return 37;
            case "Thriller":
                return 53;
            case "Crime":
                return 80;
            case "Documentary":
                return 99;
            case "Science Fiction":
                return 878;
            case "Mystery":
                return 9648;
            case "Music":
                return 10402;
            case "Romance":
                return 10749;
            case "Family":
                return 10751;
            case "War":
                return 10752;
            case "TV Movie":
                return 10770;
            default:
                return null;
        }
    }
    let [allData, allIDs]= [[], []];
    useEffect(() => {
        const fetchData = async (pages) => {
            let response;
            const mediaType = document.getElementById('media-type').value;
            const genreID = convertGenreIDs();
            if (document.getElementById("search").value === 'Trending') {
                response = await fetch(`https://api.themoviedb.org/3/trending/${mediaType.toLowerCase()}/day?language=en-US&page=${pages}&api_key=${mykey}`);
            } else if (document.getElementById("search").value === `Discover: ${document.getElementById('discover-button').value}`) {
                response = await fetch(`https://api.themoviedb.org/3/discover/${mediaType.toLowerCase()}?include_adult=true&include_video=false&language=en-US&page=${pages}&with_genres=${genreID}&api_key=${mykey}`);
            } else {
                response = await fetch(`https://api.themoviedb.org/3/search/${mediaType.toLowerCase()}?api_key=${mykey}&include_adult=true&page=${pages}&query=${userSearch}&total_pages=True&include_video=false`);
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
            if (pages === ((pageSize / 20) * page) || pages === (jsonData.total_pages - 1)) {
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
                    default:
                        break;
                }
                setPage(page + 1);
                console.log('page', page);
                console.log('nextpage', nextPage);
            }
            return jsonData.total_pages;
        };
        fetchData(nextPage).then(totalPages => {
            for (let i = nextPage + 1; i <= (pageSize / 20) * page; i++) {
                if (i === (totalPages)) {
                   console.log('second break');
                   break;
                }
                fetchData(i);
                console.log("TOTAL totalPages:", totalPages, 'i', i, 'page', page, 'allData', allData);
            }
        });
    }, [props.searchClicked, userSearch, nextPage]);

    // Load watch list from Firestore when user logs in
    useEffect(() => {
        async function loadWatchList() {
            if (currentUser) {
                try {
                    const docRef = doc(db, 'watchlists', currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setWatchData(docSnap.data().movies || []);
                    } else {
                        setWatchData([]);
                    }
                } catch (error) {
                    console.error('Error loading watchlist:', error);
                    setWatchData([]);
                }
            } else {
                // If user is not logged in, load from localStorage as fallback
                const storedData = localStorage.getItem('watchLaterData');
                setWatchData(storedData ? JSON.parse(storedData) : []);
            }
            setIsWatchListLoaded(true);
        }
        loadWatchList();
    }, [currentUser]);

    // Save watch list to Firestore whenever it changes
    useEffect(() => {
        // Don't save until the initial load is complete
        if (!isWatchListLoaded) return;
        
        async function saveWatchList() {
            if (currentUser && watchData) {
                try {
                    const docRef = doc(db, 'watchlists', currentUser.uid);
                    await setDoc(docRef, { movies: watchData });
                    console.log('Watchlist saved to Firestore:', watchData.length, 'items');
                } catch (error) {
                    console.error('Error saving watchlist:', error);
                }
            } else if (!currentUser && watchData) {
                // Fallback to localStorage if not logged in
                localStorage.setItem('watchLaterData', JSON.stringify(watchData));
            }
        }
        saveWatchList();
    }, [watchData, currentUser, isWatchListLoaded]);

    // Update watchTitles whenever watchData changes
    useEffect(() => {
        const titles = [];
        watchData.forEach(item => {
            titles.push(item.title);
            titles.push(item.name);
        });
        setWatchTitles(titles);
    }, [watchData]);

    const listNumber = watchData.length;

    return (
        <div className='movie-container'>
            <div id='top-bar-buttons'>
                <div id='watch-list-and-filters'>
                    <LoadWatchList setData={setData} savedData={savedData} listNumber={listNumber} setSavedData={setSavedData} data={data} watchData={watchData}/>
                    <Filters setSixties={setSixties} setSeventies={setSeventies} setEighties={setEighties} setNinties={setNinties} setThousands={setThousands} setTens={setTens} setTwenties={setTwenties}
                    setRate5={setRate5} setRate6={setRate6} setRate7={setRate7} setRate8={setRate8} setIsAdult={setIsAdult}/>
                </div>
                <SortingButtons data={data} setData={setData} setSorted={setSorted}/>
            </div>
            <div id='movie-section'>
                {data && data.map((item, index) => (
                    <MovieData data={data} setData={setData} setSavedData={setSavedData} sorted={sorted} key={index} page={page} item={item} watchData={watchData} setWatchData={setWatchData} listNumber={listNumber} sixties={sixties}
                    seventies={seventies} eighties={eighties} ninties={ninties} thousands={thousands} tens={tens} twenties={twenties} rate5={rate5} rate6={rate6} rate7={rate7} rate8={rate8} isAdult={isAdult} watchTitles={watchTitles} setWatchTitles={setWatchTitles}/>
                ))}
                <NoMoviesFound data={data}/>
            </div>
            {<SeeMore data={data} page={page} setPage={setPage} nextPage={nextPage} setNextPage={setNextPage}/>}
        </div>
    );
}

export default App;