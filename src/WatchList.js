import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

// Watch list button on movieinfo component
function WatchList(props) {
    const [showChooseList, setShowChooseList] = useState(false);
    // Instead of using a ref, expect a prop: posterRect
    const posterRect = props.posterRect;
    const modalStyle = posterRect && showChooseList ? {
        position: 'fixed',
        top: posterRect.top + posterRect.height / 2,
        left: posterRect.left + posterRect.width / 2,
        transform: 'translate(-50%, -50%)',
        zIndex: 2101,
        background: 'rgba(18, 22, 30, 0.97)',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(24,58,90,0.18)',
        minWidth: 320,
        maxWidth: 400,
        padding: '2.2rem 2.2rem 1.5rem 2.2rem',
        color: 'var(--text, #fff)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    } : { display: 'none' };
    const overlayStyle = showChooseList ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(10, 14, 20, 0.65)',
        zIndex: 2100,
    } : { display: 'none' };

    // Helper: check if item is in a given list
    function isItemInList(list, item) {
        return list.movies.some((movie) =>
            (movie.title && movie.title === (item.title || item.name)) ||
            (movie.name && movie.name === (item.title || item.name))
        );
    }

    // Add item to a specific list (by index)
    function addToList(idx) {
        if (!isItemInList(props.watchLists[idx], props.item)) {
            const newLists = props.watchLists.map((wl, i) =>
                i === idx ? { ...wl, movies: [...wl.movies, props.item] } : wl
            );
            props.setWatchLists(newLists);
        }
        setShowChooseList(false);
    }

    // Remove item from the selected list
    function removeFromList() {
        const idx = props.selectedWatchList;
        const newLists = props.watchLists.map((wl, i) =>
            i === idx ? { ...wl, movies: wl.movies.filter((movie) =>
                !(
                    (movie.title && movie.title === (props.item.title || props.item.name)) ||
                    (movie.name && movie.name === (props.item.title || props.item.name))
                )
            ) } : wl
        );
        props.setWatchLists(newLists);
    }

    // Is this item in the selected list?
    const listed = isItemInList(props.watchLists[props.selectedWatchList], props.item);

    // Add button logic
    function handleAdd() {
        if (props.watchLists.length === 1) {
            addToList(0);
        } else {
            if (props.onShowModal) props.onShowModal();
            setShowChooseList(true);
        }
    }

    // Render choose list modal if needed
    if (showChooseList && posterRect) {
        return ReactDOM.createPortal(
            <>
                <div style={overlayStyle} onClick={() => setShowChooseList(false)} />
                <div style={modalStyle} onClick={e => e.stopPropagation()}>
                    <button className="auth-close" style={{top: 12, right: 12, position: 'absolute', color: 'var(--text, #fff)', fontSize: 24, background: 'none', border: 'none', cursor: 'pointer'}} onClick={() => setShowChooseList(false)}>&times;</button>
                    <h2 style={{marginBottom: 18, fontWeight: 700, fontSize: '1.25rem', textAlign: 'center'}}>Add to Watch List</h2>
                    <div style={{marginBottom: 18, color: 'var(--text, #fff)', fontSize: '1.08rem', textAlign: 'center'}}>Select a watch list to add this item:</div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 12, width: '100%'}}>
                        {props.watchLists.map((wl, idx) => (
                            <button
                                key={wl.name + idx}
                                onClick={() => addToList(idx)}
                                disabled={isItemInList(wl, props.item)}
                                style={{
                                    background: isItemInList(wl, props.item) ? '#2a3342' : 'var(--accent, #1976d2)',
                                    color: isItemInList(wl, props.item) ? '#888' : '#fff',
                                    border: 'none',
                                    borderRadius: 8,
                                    padding: '0.7rem 1.2rem',
                                    fontWeight: 600,
                                    fontSize: '1.08rem',
                                    cursor: isItemInList(wl, props.item) ? 'not-allowed' : 'pointer',
                                    marginBottom: 0,
                                    transition: 'background 0.2s, color 0.2s',
                                    boxShadow: isItemInList(wl, props.item) ? 'none' : '0 2px 8px rgba(24,58,90,0.10)'
                                }}
                            >
                                {wl.name} {isItemInList(wl, props.item) ? '✓' : ''}
                            </button>
                        ))}
                    </div>
                </div>
            </>,
            document.body
        );
    }

    // Determine if this is a TV show for styling
    const isTV = !!props.item.first_air_date;
    const tvClass = isTV ? 'tv-show' : '';

    if (listed) {
        return (
            <div className="watchlist-plus">
                <button className={`watchlist-plus-button ${tvClass}`} onClick={removeFromList} title="Remove from Watchlist">&#8722;</button>
            </div>
        );
    } else {
        return (
            <div className="watchlist-plus">
                <button className={`watchlist-plus-button ${tvClass}`} onClick={handleAdd} title="Add to Watchlist">&#43;</button>
            </div>
        );
    }
}

export default WatchList;