import React from 'react';

// forward and backward buttons to display individual pages of 20 movies at a time on screen
function SeeMore(props) {
    function goNext() {
        console.log('nextpage', props.nextPage + (document.getElementById('render-data-option').value / 20));
        props.setNextPage(props.nextPage + (document.getElementById('render-data-option').value / 20));
        document.getElementById("search-bar").scrollIntoView({
            behavior: "smooth",
        });
    }
    function goPrevious() {
        if (props.data && props.page !== 1) {
            props.setNextPage(props.nextPage - (document.getElementById('render-data-option').value / 20));
            props.setPage(props.nextPage - (document.getElementById('render-data-option').value / 20));
            document.getElementById("search-bar").scrollIntoView({
                behavior: "smooth",
            });
        }
    }
    if (props.page === 1 && (props.data && props.data.length < 20)) {
        return; 
    } else if (props.page == 2 && (props.data)) {
        return (
            <div id="more-data-buttons">
                <button id="next" onClick={goNext}>{`Page ${props.page} >`}</button>
            </div>
        )
    } else if ((props.data && props.data.length !== 20)) {
        return (
            <div id="more-data-buttons">
                <button id="previous" onClick={goPrevious}>{`< Page ${props.page - 2}`}</button>
            </div>
        )
    } else if (props.data) {
        return (
            <div id="more-data-buttons">
                <button id="previous" onClick={goPrevious}>{`< Page ${props.page - 2}`}</button>
                <button id="next" onClick={goNext}>{`Page ${props.page} >`}</button>
            </div>
        );
    }
}

export default SeeMore;