import React from 'react';

// forward and backward buttons to display individual pages of 20 movies at a time on screen
function SeeMore(props) {
    function goNext() {
        // reset render number to what was originally searched until a new search occurs
        document.getElementById('render-data-option').value = props.renderAmount;
        props.setNextPage(props.nextPage + (props.renderAmount / 20));
        document.getElementById("search-bar").scrollIntoView({
            behavior: "smooth",
        });
    }
    function goPrevious() {
        if (props.data && props.page !== 1) {
                // reset render number to what was originally searched until a new search occur
            document.getElementById('render-data-option').value = props.renderAmount;
            props.setNextPage(props.nextPage - (document.getElementById('render-data-option').value / 20));
            props.setPage(props.nextPage - (document.getElementById('render-data-option').value / 20));
            document.getElementById("search-bar").scrollIntoView({
                behavior: "smooth",
            });
        }
    }
    if (props.page === 2 && (props.data && props.data.length < document.getElementById('render-data-option').value)) {
        return; 
    } else if (props.data && props.page === 2) {
        return (
            <div id='center-more-data'>
                <div id="more-data-buttons-next">
                    <button id="next" onClick={goNext}>{`Page ${props.page} >`}</button>
                </div>
            </div>
        )
    } else if (props.data && props.data !== '' && props.data.length < document.getElementById('render-data-option').value) {
        console.log('props.data.length: ', props.data.length, 'document.getElementByIdvalue: ', document.getElementById('render-data-option').value);
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