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
            <SearchBar onSearchNavigate={handleSearchNavigate} discoverSelectPreview={discoverSelectPreview} />
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

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const nextValue = params.get('q') || '';
        const searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.value = nextValue;
        }
        setSearchValue(nextValue);
        setSearchClicked((prev) => !prev);
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
                renderSearchBar={
                    <SearchBar onSearchNavigate={handleSearchNavigate} discoverSelectPreview={discoverSelectPreview} />
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
    const triggerSearch = (valueOverride) => {
        const input = document.getElementById("search");
        if (!input) return;
        if (typeof valueOverride === 'string') {
            input.value = valueOverride;
        }
        props.onSearchNavigate?.(input.value);
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

    return (
        <div id="search-bar" className="search-bar-large">
            <div id='search-div' className='search-div-large'>
                <input id="search" type="text" placeholder="Enter a movie title..." onKeyDown={handleKeyDown}></input>
            </div>
            <div id='search-buttons-div' className='search-buttons-div-large'>
                <button className='search-bar-elements top-bar' id="search-button" onClick={handleSearch}>Search</button>
                <button className='search-bar-elements top-bar' id="trending-button" onClick={handleTrending}>Trending</button>
                <Discover discoverSelectPreview={props.discoverSelectPreview}/>
                <MediaType />
            </div>
        </div>
    )
}
function MediaType() {
    return (
        <select className='search-bar-elements bottom-bar' id='media-type'>
            <option>Movie</option>
            <option>TV</option>
        </select>
    )
}
function Discover(props) {
    return (
        <select className='search-bar-elements top-bar' id='discover-button' onChange={props.discoverSelectPreview}>
            <option id='discover-option'>Discover</option>
            <option>Adventure</option>
            <option>Fantasy</option>
            <option>Animation</option>
            <option>Drama</option>
            <option>Horror</option>
            <option>Action</option>
            <option>Comedy</option>
            <option>History</option>
            <option>Western</option>
            <option>Thriller</option>
            <option>Crime</option>
            <option>Documentary</option>
            <option>Science Fiction</option>
            <option>Mystery</option>
            <option>Music</option>
            <option>Romance</option>
            <option>Family</option>
            <option>War</option>
            <option>TV Movie</option>
        </select>
    )
}
function Tagline() {
    return (
        <div id="movie-display">
            <h2>Search over one million movies</h2>
            <img src='https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_1-8ba2ac31f354005783fab473602c34c3f4fd207150182061e425d366e4f34596.svg' alt='The Movie Database logo'></img>
        </div>
    )
}