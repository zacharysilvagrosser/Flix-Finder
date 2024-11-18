import React from 'react';

// forward and backward buttons to display individual pages of 20 movies at a time on screen
function SeeMore(props) {
    function goNext() {
        props.setPage(props.page + 1);
    }
    function goPrevious() {
        if (props.data && props.page !== 1) {
            props.setPage(props.page - 1);
            document.getElementById("search-bar").scrollIntoView({
                behavior: "smooth",
              });
        }
    }
    const renderNumber = document.getElementById('render-data-option');
    if (props.page === 1 && (props.data && props.data.length < 20)) {
        return; 
    } else if (props.page === (1 * renderNumber.value / 20) && (props.data)) {
        return (
            <div id="more-data-buttons">
                <button id="next" onClick={goNext}>{'>>'}</button>
                </div>
        )
    } else if (props.page !== 1 && (props.data && props.data.length !== 20)) {
        return (
            <div id="more-data-buttons">
                <button id="previous" onClick={goPrevious}>{'<<'}</button>
                </div>
        )
    } else {
        return (
            <div id="more-data-buttons">
                <button id="previous" onClick={goPrevious}>{'<<'}</button>
                <button id="next" onClick={goNext}>{'>>'}</button>
            </div>
        );
    }
}

export default SeeMore;