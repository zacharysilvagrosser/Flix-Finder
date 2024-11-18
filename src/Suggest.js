import React from 'react';
import config from './config';

function Suggest(props) {
    const mykey = config.MY_KEY;
    // fetch similar movies from API to display suggested movies to watch
    const suggest = (id) => {
        let allData = [];
        const fetchData = async (pages) => {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=${pages}&api_key=${mykey}`);
            const jsonData = await response.json();
            // collect multiple pages of data to display at once
            jsonData.results.forEach(i => {
                allData.push(i);
            });
            if (document.getElementById('render-data-option').value === '# of results') {
                document.getElementById('render-data-option').value = 20;
            }
            if (pages === document.getElementById('render-data-option').value / 20 || pages == jsonData.total_pages) {
                // Keep data sorted between fetch requests
                switch (props.sorted) {
                    case 'popularity':
                        props.setData(allData.sort((a, b) => b.popularity - a.popularity));
                        props.setSavedData(allData.sort((a, b) => b.popularity - a.popularity));
                        break;
                    case 'rating':
                        props.setData(allData.sort((a, b) => b.vote_average - a.vote_average));
                        props.setSavedData(allData.sort((a, b) => b.vote_average - a.vote_average));
                        break;
                    case 'oldest':
                        props.setData(allData.sort((a, b) => new Date(a.release_date) - new Date(b.release_date)));
                        props.setSavedData(allData.sort((a, b) => new Date(a.release_date) - new Date(b.release_date)));
                        break;
                    case 'newest':
                        props.setData(allData.sort((a, b) => new Date(b.release_date) - new Date(a.release_date)));
                        props.setSavedData(allData.sort((a, b) => new Date(b.release_date) - new Date(a.release_date)));
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
            }
        });
    }
    return <button className='suggestions-button movie-button' onClick={() => suggest(props.item.id)}>Suggest</button>
}

export default Suggest;