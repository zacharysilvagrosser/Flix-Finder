import React, { useRef } from 'react';

// Filter buttons on top of movie display that sort movies by categories
function SortingButtons(props) {
    // sorting functions for sorting movies by different parameters
    let sortedMovies;
    if (props.data) {
        function sortMovies(reference) {
            document.querySelectorAll(".sorting-buttons").forEach(button => {
                button.classList.remove("active-button");
            });
            reference.classList.add("active-button");
        }
        const sortPopularity = () => {
            if (!document.getElementById('popularity-button').classList.contains('active-button')) {
                sortedMovies = [...props.data].sort((a, b) => b.popularity - a.popularity);
                props.setData(sortedMovies);
                props.setSorted('popularity');
                sortMovies(document.getElementById('popularity-button'));
            }
        }
        const sortRating = () => {
            if (!document.getElementById('rating-button').classList.contains('active-button')) {
                sortedMovies = [...props.data].sort((a, b) => b.vote_average - a.vote_average);
                props.setData(sortedMovies);
                props.setSorted('rating');
                sortMovies(document.getElementById('rating-button'));
            }
        }
        const sortDatesOld = () => {
            if (!document.getElementById('oldest-button').classList.contains('active-button')) {
                sortedMovies = [...props.data].sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
                props.setData(sortedMovies);
                props.setSorted('oldest');
                sortMovies(document.getElementById('oldest-button'));
            }
        }
        const sortDatesNew = () => {
            if (!document.getElementById('newest-button').classList.contains('active-button')) {
                sortedMovies = [...props.data].sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
                props.setData(sortedMovies);
                props.setSorted('newest');
                sortMovies(document.getElementById('newest-button'));
            }
        }
        return (
            <>
                <button id="popularity-button" className="sorting-buttons active-button" autoFocus onClick={sortPopularity}>Popularity</button>
                <button id="rating-button" className="sorting-buttons" onClick={sortRating}>Rating</button>
                <button id="oldest-button" className="sorting-buttons" onClick={sortDatesOld}>Oldest</button>
                <button id="newest-button" className="sorting-buttons" onClick={sortDatesNew}>Newest</button>
            </>
        );
    }
}
export default SortingButtons;