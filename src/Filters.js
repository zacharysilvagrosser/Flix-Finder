import React, { useState } from 'react';

function Filters(props) {
    const [activeSection, setActiveSection] = useState('');
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

    const toggleSection = (section) => {
        setActiveSection((current) => (current === section ? '' : section));
    };
    const closePanel = () => {
        setActiveSection('');
    };
    return (
        <div id='filters'>
            <div className='filter-group'>
                <div className='filter-label'>Filter by</div>
                <div className='filter-buttons'>
                    <button className={`filter-button ${activeSection === 'date' ? 'active-filter' : ''}`} onClick={() => toggleSection('date')}>Date</button>
                    <button className={`filter-button ${activeSection === 'rating' ? 'active-filter' : ''}`} onClick={() => toggleSection('rating')}>Rating</button>
                    <button className={`filter-button ${activeSection === 'adult' ? 'active-filter' : ''}`} onClick={() => toggleSection('adult')}>Adult</button>
                </div>
            </div>
            {activeSection && (
                <div className='filter-modal-overlay' onClick={closePanel}>
                    <div className='filter-modal' role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
                        <div className='filter-modal-header'>
                            <div className='filter-modal-title'>
                                {activeSection === 'date' && 'Filter by Date'}
                                {activeSection === 'rating' && 'Filter by Rating'}
                                {activeSection === 'adult' && 'Filter by Adult'}
                            </div>
                            <button className='filter-modal-close' onClick={closePanel} aria-label="Close filters">
                                ×
                            </button>
                        </div>
                        <div className='filter-modal-body'>
                            {activeSection === 'date' && (
                                <FilterDates check60s={check60s} check70s={check70s} check80s={check80s} check90s={check90s} check00s={check00s} check10s={check10s} check20s={check20s}/>
                            )}
                            {activeSection === 'rating' && (
                                <FilterRatings check5={check5} check6={check6} check7={check7} check8={check8}/>
                            )}
                            {activeSection === 'adult' && (
                                <FilterAdult checkAdult={checkAdult}/>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
function FilterDates(props) {
    return (
        <div className="filter-section">
            <h3>Release Date</h3>
            <div className="filter-type">
                <label htmlFor='60'>60's and earlier</label>
                <input id='60' type="checkbox" defaultChecked onChange={props.check60s}></input>
            </div>
            <div className="filter-type">
                <label htmlFor='70'>70's</label>
                <input id='70' type="checkbox" defaultChecked onChange={props.check70s}></input>
            </div>
            <div className="filter-type">
                <label htmlFor='80'>80's</label>
                <input id='80' type="checkbox" defaultChecked onChange={props.check80s}></input>
            </div>
            <div className="filter-type">
                <label htmlFor='90'>90's</label>
                <input id='90' type="checkbox" defaultChecked onChange={props.check90s}></input>
            </div>
            <div className="filter-type">
                <label htmlFor='00'>00's</label>
                <input id='00' type="checkbox" defaultChecked onChange={props.check00s}></input>
            </div>
            <div className="filter-type">
                <label htmlFor='10'>10's</label>
                <input id='10' type="checkbox" defaultChecked onChange={props.check10s}></input>
            </div>
            <div className="filter-type">
                <label htmlFor='20'>20's and later</label>
                <input id='20' type="checkbox" defaultChecked onChange={props.check20s}></input>
            </div>
        </div>
    )
}
function FilterRatings(props) {
    return (
        <div className="filter-section">
            <h3>Rating</h3>
            <div className="filter-type">
                <label htmlFor='5'>5 and under</label>
                <input id='5' type="checkbox" defaultChecked onChange={props.check5}></input>
            </div>
            <div className="filter-type">
                <label htmlFor='6'>6</label>
                <input id='6' type="checkbox" defaultChecked onChange={props.check6}></input>
            </div>
            <div className="filter-type">
                <label htmlFor='7'>7</label>
                <input id='7' type="checkbox" defaultChecked onChange={props.check7}></input>
            </div>
            <div className="filter-type">
                <label htmlFor='8'>8 and over</label>
                <input id='8' type="checkbox" defaultChecked onChange={props.check8}></input>
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
                <input id='adult' type="checkbox" onChange={props.checkAdult}></input>
            </div>
        </div>
    )
}

export default Filters;