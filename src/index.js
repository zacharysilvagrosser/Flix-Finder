import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import React, { useEffect, useState } from 'react';
import { AuthProvider } from './AuthContext';
import UserHeader from './UserHeader';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

function HomePage() {
    const navigate = useNavigate();

    const discoverSelectPreview = () => {
        document.getElementById("search").value = `Discover: ${document.getElementById('discover-button').value}`;
        if (document.getElementById("watch-list")) {
            document.getElementById("watch-list").classList.remove("view-watch-list");
        }
    };

    const handleSearchNavigate = (value) => {
        const nextValue = value || '';
        navigate(`/search?q=${encodeURIComponent(nextValue)}`);
    };

    return (
        <div id="container">
            <UserHeader />
            <h1 id="page-header" className='page-header-large'>Flix Finder</h1>
            <p id="page-subtitle">Search, discover, and save your next watch.</p>
                <SearchBar onSearchNavigate={handleSearchNavigate} discoverSelectPreview={discoverSelectPreview} showWatchlistButton={true} />
            <Tagline />
        </div>
    );
}

function ResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchClicked, setSearchClicked] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const discoverSelectPreview = () => {
        document.getElementById("search").value = `Discover: ${document.getElementById('discover-button').value}`;
        if (document.getElementById("watch-list")) {
            document.getElementById("watch-list").classList.remove("view-watch-list");
        }
    };

    const handleSearchNavigate = (value) => {
        const nextValue = value || '';
        navigate(`/search?q=${encodeURIComponent(nextValue)}`);
    };

    const [forceShowWatchlist, setForceShowWatchlist] = useState(false);
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const nextValue = params.get('q') || '';
        const openWatchlist = params.get('watchlist') === '1';
        const searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.value = nextValue;
        }
        setSearchValue(nextValue);
        setSearchClicked((prev) => !prev);
        setForceShowWatchlist(openWatchlist);
    }, [location.search]);

    return (
        <div id="container" className="results-page">
            <UserHeader />
            <h1
                id="page-header"
                className='page-header-large page-header-link'
                onClick={() => navigate('/')}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        navigate('/');
                    }
                }}
                aria-label="Flix Finder Home"
            >
                Flix Finder
            </h1>
            <App
                searchClicked={searchClicked}
                searchValue={searchValue}
                forceShowWatchlist={forceShowWatchlist}
                    renderSearchBar={
                        <SearchBar onSearchNavigate={handleSearchNavigate} discoverSelectPreview={discoverSelectPreview} showWatchlistButton={false} />
                    }
            />
        </div>
    );
}

root.render (
    <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<ResultsPage />} />
            </Routes>
        </BrowserRouter>
    </AuthProvider>
)
function SearchBar(props) {
        // Expose a global function for Discover to trigger search with value and type
        React.useEffect(() => {
            window.triggerSearchFromDiscover = (value, type) => {
                setSearchValue(value);
                setMediaType(type);
                props.onSearchNavigate?.(`${value}|${type}`);
            };
            return () => { delete window.triggerSearchFromDiscover; };
        }, [props]);
    // Parse initial value from query string if present
    const getInitialValues = () => {
        // Try to get from URL (q param)
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get('q') || '';
        if (q.includes('|')) {
            const [search, type] = q.split('|');
            return {
                searchValue: search,
                mediaType: type || (localStorage.getItem('flixFinderMediaType') || 'Movie')
            };
        }
        return {
            searchValue: q,
            mediaType: localStorage.getItem('flixFinderMediaType') || 'Movie'
        };
    };

    const [mediaType, setMediaType] = React.useState(getInitialValues().mediaType);
    const [searchValue, setSearchValue] = React.useState(getInitialValues().searchValue);

    // Keep state in sync with URL changes (e.g., when navigating or switching types)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get('q') || '';
        if (q.includes('|')) {
            const [search, type] = q.split('|');
            setSearchValue(search);
            setMediaType(type);
        } else {
            setSearchValue(q);
        }
    }, [window.location.search]);

    const triggerSearch = (valueOverride, typeOverride) => {
        let value = valueOverride !== undefined ? valueOverride : searchValue;
        let type = typeOverride !== undefined ? typeOverride : mediaType;
        // Compose a query string that includes both search and media type
        props.onSearchNavigate?.(`${value}|${type}`);
    };

    const handleSearch = () => {
        triggerSearch();
    };

    const handleTrending = () => {
        triggerSearch('Trending');
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            triggerSearch();
        }
    };

    const handleInputChange = (e) => {
        setSearchValue(e.target.value);
    };

    // Allow external code to set the search bar value and update state
    React.useEffect(() => {
        const searchInput = document.getElementById('search');
        if (!searchInput) return;
        const handler = (e) => {
            if (e.detail && e.detail.setByDiscover) {
                setSearchValue(e.target.value);
            }
        };
        searchInput.addEventListener('input', handler);
        return () => searchInput.removeEventListener('input', handler);
    }, []);

    const handleMediaTypeChange = (e) => {
        setMediaType(e.target.value);
        localStorage.setItem('flixFinderMediaType', e.target.value);
        // Do not trigger search when changing dropdown
    };

    // Handler for Watchlist button
    const handleWatchlistClick = () => {
        // Navigate to results page and set a query param to open watchlist
        if (typeof window !== 'undefined' && window.location) {
            window.location.assign('/search?watchlist=1');
        }
    };
    return (
        <div id="search-bar" className="search-bar-large">
            <div id='search-div' className='search-div-large' style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
                <input id="search" type="text" placeholder="Enter a title..." value={searchValue} onChange={handleInputChange} onKeyDown={handleKeyDown} style={{ flex: 1, paddingRight: '2.5rem' }} />
                <button
                    className='search-bar-icon-button'
                    id="search-button"
                    onClick={handleSearch}
                    style={{ position: 'absolute', right: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', height: '2.2rem', width: '2.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                    aria-label="Search"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </button>
            </div>
            <div id='search-buttons-div' className='search-buttons-div-large' style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <button className='search-bar-elements top-bar' id="trending-button" onClick={handleTrending}>Trending</button>
                <Discover mediaType={mediaType} discoverSelectPreview={props.discoverSelectPreview}/>
                <select className='search-bar-elements bottom-bar' id='media-type' value={mediaType} onChange={handleMediaTypeChange}>
                    <option>Movie</option>
                    <option>TV</option>
                </select>
            </div>
            {props.showWatchlistButton && (
                <button
                    className="search-bar-elements watchlist-bar"
                    style={{ width: '100%', margin: '0 auto 0.5rem auto', padding: '0.8rem', fontSize: '1.1rem', fontWeight: 600, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}
                    onClick={handleWatchlistClick}
                >
                    View Watchlist
                </button>
            )}
        </div>
    )
}
function MediaType() {
    const [mediaType, setMediaType] = React.useState(() => {
        return localStorage.getItem('flixFinderMediaType') || 'Movie';
    });

    React.useEffect(() => {
        const select = document.getElementById('media-type');
        if (select) select.value = mediaType;
    }, [mediaType]);

    // Find the search input and trigger search if Enter is pressed after changing dropdown
    React.useEffect(() => {
        const input = document.getElementById('search');
        if (!input) return;
        const handler = (event) => {
            if (event.key === 'Enter') {
                input.blur(); // force onChange to fire for dropdown
            }
        };
        input.addEventListener('keydown', handler);
        return () => input.removeEventListener('keydown', handler);
    }, []);

    const handleChange = (e) => {
        setMediaType(e.target.value);
        localStorage.setItem('flixFinderMediaType', e.target.value);
        // Do not trigger search immediately when changing dropdown
    };

    return (
        <select className='search-bar-elements bottom-bar' id='media-type' value={mediaType} onChange={handleChange}>
            <option>Movie</option>
            <option>TV</option>
            <option>Both</option>
        </select>
    );
}
function Discover(props) {
    // Custom handler to update search input and trigger search
    const handleDiscoverChange = (e) => {
        const genre = e.target.value;
        console.log('[Discover Dropdown] Selected genre:', genre);
        // Set the search bar value
        const searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.value = `Discover: ${genre}`;
            console.log('[Discover Dropdown] Set search input value:', searchInput.value);
        }
        // Get media type
        const mediaType = document.getElementById('media-type')?.value || 'Movie';
        console.log('[Discover Dropdown] Media type:', mediaType);
        // Call the search handler directly with the correct value and media type
        if (typeof window.triggerSearchFromDiscover === 'function') {
            console.log('[Discover Dropdown] Calling triggerSearchFromDiscover with:', `Discover: ${genre}`, mediaType);
            window.triggerSearchFromDiscover(`Discover: ${genre}`, mediaType);
        } else {
            // fallback: click the search button
            setTimeout(() => {
                const searchBtn = document.getElementById('search-button');
                if (searchBtn) {
                    console.log('[Discover Dropdown] Fallback: clicking search button');
                    searchBtn.click();
                }
            }, 0);
        }
    };
    // Movie and TV genres (alphabetical)
    const movieGenres = [
        'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'TV Movie', 'War', 'Western'
    ];
    const tvGenres = [
        'Action & Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Kids', 'Mystery', 'News', 'Reality', 'Sci-Fi & Fantasy', 'Soap', 'Talk', 'War & Politics', 'Western'
    ];
    const genres = props.mediaType === 'TV' ? tvGenres : movieGenres;
    const sortedGenres = [...genres].sort();
    return (
        <select className='search-bar-elements top-bar' id='discover-button' onChange={handleDiscoverChange}>
            <option id='discover-option'>Discover</option>
            {sortedGenres.map((genre) => (
                <option key={genre}>{genre}</option>
            ))}
        </select>
    );
}
function Tagline() {
    return (
        <div id="movie-display">
            <h2>Search over one million titles</h2>
            <img src='https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_1-8ba2ac31f354005783fab473602c34c3f4fd207150182061e425d366e4f34596.svg' alt='The Movie Database logo'></img>
        </div>
    )
}