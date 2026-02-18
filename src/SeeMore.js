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
            <div className='pagination'>
                <div className='pagination-info'>Page 1</div>
                <button className='pagination-button next' onClick={goNext}>
                    Next <span aria-hidden="true">→</span>
                </button>
            </div>
        )
    } else if (props.data && props.data !== '' && props.data.length < pageSize) {
        return (
            <div className='pagination'>
                <button className='pagination-button prev' onClick={goPrevious}>
                    <span aria-hidden="true">←</span> Prev
                </button>
                <div className='pagination-info'>Page {Math.max(props.page - 2, 1)}</div>
            </div>
        )
    } else if (props.data && props.data !== '') {
        return (
            <div className='pagination'>
                <button className='pagination-button prev' onClick={goPrevious}>
                    <span aria-hidden="true">←</span> Prev
                </button>
                <div className='pagination-info'>Page {Math.max(props.page - 1, 1)}</div>
                <button className='pagination-button next' onClick={goNext}>
                    Next <span aria-hidden="true">→</span>
                </button>
            </div>
        );
    }
}

export default SeeMore;