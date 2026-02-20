import React, { useState } from 'react';

function Filters(props) {
    const [activeSection, setActiveSection] = useState('');
    const genres = [
        { id: 28, name: 'Action' },
        { id: 12, name: 'Adventure' },
        { id: 16, name: 'Animation' },
        { id: 35, name: 'Comedy' },
        { id: 80, name: 'Crime' },
        { id: 99, name: 'Documentary' },
        { id: 18, name: 'Drama' },
        { id: 10751, name: 'Family' },
        { id: 14, name: 'Fantasy' },
        { id: 36, name: 'History' },
        { id: 27, name: 'Horror' },
        { id: 10402, name: 'Music' },
        { id: 9648, name: 'Mystery' },
        { id: 10749, name: 'Romance' },
        { id: 878, name: 'Science Fiction' },
        { id: 10770, name: 'TV Movie' },
        { id: 53, name: 'Thriller' },
        { id: 10752, name: 'War' },
        { id: 37, name: 'Western' }
    ];
    const check60s = (event) => {
        props.setSixties(event.target.checked);
    };
    const check70s = (event) => {
        props.setSeventies(event.target.checked);
    };
    const check80s = (event) => {
        props.setEighties(event.target.checked);
    };
    const check90s = (event) => {
        props.setNinties(event.target.checked);
    };
    const check00s = (event) => {
        props.setThousands(event.target.checked);
    };
    const check10s = (event) => {
        props.setTens(event.target.checked);
    };
    const check20s = (event) => {
        props.setTwenties(event.target.checked);
    };
    const check5 = (event) => {
        props.setRate5(event.target.checked);
    };
    const check6 = (event) => {
        props.setRate6(event.target.checked);
    };
    const check7 = (event) => {
        props.setRate7(event.target.checked);
    };
    const check8 = (event) => {
        props.setRate8(event.target.checked);
    };
    const checkAdult = (event) => {
        props.setIsAdult(event.target.checked);
    };
    const toggleGenre = (genreId) => {
        props.setSelectedGenres((current) => {
            if (current.includes(genreId)) {
                return current.filter((id) => id !== genreId);
            }
            return [...current, genreId];
        });
    };

    const toggleSection = (section) => {
        setActiveSection((current) => (current === section ? '' : section));
    };
    const closePanel = () => {
        setActiveSection('');
    };
    return (
        <div className='sorting-group control-group' id='filters'>
            <div className='sorting-label control-label'>Filter by</div>
            <div id='sorting-buttons-div' className='control-buttons'>
                <button className={`sorting-buttons filter-button control-button ${activeSection === 'date' ? 'active-filter active' : ''}`} onClick={() => toggleSection('date')}>Date</button>
                <button className={`sorting-buttons filter-button control-button ${activeSection === 'genre' ? 'active-filter active' : ''}`} onClick={() => toggleSection('genre')}>Genre</button>
                <button className={`sorting-buttons filter-button control-button ${activeSection === 'rating' ? 'active-filter active' : ''}`} onClick={() => toggleSection('rating')}>Rating</button>
                <button className={`sorting-buttons filter-button control-button ${activeSection === 'adult' ? 'active-filter active' : ''}`} onClick={() => toggleSection('adult')}>Adult</button>
            </div>
            {activeSection && (
                <div className='filter-modal-overlay' onClick={closePanel}>
                    <div className='filter-modal' role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
                        <div className='filter-modal-header'>
                            <div className='filter-modal-title'>
                                {activeSection === 'date' && 'Filter by Date'}
                                {activeSection === 'genre' && 'Filter by Genre'}
                                {activeSection === 'rating' && 'Filter by Rating'}
                                {activeSection === 'adult' && 'Filter by Adult'}
                            </div>
                            <button className='filter-modal-close' onClick={closePanel} aria-label="Close filters">
                                ×
                            </button>
                        </div>
                        <div className='filter-modal-body'>
                            {activeSection === 'date' && (
                                <FilterDates
                                    sixties={props.sixties}
                                    seventies={props.seventies}
                                    eighties={props.eighties}
                                    ninties={props.ninties}
                                    thousands={props.thousands}
                                    tens={props.tens}
                                    twenties={props.twenties}
                                    setSixties={props.setSixties}
                                    setSeventies={props.setSeventies}
                                    setEighties={props.setEighties}
                                    setNinties={props.setNinties}
                                    setThousands={props.setThousands}
                                    setTens={props.setTens}
                                    setTwenties={props.setTwenties}
                                    check60s={check60s}
                                    check70s={check70s}
                                    check80s={check80s}
                                    check90s={check90s}
                                    check00s={check00s}
                                    check10s={check10s}
                                    check20s={check20s}
                                />
                            )}
                            {activeSection === 'genre' && (
                                <FilterGenres genres={genres} selectedGenres={props.selectedGenres} toggleGenre={toggleGenre} setSelectedGenres={props.setSelectedGenres}/>
                            )}
                            {activeSection === 'rating' && (
                                <FilterRatings
                                    rate5={props.rate5}
                                    rate6={props.rate6}
                                    rate7={props.rate7}
                                    rate8={props.rate8}
                                    check5={check5}
                                    check6={check6}
                                    check7={check7}
                                    check8={check8}
                                    setRate5={props.setRate5}
                                    setRate6={props.setRate6}
                                    setRate7={props.setRate7}
                                    setRate8={props.setRate8}
                                />
                            )}
                            {activeSection === 'adult' && (
                                <FilterAdult isAdult={props.isAdult} checkAdult={checkAdult} />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
function FilterDates(props) {
    const handleSelectAll = () => {
        props.setSixties(true);
        props.setSeventies(true);
        props.setEighties(true);
        props.setNinties(true);
        props.setThousands(true);
        props.setTens(true);
        props.setTwenties(true);
    };
    const handleUnselectAll = () => {
        props.setSixties(false);
        props.setSeventies(false);
        props.setEighties(false);
        props.setNinties(false);
        props.setThousands(false);
        props.setTens(false);
        props.setTwenties(false);
    };
    return (
        <div className="filter-section">
            <h3>Release Date</h3>
            <div className="filter-type">
                <label htmlFor='60'>60's and earlier</label>
                <input id='60' type="checkbox" checked={props.sixties} onChange={props.check60s} />
            </div>
            <div className="filter-type">
                <label htmlFor='70'>70's</label>
                <input id='70' type="checkbox" checked={props.seventies} onChange={props.check70s} />
            </div>
            <div className="filter-type">
                <label htmlFor='80'>80's</label>
                <input id='80' type="checkbox" checked={props.eighties} onChange={props.check80s} />
            </div>
            <div className="filter-type">
                <label htmlFor='90'>90's</label>
                <input id='90' type="checkbox" checked={props.ninties} onChange={props.check90s} />
            </div>
            <div className="filter-type">
                <label htmlFor='00'>00's</label>
                <input id='00' type="checkbox" checked={props.thousands} onChange={props.check00s} />
            </div>
            <div className="filter-type">
                <label htmlFor='10'>10's</label>
                <input id='10' type="checkbox" checked={props.tens} onChange={props.check10s} />
            </div>
            <div className="filter-type">
                <label htmlFor='20'>20's and later</label>
                <input id='20' type="checkbox" checked={props.twenties} onChange={props.check20s} />
            </div>
            <div style={{ display: 'flex', gap: '0.7rem', marginTop: '0.7rem', justifyContent: 'center' }}>
                <button type="button" className="control-button" style={{ minWidth: 0, padding: '0.3rem 1.1rem', fontSize: '0.97rem' }} onClick={handleSelectAll}>Select All</button>
                <button type="button" className="control-button" style={{ minWidth: 0, padding: '0.3rem 1.1rem', fontSize: '0.97rem' }} onClick={handleUnselectAll}>Unselect All</button>
            </div>
        </div>
    )
}
function FilterRatings(props) {
    const handleSelectAll = () => {
        props.setRate5(true);
        props.setRate6(true);
        props.setRate7(true);
        props.setRate8(true);
    };
    const handleUnselectAll = () => {
        props.setRate5(false);
        props.setRate6(false);
        props.setRate7(false);
        props.setRate8(false);
    };
    return (
        <div className="filter-section">
            <h3>Rating</h3>
            <div className="filter-type">
                <label htmlFor='5'>5 and under</label>
                <input id='5' type="checkbox" checked={props.rate5} onChange={props.check5} />
            </div>
            <div className="filter-type">
                <label htmlFor='6'>6</label>
                <input id='6' type="checkbox" checked={props.rate6} onChange={props.check6} />
            </div>
            <div className="filter-type">
                <label htmlFor='7'>7</label>
                <input id='7' type="checkbox" checked={props.rate7} onChange={props.check7} />
            </div>
            <div className="filter-type">
                <label htmlFor='8'>8 and over</label>
                <input id='8' type="checkbox" checked={props.rate8} onChange={props.check8} />
            </div>
            <div style={{ display: 'flex', gap: '0.7rem', marginTop: '0.7rem', justifyContent: 'center' }}>
                <button type="button" className="control-button" style={{ minWidth: 0, padding: '0.3rem 1.1rem', fontSize: '0.97rem' }} onClick={handleSelectAll}>Select All</button>
                <button type="button" className="control-button" style={{ minWidth: 0, padding: '0.3rem 1.1rem', fontSize: '0.97rem' }} onClick={handleUnselectAll}>Unselect All</button>
            </div>
        </div>
    )
}
function FilterAdult(props) {
    return (
        <div className="filter-section">
            <h3>Adult Films</h3>
            <div className="filter-type">
                <label htmlFor='adult'>Show adult titles</label>
                <input id='adult' type="checkbox" checked={props.isAdult} onChange={props.checkAdult} />
            </div>
        </div>
    )
}

function FilterGenres(props) {
    const allGenreIDs = props.genres.map(g => g.id);
    const handleSelectAll = () => props.setSelectedGenres && props.setSelectedGenres(allGenreIDs);
    const handleUnselectAll = () => props.setSelectedGenres && props.setSelectedGenres([]);
    return (
        <div className="filter-section">
            <h3>Genre</h3>
            {props.genres.map((genre) => (
                <div className="filter-type" key={genre.id}>
                    <label htmlFor={`genre-${genre.id}`}>{genre.name}</label>
                    <input
                        id={`genre-${genre.id}`}
                        type="checkbox"
                        checked={props.selectedGenres.includes(genre.id)}
                        onChange={() => props.toggleGenre(genre.id)}
                    />
                </div>
            ))}
            <div style={{ display: 'flex', gap: '0.7rem', marginTop: '0.7rem', justifyContent: 'center' }}>
                <button type="button" className="control-button" style={{ minWidth: 0, padding: '0.3rem 1.1rem', fontSize: '0.97rem' }} onClick={handleSelectAll}>Select All</button>
                <button type="button" className="control-button" style={{ minWidth: 0, padding: '0.3rem 1.1rem', fontSize: '0.97rem' }} onClick={handleUnselectAll}>Unselect All</button>
            </div>
        </div>
    );
}

export default Filters;