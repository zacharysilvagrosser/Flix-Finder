import React from 'react';

// forward and backward buttons to display individual pages of 20 movies at a time on screen
function SeeMore(props) {
    const pageSize = 100;
    // Accept lastApiPageCount as a prop for Next button logic
    function goNext() {
        if (props.data && props.data.length === 100 && props.lastApiPageCount === 20) {
            props.setPage(props.page + 5);
            props.setNextPage(props.nextPage + 5);
            document.getElementById("search-bar").scrollIntoView({
                behavior: "smooth",
            });
        }
    }
    function goPrevious() {
        if (props.data && props.page > 5) {
            props.setPage(props.page - 5);
            props.setNextPage(props.nextPage - 5);
            document.getElementById("search-bar").scrollIntoView({
                behavior: "smooth",
            });
        }
    }
    if (!props.data) return null;
    // Only show Prev if not on first page
    // Only show Next if there are 100 results (could be more pages)
    // User-facing page number: every 5 internal pages (20 results each) = 1 user page (100 results)
    const userPage = Math.ceil(props.page / 5);
    return (
        <div className='pagination'>
            {props.page > 5 && (
                <button className='pagination-button prev' onClick={goPrevious}>
                    <span aria-hidden="true">←</span> Prev
                </button>
            )}
            <div className='pagination-info'>Page {userPage}</div>
            {props.data && props.data.length === 100 && props.lastApiPageCount === 20 && (
                <button className='pagination-button next' onClick={goNext}>
                    Next <span aria-hidden="true">→</span>
                </button>
            )}
        </div>
    );
}

export default SeeMore;