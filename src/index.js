import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import React, { useState } from 'react';

const root = ReactDOM.createRoot(document.getElementById('root'));

/*function changeDisplay() {

}*/
function StartScreen() {
    const [showApp, setShowApp] = useState(false);
    const searchBarClick = () => {
        setShowApp(true);
    }; //setshowapp only runs app once so wont update search
    const trendingBarClick = () => {
        document.getElementById("search").value = "trending";
        setShowApp(true);
    };
    const searchBarEnter = (event) => {
        if (event.key === 'Enter') {
            setShowApp(true);
        }
    }
    return (
        <div id="container">
            <h1 id="page-header">Flix Finder</h1>
            {<SearchBar searchBarClick={searchBarClick} searchBarEnter={searchBarEnter} trendingBarClick={trendingBarClick}/>}
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
            <input id="search" type="text" placeholder="Enter a movie title..." onKeyDown={props.searchBarEnter}></input>
            <button id="search-button" onClick={props.searchBarClick}>Search</button>
            <button id="trending-button" onClick={props.trendingBarClick}>Trending</button>
        </div>
    )
}
function Tagline() {
    return (
        <div id="movie-display">
            <h2>Search over one million movies</h2>
        </div>
    )
}
/*window.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        //changeDisplay();
        root.render (
            <React.StrictMode>
                <App/>
            </React.StrictMode>
        );
    }
});
document.getElementById("search-button").addEventListener("click", () => {
    //changeDisplay();
    root.render (
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    );
});
document.getElementById("trending-button").addEventListener("click", () => {
    //document.getElementById("search").value = 'trending';
    //changeDisplay();
    root.render (
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    );
});*/
reportWebVitals();