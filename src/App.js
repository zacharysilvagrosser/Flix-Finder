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
    // Track if we are showing the watch list
    const [showingWatchList, setShowingWatchList] = useState(false);
    const [loading, setLoading] = useState(false);
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
    // Parse searchValue for search and media type
    let userSearch = '';
    let userMediaType = '';
    if (props.searchValue && props.searchValue.includes('|')) {
        [userSearch, userMediaType] = props.searchValue.split('|');
    } else {
        userSearch = props.searchValue || document.getElementById("search")?.value || '';
        userMediaType = document.getElementById('media-type')?.value || 'Movie';
    }
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

    // Open watchlist if forceShowWatchlist is true (from ResultsPage)
    useEffect(() => {
        if (props.forceShowWatchlist) {
            setSavedData(data);
            setData(watchData);
            setShowingWatchList(true);
        }
    }, [props.forceShowWatchlist]);

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
        // Use the genre from the searchValue if it's a Discover search
        let genre = null;
        if (userSearch && userSearch.startsWith('Discover:')) {
            genre = userSearch.replace('Discover:', '').trim();
        } else {
            genre = document.getElementById('discover-button')?.value;
        }
        // Determine media type for correct genre mapping
        let mediaType = userMediaType ? userMediaType.toLowerCase() : 'movie';
        if (mediaType !== 'movie' && mediaType !== 'tv') mediaType = 'movie';
        console.log('[App] convertGenreIDs genre:', genre, 'mediaType:', mediaType);
        // TMDB genre IDs for movies
        const movieGenres = {
            "Action": 28,
            "Adventure": 12,
            "Animation": 16,
            "Comedy": 35,
            "Crime": 80,
            "Documentary": 99,
            "Drama": 18,
            "Family": 10751,
            "Fantasy": 14,
            "History": 36,
            "Horror": 27,
            "Music": 10402,
            "Mystery": 9648,
            "Romance": 10749,
            "Science Fiction": 878,
            "TV Movie": 10770,
            "Thriller": 53,
            "War": 10752,
            "Western": 37
        };
        // TMDB genre IDs for TV
        const tvGenres = {
            "Action": 10759,
            "Adventure": 10759,
            "Action & Adventure": 10759,
            "Animation": 16,
            "Comedy": 35,
            "Crime": 80,
            "Documentary": 99,
            "Drama": 18,
            "Family": 10751,
            "Fantasy": 10765, // Map to Sci-Fi & Fantasy
            "Horror": 10765, // Map to Sci-Fi & Fantasy (no direct horror genre)
            "History": null, // No direct TV genre
            "Thriller": 9648, // Closest: Mystery
            "Science Fiction": 10765, // Map to Sci-Fi & Fantasy
            "Music": null, // No direct TV genre
            "Romance": 10749, // Not a standard TV genre, but exists for movies; some TV shows may use it
            "War": 10768, // War & Politics
            "TV Movie": null, // No direct TV genre
            "Kids": 10762,
            "Mystery": 9648,
            "News": 10763,
            "Reality": 10764,
            "Sci-Fi & Fantasy": 10765,
            "Soap": 10766,
            "Talk": 10767,
            "War & Politics": 10768,
            "Western": 37
        };
        let id = null;
        if (mediaType === 'movie') {
            id = movieGenres[genre] || null;
        } else if (mediaType === 'tv') {
            id = tvGenres[genre] || null;
        }
        if (id === null) {
            console.log('[App] convertGenreIDs: No match for genre', genre, 'mediaType', mediaType);
        }
        return id;
    }
    let [allData, allIDs]= [[], []];
    // Helper to fetch a single page from the API
    const fetchData = async (pages) => {
        let results = [];
        const genreID = convertGenreIDs();
        const isBoth = userMediaType === 'Both';
        const typesToFetch = isBoth ? ['movie', 'tv'] : [userMediaType.toLowerCase()];
        for (const mediaType of typesToFetch) {
            let response;
            const searchInputValue = document.getElementById("search")?.value || '';
            if (searchInputValue === 'Trending') {
                response = await fetch(`https://api.themoviedb.org/3/trending/${mediaType}/day?language=en-US&page=${pages}&api_key=${mykey}`);
            } else if (searchInputValue.startsWith('Discover:')) {
                const url = `https://api.themoviedb.org/3/discover/${mediaType}?include_adult=true&include_video=false&language=en-US&page=${pages}&with_genres=${genreID}&api_key=${mykey}`;
                console.log('[App] Fetching Discover API:', url);
                response = await fetch(url);
            } else {
                response = await fetch(`https://api.themoviedb.org/3/search/${mediaType}?api_key=${mykey}&include_adult=true&page=${pages}&query=${userSearch}&total_pages=True&include_video=false`);
            }
            const jsonData = await response.json();
            if (searchInputValue.startsWith('Discover:')) {
                console.log('[App] Discover API raw results:', jsonData);
            }
            if (jsonData.results) {
                results = results.concat(jsonData.results);
            }
        }
        return results;
    };

    // Load enough pages to ensure 100 filtered results
    const [lastApiPageCount, setLastApiPageCount] = useState(20);
    useEffect(() => {
        let isMounted = true;
        const loadPages = async () => {
            setLoading(true);
            allData = [];
            allIDs = [];
            let filteredResults = [];
            const userPage = Math.ceil(page / 5);
            const startPage = (userPage - 1) * 5 + 1;
            let lastResultsCount = 0;
            let apiPage = 1;
            let done = false;
            while (!done && filteredResults.length < 100 && apiPage <= 50) {
                const pageBatch = Array.from({length: 5}, (_, i) => startPage + apiPage - 1 + i);
                const fetchPromises = pageBatch.map(p => fetchData(p));
                const resultsBatch = await Promise.all(fetchPromises);
                let batchTotalResults = 0;
                resultsBatch.forEach(results => {
                    batchTotalResults += results.length;
                    results.forEach(item => {
                        if (!allIDs.includes(item.id)) {
                            allData.push(item);
                            allIDs.push(item.id);
                        }
                    });
                });
                // If the batch returns fewer than 20 results for all pages, stop fetching more
                if (batchTotalResults < 20 * pageBatch.length) {
                    done = true;
                }
                // If Discover search, skip genre filtering (API already filtered)
                let filtered = [];
                const searchInputValue = document.getElementById("search")?.value || '';
                if (searchInputValue.startsWith('Discover:')) {
                    filtered = allData.filter(item => {
                        let date;
                        if (item.release_date !== undefined) {
                            date = item.release_date;
                        } else if (item.first_air_date !== undefined) {
                            date = item.first_air_date;
                        }
                        if (date !== undefined) {
                            const convertedDate = date.substring(0, 4);
                            const rating = item.vote_average;
                            if (
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
                } else if (!selectedGenres || selectedGenres.length === 0) {
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
                apiPage += 5;
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
            setLoading(false);
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
        const movies = Array.isArray(watchLists[selectedWatchList]?.movies)
            ? watchLists[selectedWatchList].movies
            : [];
        movies.forEach(item => {
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
                                onAdd={name => {
                                    setWatchLists(prev => [...prev, { name, movies: [] }]);
                                    setSelectedWatchList(watchLists.length); // select the new list
                                }}
                                showingWatchList={showingWatchList}
                                onToggleWatchList={handleToggleWatchList}
                                listNumber={listNumber}
                            >
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
            {/* Watch List Header */}
            {showingWatchList && (
                <div style={{
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: '2rem',
                    margin: '2rem 0 1.2rem 0',
                    letterSpacing: '0.04em',
                }}>
                    {watchLists[selectedWatchList]?.name || 'Watch List'}
                </div>
            )}
            <div id='movie-section'>
                {loading && (
                    <div className='loading-spinner-container'>
                        <div className='loading-spinner'></div>
                    </div>
                )}
                {!loading && Array.isArray(showingWatchList ? watchData : data) && (showingWatchList ? watchData.filter(item => {
                    // Filtering logic (same as MovieData)
                    const getYear = (dateStr) => dateStr ? parseInt(dateStr.substring(0, 4), 10) : undefined;
                    const year = item.release_date ? getYear(item.release_date) : (item.first_air_date ? getYear(item.first_air_date) : undefined);
                    const rating = item.vote_average;
                    const genreMatch = !selectedGenres || selectedGenres.length === 0 || (item.genre_ids && item.genre_ids.some((id) => selectedGenres.includes(id)));
                    const dateMatch = (
                        (sixties && year <= 1969) ||
                        (seventies && year >= 1970 && year <= 1979) ||
                        (eighties && year >= 1980 && year <= 1989) ||
                        (ninties && year >= 1990 && year <= 1999) ||
                        (thousands && year >= 2000 && year <= 2009) ||
                        (tens && year >= 2010 && year <= 2019) ||
                        (twenties && year >= 2020)
                    );
                    const ratingMatch = (
                        (rate5 && rating < 6) ||
                        (rate6 && rating >= 6 && rating < 7) ||
                        (rate7 && rating >= 7 && rating < 8) ||
                        (rate8 && rating >= 8)
                    );
                    const isAdultContent = () => {
                        const adultKeywords = [
                            'sex', 'S&M', 'intercourse', 'porn',
                            'busty', 'horny', 'breast', 'seduc'
                        ];
                        return item.adult || adultKeywords.some(word => item.overview && item.overview.includes(word));
                    };
                    if (!year || !genreMatch || !dateMatch || !ratingMatch) return false;
                    if (!isAdult && isAdultContent()) return false;
                    return true;
                }) : data).map((item, index) => (
                    <MovieData
                        data={Array.isArray(showingWatchList ? watchData : data) ? (showingWatchList ? watchData : data) : []}
                        setData={setData}
                        setSavedData={setSavedData}
                        sorted={sorted}
                        key={index}
                        page={page}
                        item={item}
                        watchLists={watchLists}
                        setWatchLists={setWatchLists}
                        selectedWatchList={selectedWatchList}
                        listNumber={listNumber}
                        sixties={sixties}
                        seventies={seventies}
                        eighties={eighties}
                        ninties={ninties}
                        thousands={thousands}
                        tens={tens}
                        twenties={twenties}
                        rate5={rate5}
                        rate6={setRate6}
                        rate7={rate7}
                        rate8={rate8}
                        isAdult={isAdult}
                        selectedGenres={selectedGenres}
                    />
                ))}
                {!loading && <NoMoviesFound data={Array.isArray(showingWatchList ? watchData : data) ? (showingWatchList ? watchData : data) : []} showingWatchList={showingWatchList} />} 
            </div>
            {<SeeMore data={data} page={page} setPage={setPage} nextPage={nextPage} setNextPage={setNextPage} lastApiPageCount={lastApiPageCount}/>} 
        </div>
    );
}

export default App;