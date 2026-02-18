import React from 'react';

// forward and backward buttons to display individual pages of 20 movies at a time on screen
function SeeMore(props) {
    const pageSize = 20;
    function goNext() {
        props.setNextPage(props.nextPage + (pageSize / 20));
        document.getElementById("search-bar").scrollIntoView({
            behavior: "smooth",
        });
    }
    function goPrevious() {
        if (props.data && props.page !== 1) {
            props.setNextPage(props.nextPage - (pageSize / 20));
            props.setPage(props.nextPage - (pageSize / 20));
            document.getElementById("search-bar").scrollIntoView({
                behavior: "smooth",
            });
        }
    }
    if (props.page === 2 && (props.data && props.data.length < pageSize)) {
        return; 
    } else if (props.data && props.page === 2) {
        return (
            <div id='center-more-data'>
                <div id="more-data-buttons-next">
                    <button id="next" onClick={goNext}>{`Page ${props.page} >`}</button>
                </div>
            </div>
        )
    } else if (props.data && props.data !== '' && props.data.length < pageSize) {
        return (
            <div id='center-more-data'>
                <div id="more-data-buttons">
                    <button id="previous" onClick={goPrevious}>{`< Page ${props.page - 2}`}</button>
                </div>
            </div>
        )
    } else if (props.data && props.data !== '') {
        return (
            <div id='center-more-data'>
                <div id="more-data-buttons">
                    <button id="previous" onClick={goPrevious}>{`< Page ${props.page - 2}`}</button>
                    <button id="next" onClick={goNext}>{`Page ${props.page} >`}</button>
                </div>
            </div>
        );
    }
}

export default SeeMore;