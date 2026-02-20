import React, {useState, useEffect} from 'react';
import Filters from './Filters';
import LoadWatchList from './LoadWatchlist';
import AddWatchListButton from './AddWatchListButton';
import SortingButtons from './SortingButtons';
import MovieData from './MovieData';
import SeeMore from './SeeMore';
import NoMoviesFound from './NoMoviesFound';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const mykey = process.env.REACT_APP_API_KEY;
function App(props) {
        // Track if we are showing the watch list
        const [showingWatchList, setShowingWatchList] = useState(false);
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
    // Load filter state from localStorage if available
    const getInitialFilterState = (key, defaultValue) => {
        try {
            const stored = localStorage.getItem('flixFinderFilters');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed && key in parsed) return parsed[key];
            }
        } catch {}
        return defaultValue;
    };
    const [sixties, setSixties] = useState(() => getInitialFilterState('sixties', true));
    const [seventies, setSeventies] = useState(() => getInitialFilterState('seventies', true));
    const [eighties, setEighties] = useState(() => getInitialFilterState('eighties', true));
    const [ninties, setNinties] = useState(() => getInitialFilterState('ninties', true));
    const [thousands, setThousands] = useState(() => getInitialFilterState('thousands', true));
    const [tens, setTens] = useState(() => getInitialFilterState('tens', true));
    const [twenties, setTwenties] = useState(() => getInitialFilterState('twenties', true));
    const [rate5, setRate5] = useState(() => getInitialFilterState('rate5', true));
    const [rate6, setRate6] = useState(() => getInitialFilterState('rate6', true));
    const [rate7, setRate7] = useState(() => getInitialFilterState('rate7', true));
    const [rate8, setRate8] = useState(() => getInitialFilterState('rate8', true));
    const [isAdult, setIsAdult] = useState(() => getInitialFilterState('isAdult', false));
    // All genre IDs for default checked
    const allGenreIDs = [28,12,16,35,80,99,18,10751,14,36,27,10402,9648,10749,878,10770,53,10752,37];
    const [selectedGenres, setSelectedGenres] = useState(() => {
        const saved = getInitialFilterState('selectedGenres', null);
        return saved === null ? allGenreIDs : saved;
    });

    // Save filter state to localStorage whenever any filter changes
    useEffect(() => {
        const filterState = {
            sixties, seventies, eighties, ninties, thousands, tens, twenties,
            rate5, rate6, rate7, rate8, isAdult, selectedGenres
        };
        localStorage.setItem('flixFinderFilters', JSON.stringify(filterState));
    }, [sixties, seventies, eighties, ninties, thousands, tens, twenties, rate5, rate6, rate7, rate8, isAdult, selectedGenres]);
    // track the current search query from routing
    const userSearch = props.searchValue || document.getElementById("search")?.value || '';
    const pageSize = 100;
    // useState variable containing API movie data and page number returned
    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    const [nextPage, setNextPage] = useState(1);
    // save data when switching to watch list so you can click it again to revert to the previous data
    const [savedData, setSavedData] = useState(null);
    // Track which watch list is selected (index)
    const [selectedWatchList, setSelectedWatchList] = useState(0);
    // Multi-watch list support: array of { name, movies }
    const [watchLists, setWatchLists] = useState([
        { name: 'Watch List', movies: [] }
    ]);
    // For backward compatibility, keep current single list as the first
    // watchData/setWatchData now refer to the selected list
    const watchData = watchLists[selectedWatchList]?.movies || [];
    const setWatchData = (newMovies) => {
        setWatchLists(prev => prev.map((wl, i) => i === selectedWatchList ? { ...wl, movies: newMovies } : wl));
    };
    const [isWatchListLoaded, setIsWatchListLoaded] = useState(false);
    // track titles in the Watch List so the movies 'Watch List' button can change to 'Listed' if it's already in the watchlist
    const [watchTitles, setWatchTitles] = useState([]);
    // SET PAGE BACK TO 1 WHEN STARTING NEW SEARCH
    function resetPage() {
        setPage(1);
        setNextPage(1);
        setSavedData(null); // Clear savedData on new search
        setShowingWatchList(false); // Always return to search results on new search
    }
    useEffect(() => {
        resetPage();
    }, [props.searchClicked]);

    // Toggle between watch list and previous results
    function handleToggleWatchList() {
        if (!showingWatchList) {
            setSavedData(data);
            setData(watchData);
            setShowingWatchList(true);
        } else {
            setData(savedData);
            setSavedData(null);
            setShowingWatchList(false);
        }
    }

    // If watchData changes while viewing watch list, update data
    useEffect(() => {
        if (showingWatchList) {
            setData(watchData);
        }
    }, [watchData, showingWatchList]);
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
    // Helper to fetch a single page from the API
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
        return jsonData.results || [];
    };

    // Load enough pages to ensure 100 filtered results
    const [lastApiPageCount, setLastApiPageCount] = useState(20);
    useEffect(() => {
        let isMounted = true;
        const loadPages = async () => {
            allData = [];
            allIDs = [];
            let filteredResults = [];
            let apiPage = 1;
            const userPage = Math.ceil(page / 5);
            const startPage = (userPage - 1) * 5 + 1;
            let lastResultsCount = 0;
            // Keep fetching until we have 100 filtered results or run out of API pages (max 50 pages for safety)
            while (filteredResults.length < 100 && apiPage <= 50) {
                const results = await fetchData(startPage + apiPage - 1);
                lastResultsCount = results.length;
                results.forEach(item => {
                    if (!allIDs.includes(item.id)) {
                        allData.push(item);
                        allIDs.push(item.id);
                    }
                });
                // Apply the same filtering as MovieData (replicate filter logic here)
                let filtered = [];
                if (!selectedGenres || selectedGenres.length === 0) {
                    filtered = [];
                } else {
                    filtered = allData.filter(item => {
                        let date, title;
                        if (item.release_date !== undefined) {
                            date = item.release_date;
                            title = item.title;
                        } else if (item.first_air_date !== undefined) {
                            date = item.first_air_date;
                            title = item.name;
                        }
                        if (date !== undefined) {
                            const convertedDate = date.substring(0, 4);
                            const rating = item.vote_average;
                            const genreFilterActive = selectedGenres && selectedGenres.length > 0;
                            const genreMatch = !genreFilterActive || (item.genre_ids && item.genre_ids.some((id) => selectedGenres.includes(id)));
                            if (
                                genreMatch &&
                                ((sixties && convertedDate <= 1969) ||
                                    (seventies && convertedDate <= 1979 && convertedDate >= 1970) ||
                                    (eighties && convertedDate <= 1989 && convertedDate >= 1980) ||
                                    (ninties && convertedDate <= 1999 && convertedDate >= 1990) ||
                                    (thousands && convertedDate <= 2009 && convertedDate >= 2000) ||
                                    (tens && convertedDate <= 2019 && convertedDate >= 2010) ||
                                    (twenties && convertedDate >= 2020)) &&
                                ((rate5 && rating < 6) || (rate6 && rating < 7 && rating >= 6) || (rate7 && rating < 8 && rating >= 7) || (rate8 && rating >= 8))
                            ) {
                                if (
                                    !isAdult &&
                                    (item.adult ||
                                        (item.overview && (
                                            item.overview.includes('sex') ||
                                            item.overview.includes('S&M') ||
                                            item.overview.includes('intercourse') ||
                                            item.overview.includes('porn') ||
                                            item.overview.includes('busty') ||
                                            item.overview.includes('horny') ||
                                            item.overview.includes('breast') ||
                                            item.overview.includes('seduc')
                                        ))
                                    )
                                ) {
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                        }
                        return false;
                    });
                }
                filteredResults = filtered;
                apiPage++;
            }
            // Only keep the first 100 filtered results
            filteredResults = filteredResults.slice(0, 100);
            setLastApiPageCount(lastResultsCount);
            // Keep data sorted between fetch requests
            let sortedResults = [...filteredResults];
            switch (sorted) {
                case 'popularity':
                    sortedResults = sortedResults.sort((a, b) => b.popularity - a.popularity);
                    break;
                case 'rating':
                    sortedResults = sortedResults.sort((a, b) => b.vote_average - a.vote_average);
                    break;
                case 'oldest':
                    sortedResults = sortedResults.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
                    break;
                case 'newest':
                    sortedResults = sortedResults.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
                    break;
                default:
                    break;
            }
            if (isMounted) {
                setData(sortedResults);
                setSavedData(sortedResults);
            }
        };
        loadPages();
        return () => { isMounted = false; };
    }, [page, userSearch, sorted, props.searchClicked, sixties, seventies, eighties, ninties, thousands, tens, twenties, rate5, rate6, rate7, rate8, isAdult, selectedGenres]);

    // Load all watch lists from Firestore or localStorage
    useEffect(() => {
        async function loadWatchLists() {
            if (currentUser) {
                try {
                    const docRef = doc(db, 'watchlists', currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setWatchLists(docSnap.data().lists || [{ name: 'Watch List', movies: [] }]);
                    } else {
                        setWatchLists([{ name: 'Watch List', movies: [] }]);
                    }
                } catch (error) {
                    console.error('Error loading watchlists:', error);
                    setWatchLists([{ name: 'Watch List', movies: [] }]);
                }
            } else {
                // If user is not logged in, load from localStorage as fallback
                const storedData = localStorage.getItem('watchLaterLists');
                setWatchLists(storedData ? JSON.parse(storedData) : [{ name: 'Watch List', movies: [] }]);
            }
            setIsWatchListLoaded(true);
        }
        loadWatchLists();
    }, [currentUser]);

    // Save all watch lists to Firestore or localStorage whenever they change
    useEffect(() => {
        if (!isWatchListLoaded) return;
        async function saveWatchLists() {
            if (currentUser && watchLists) {
                try {
                    const docRef = doc(db, 'watchlists', currentUser.uid);
                    await setDoc(docRef, { lists: watchLists });
                    // Optionally, you can keep 'movies' for backward compatibility:
                    // await setDoc(docRef, { lists: watchLists, movies: watchLists[0]?.movies || [] });
                    // console.log('Watchlists saved to Firestore:', watchLists.length, 'lists');
                } catch (error) {
                    console.error('Error saving watchlists:', error);
                }
            } else if (!currentUser && watchLists) {
                localStorage.setItem('watchLaterLists', JSON.stringify(watchLists));
            }
        }
        saveWatchLists();
    }, [watchLists, currentUser, isWatchListLoaded]);

    // Update watchTitles whenever watchData changes
    useEffect(() => {
        const titles = [];
        (watchLists[selectedWatchList]?.movies || []).forEach(item => {
            titles.push(item.title);
            titles.push(item.name);
        });
        setWatchTitles(titles);
    }, [watchLists, selectedWatchList]);

    // For now, keep listNumber as the length of the selected list
    const listNumber = watchLists[selectedWatchList]?.movies?.length || 0;

    return (
        <div className='movie-container'>
            <div id='top-bar-buttons' className={props.renderSearchBar ? 'results-toolbar' : ''}>
                <div id='sorting-panel' className='control-panel'>
                    <SortingButtons data={data} setData={setData} setSorted={setSorted}/>
                </div>
                {props.renderSearchBar && (
                    <div id='results-search-slot'>
                        {props.renderSearchBar}
                        <div id='results-watchlist-slot' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <LoadWatchList
                                setData={setData}
                                savedData={savedData}
                                setSavedData={setSavedData}
                                data={data}
                                watchData={watchData}
                                watchLists={watchLists}
                                selectedWatchList={selectedWatchList}
                                setSelectedWatchList={setSelectedWatchList}
                                onEditName={(idx, newName) => {
                                    setWatchLists(prev => prev.map((wl, i) => i === idx ? { ...wl, name: newName } : wl));
                                }}
                                onDelete={idx => {
                                    setWatchLists(prev => {
                                        // Remove the list at idx, and select the previous or first list
                                        const newLists = prev.filter((_, i) => i !== idx);
                                        let newSelected = selectedWatchList;
                                        if (idx === selectedWatchList) {
                                            newSelected = Math.max(0, idx - 1);
                                        } else if (idx < selectedWatchList) {
                                            newSelected = selectedWatchList - 1;
                                        }
                                        setSelectedWatchList(newSelected);
                                        return newLists;
                                    });
                                }}
                                showingWatchList={showingWatchList}
                                onToggleWatchList={handleToggleWatchList}
                                listNumber={listNumber}
                            >
                                <AddWatchListButton onAdd={name => {
                                    setWatchLists(prev => {
                                        const newLists = [...prev, { name, movies: [] }];
                                        return newLists;
                                    });
                                    setSelectedWatchList(watchLists.length); // select new
                                }} />
                            </LoadWatchList>
                        </div>
                    </div>
                )}
                <div id='filters-panel' className='control-panel'>
                    <Filters
                        sixties={sixties}
                        seventies={seventies}
                        eighties={eighties}
                        ninties={ninties}
                        thousands={thousands}
                        tens={tens}
                        twenties={twenties}
                        setSixties={setSixties}
                        setSeventies={setSeventies}
                        setEighties={setEighties}
                        setNinties={setNinties}
                        setThousands={setThousands}
                        setTens={setTens}
                        setTwenties={setTwenties}
                        rate5={rate5}
                        rate6={rate6}
                        rate7={rate7}
                        rate8={rate8}
                        setRate5={setRate5}
                        setRate6={setRate6}
                        setRate7={setRate7}
                        setRate8={setRate8}
                        isAdult={isAdult}
                        setIsAdult={setIsAdult}
                        selectedGenres={selectedGenres}
                        setSelectedGenres={setSelectedGenres}
                    />
                </div>
            </div>
            <div id='movie-section'>
                {data && data.map((item, index) => (
                    <MovieData
                        data={data}
                        setData={setData}
                        setSavedData={setSavedData}
                        sorted={sorted}
                        key={index}
                        page={page}
                        item={item}
                        watchData={watchData}
                        setWatchData={setWatchData}
                        listNumber={listNumber}
                        sixties={sixties}
                        seventies={seventies}
                        eighties={eighties}
                        ninties={ninties}
                        thousands={thousands}
                        tens={tens}
                        twenties={twenties}
                        rate5={rate5}
                        rate6={rate6}
                        rate7={rate7}
                        rate8={rate8}
                        isAdult={isAdult}
                        selectedGenres={selectedGenres}
                        watchTitles={watchTitles}
                        setWatchTitles={setWatchTitles}
                    />
                ))}
                <NoMoviesFound data={data}/>
            </div>
            {<SeeMore data={data} page={page} setPage={setPage} nextPage={nextPage} setNextPage={setNextPage} lastApiPageCount={lastApiPageCount}/>} 
        </div>
    );
}

export default App;