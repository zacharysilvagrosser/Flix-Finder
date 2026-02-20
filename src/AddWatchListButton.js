import React, { useState } from 'react';
import './Auth.css';

function AddWatchListButton({ onAdd }) {
    const [showModal, setShowModal] = useState(false);
    const [listName, setListName] = useState('');
    const [error, setError] = useState('');

    const handleAddClick = () => {
        setShowModal(true);
    };
    const handleInputChange = (e) => {
        setListName(e.target.value);
        setError('');
    };
    const handleModalClose = () => {
        setShowModal(false);
        setListName('');
        setError('');
    };
    const handleModalSubmit = (e) => {
        e.preventDefault();
        if (listName.trim()) {
            onAdd(listName.trim());
            setShowModal(false);
            setListName('');
            setError('');
        } else {
            setError('Please enter a list name.');
        }
    };
    const handleInputKeyDown = (e) => {
        if (e.key === 'Escape') {
            handleModalClose();
        }
    };
    return (
        <span style={{display: 'contents'}}>
            <button
                className="add-watchlist-btn"
                title="Add new watch list"
                onClick={handleAddClick}
            >
                +
            </button>
            {showModal && (
                <div className="auth-overlay" onClick={handleModalClose}>
                    <div className="auth-modal" onClick={e => e.stopPropagation()}>
                        <button className="auth-close" onClick={handleModalClose}>&times;</button>
                        <h2>New Watch List</h2>
                        {error && <div className="auth-error">{error}</div>}
                        <form onSubmit={handleModalSubmit}>
                            <div className="auth-form-group">
                                <input
                                    type="text"
                                    placeholder="Enter list name"
                                    value={listName}
                                    onChange={handleInputChange}
                                    autoFocus
                                    onKeyDown={handleInputKeyDown}
                                />
                            </div>
                            <button type="submit" className="auth-submit">Create List</button>
                        </form>
                    </div>
                </div>
            )}
        </span>
    );
}

export default AddWatchListButton;
