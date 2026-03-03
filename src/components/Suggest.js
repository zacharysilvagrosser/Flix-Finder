import React from 'react';

function Suggest(props) {
    const mykey = process.env.REACT_APP_API_KEY;
    // fetch similar movies/shows from API to display suggested titles to watch
    const suggest = async (id) => {
        // Determine media type: TV shows have first_air_date, movies have release_date
        const mediaType = props.item.first_air_date ? 'tv' : 'movie';
        let allData = [];
        let allIDs = [];
        try {
            // Fetch first page to get total_pages
            const firstResponse = await fetch(
                `https://api.themoviedb.org/3/${mediaType}/${id}/similar?language=en-US&page=1&api_key=${mykey}`
            );
            const firstJson = await firstResponse.json();
            if (!firstJson.results) return;
            const totalPages = Math.min(firstJson.total_pages || 1, 5); // cap at 5 pages
            firstJson.results.forEach(i => {
                if (!allIDs.includes(i.id)) {
                    allData.push(i);
                    allIDs.push(i.id);
                }
            });
            // Fetch remaining pages in parallel
            if (totalPages > 1) {
                const pageNumbers = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
                const responses = await Promise.all(
                    pageNumbers.map(p =>
                        fetch(`https://api.themoviedb.org/3/${mediaType}/${id}/similar?language=en-US&page=${p}&api_key=${mykey}`)
                            .then(r => r.json())
                    )
                );
                responses.forEach(json => {
                    if (json.results) {
                        json.results.forEach(i => {
                            if (!allIDs.includes(i.id)) {
                                allData.push(i);
                                allIDs.push(i.id);
                            }
                        });
                    }
                });
            }
            // Sort and set data
            let sorted = [...allData];
            switch (props.sorted) {
                case 'popularity':
                    sorted = sorted.sort((a, b) => b.popularity - a.popularity);
                    break;
                case 'rating':
                    sorted = sorted.sort((a, b) => b.vote_average - a.vote_average);
                    break;
                case 'oldest':
                    sorted = sorted.sort((a, b) => new Date(a.release_date || a.first_air_date) - new Date(b.release_date || b.first_air_date));
                    break;
                case 'newest':
                    sorted = sorted.sort((a, b) => new Date(b.release_date || b.first_air_date) - new Date(a.release_date || a.first_air_date));
                    break;
                default:
                    break;
            }
            props.setData(sorted);
            props.setSavedData(sorted);
        } catch (err) {
            console.error('Suggest fetch error:', err);
        }
    }
    // Allow passing a className for TV styling
    const itemTitle = props.item.title || props.item.name || 'this title';
    return <button className={`suggestions-button movie-button ${props.className || ''}`} onClick={() => suggest(props.item.id)} aria-label={`Suggest similar titles to ${itemTitle}`}>Suggest</button>
}

export default Suggest;