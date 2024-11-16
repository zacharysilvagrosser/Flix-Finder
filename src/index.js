import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import React, { useState } from 'react';

const root = ReactDOM.createRoot(document.getElementById('root'));

function StartScreen() {
    const [showApp, setShowApp] = useState(false);
    const searchBarClick = () => {
        setShowApp(true);
    };
    const trendingBarClick = () => {
        document.getElementById("search").value = "Trending";
        setShowApp(true);
    };
    const searchBarEnter = (event) => {
        if (event.key === 'Enter') {
            setShowApp(true);
        }
    }
    const discoverSelectChange = () => {
        document.getElementById("search").value = `Discover: ${document.getElementById('discover-button').value}`;
        setShowApp(true);
    };
    return (
        <div id="container">
            <h1 id="page-header">Flix Finder</h1>
            {<SearchBar searchBarClick={searchBarClick} searchBarEnter={searchBarEnter} trendingBarClick={trendingBarClick} discoverSelectChange={discoverSelectChange}/>}
            {!showApp && <Tagline />}
            {showApp && <App />}
        </div>
    );
}
root.render (
    <StartScreen />
)
function SearchBar(props) {
    return (
        <div id="search-bar" className="search-bar-large">
            <div id='search-div'>
                <input id="search" type="text" placeholder="Enter a movie title..." onKeyDown={props.searchBarEnter}></input>
            </div>
            <div id='search-buttons-div'>
                <button className='search-bar-elements' id="search-button" onClick={props.searchBarClick}>Search</button>
                <button className='search-bar-elements' id="trending-button" onClick={props.trendingBarClick}>Trending</button>
                <Discover discoverSelectChange={props.discoverSelectChange}/>
                <RenderMovies />
            </div>
        </div>
    )
}
function RenderMovies() {
    return (
        <select className='search-bar-elements' id='render-data-option'>
            <option># of results</option>
            <option>20</option>
            <option>40</option>
            <option>60</option>
            <option>80</option>
            <option>100</option>
            <option>200</option>
            <option>300</option>
            <option>400</option>
            <option>500</option>
        </select>
    )
}
function Discover(props) {
    return (
        <select className='search-bar-elements' id='discover-button' onChange={props.discoverSelectChange}>
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
        </div>
    )
}