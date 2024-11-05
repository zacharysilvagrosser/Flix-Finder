import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

function changeDisplay() {
    document.getElementById("movie-display").style.visibility = "hidden";
    document.getElementById("search-bar").classList.remove("search-bar-large");
    document.getElementById("search-bar").classList.add("search-bar-small");
    document.getElementById("trending-button").style.visibility = "collapse";
    document.getElementById("page-header").style.margin = "8rem 0 4rem 0";
}

window.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        changeDisplay();
        root.render (
            <React.StrictMode>
                <App/>
            </React.StrictMode>
        );
    }
});
document.getElementById("search-button").addEventListener("click", () => {
    changeDisplay();
    root.render (
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    );
});
document.getElementById("trending-button").addEventListener("click", () => {
    document.getElementById("search").value = 'trending';
    changeDisplay();
    root.render (
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    );
});
reportWebVitals();