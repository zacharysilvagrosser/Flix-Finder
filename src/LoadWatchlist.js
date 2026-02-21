import React, { useState, useRef, useEffect } from 'react';
import './Auth.css';

// Watch list button component to display watch list
function LoadWatchList(props) {
    // Use React state for toggling
    const showWatchList = () => {
        props.onToggleWatchList();
    };

    // Modal state for editing/deleting/adding
    const [showEditModal, setShowEditModal] = useState(false);
    const [editName, setEditName] = useState('');
    const [editError, setEditError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addName, setAddName] = useState('');
    const [addError, setAddError] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [editIdx, setEditIdx] = useState(null);
    const [deleteIdx, setDeleteIdx] = useState(null);
    const dropdownRef = useRef();

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        }
        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClick);
        } else {
            document.removeEventListener('mousedown', handleClick);
        }
        return () => document.removeEventListener('mousedown', handleClick);
    }, [dropdownOpen]);

    // Custom dropdown for watch lists
    return (
        <div className="watchlist-controls">
            <button
                id="watch-list"
                onClick={showWatchList}
                className={
                    (props.showingWatchList ? "view-watch-list " : "") + "results-watchlist-btn"
                }
            >
                {props.watchLists && props.watchLists[props.selectedWatchList]?.name}
            </button>
            <div className="custom-dropdown" ref={dropdownRef}>
                <button
                    className="custom-dropdown-toggle"
                    onClick={() => setDropdownOpen(open => !open)}
                    aria-haspopup="listbox"
                    aria-expanded={dropdownOpen}
                >
                    <span className="dropdown-toggle-label">{props.watchLists && props.watchLists[props.selectedWatchList]?.name}</span>
                    <span style={{ marginLeft: 8 }}>▼</span>
                </button>
                {dropdownOpen && (
                    <ul className="custom-dropdown-menu" role="listbox">
                        {props.watchLists && props.watchLists.map((wl, idx) => (
                            <li
                                key={wl.name + idx}
                                className={idx === props.selectedWatchList ? 'selected' : ''}
                                role="option"
                                aria-selected={idx === props.selectedWatchList}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.3rem 0.7rem', cursor: 'pointer' }}
                                onClick={() => {
                                    props.setSelectedWatchList(idx);
                                    setDropdownOpen(false);
                                }}
                            >
                                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{wl.name}</span>
                                <span style={{ display: 'flex', gap: 6, marginLeft: 10 }}>
                                    <span
                                        title="Edit name"
                                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: 0.8, width: 20, height: 20 }}
                                        onClick={e => {
                                            e.stopPropagation();
                                            setEditIdx(idx);
                                            setEditName(wl.name);
                                            setEditError('');
                                            setShowEditModal(true);
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        {/* Modern pencil SVG */}
                                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.7 2.29a1 1 0 0 1 1.42 0l1.59 1.59a1 1 0 0 1 0 1.42l-9.34 9.34a1 1 0 0 1-.45.26l-4 1a1 1 0 0 1-1.22-1.22l1-4a1 1 0 0 1 .26-.45l9.34-9.34zm-8.38 11.09l7.09-7.09-1.59-1.59-7.09 7.09-0.71 2.83 2.83-0.71z" fill="currentColor"/></svg>
                                    </span>
                                    {props.watchLists.length > 1 && idx !== 0 && (
                                        <span
                                            title="Delete list"
                                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: 0.8, width: 20, height: 20 }}
                                            onClick={e => {
                                                e.stopPropagation();
                                                setDeleteIdx(idx);
                                                setShowDeleteModal(true);
                                                setDropdownOpen(false);
                                            }}
                                        >
                                            {/* Modern trash SVG */}
                                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V3h4a1 1 0 1 1 0 2h-1v12a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V5H2a1 1 0 1 1 0-2h4V2zm2 1v0h1V2h-1v1zm-4 2v12h10V5H5zm2 3a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V8zm4 0a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V8z" fill="currentColor"/></svg>
                                        </span>
                                    )}
                                </span>
                            </li>
                        ))}
                        {/* Add new list option */}
                        <li
                            key="add-new-list"
                            className="add-new-list-option"
                            style={{ color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.3rem 0.7rem', borderTop: '1px solid #223052', marginTop: 4 }}
                            onClick={e => {
                                e.stopPropagation();
                                setShowAddModal(true);
                                setDropdownOpen(false);
                            }}
                        >
                            <span style={{ fontSize: '1.2em', marginRight: 8 }}>+</span> Add new watch list
                        </li>
                    </ul>
                )}
            </div>
            {props.children}

            {/* Add Modal */}
            {showAddModal && (
                <div className="auth-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="auth-modal" onClick={e => e.stopPropagation()}>
                        <button className="auth-close" onClick={() => setShowAddModal(false)}>&times;</button>
                        <h2>New Watch List</h2>
                        {addError && <div className="auth-error">{addError}</div>}
                        <form onSubmit={e => {
                            e.preventDefault();
                            if (!addName.trim()) {
                                setAddError('List name cannot be empty.');
                                return;
                            }
                            if (props.onAdd) {
                                props.onAdd(addName.trim());
                            }
                            setShowAddModal(false);
                            setAddName('');
                            setAddError('');
                        }}>
                            <div className="auth-form-group">
                                <input
                                    type="text"
                                    placeholder="Enter list name"
                                    value={addName}
                                    onChange={e => setAddName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <button type="submit" className="auth-submit">Create List</button>
                        </form>
                    </div>
                </div>
            )}
            {/* Edit Modal */}
            {showEditModal && (
                <div className="auth-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="auth-modal" onClick={e => e.stopPropagation()}>
                        <button className="auth-close" onClick={() => setShowEditModal(false)}>&times;</button>
                        <h2>Edit List Name</h2>
                        {editError && <div className="auth-error">{editError}</div>}
                        <form onSubmit={e => {
                            e.preventDefault();
                            if (!editName.trim()) {
                                setEditError('List name cannot be empty.');
                                return;
                            }
                            props.onEditName(editIdx, editName.trim());
                            setShowEditModal(false);
                        }}>
                            <div className="auth-form-group">
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <button type="submit" className="auth-submit">Save</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="auth-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="auth-modal" onClick={e => e.stopPropagation()}>
                        <button className="auth-close" onClick={() => setShowDeleteModal(false)}>&times;</button>
                        <h2>Delete List</h2>
                        <div className="auth-error">Are you sure you want to delete this list? This cannot be undone.</div>
                        <button
                            className="auth-submit"
                            style={{ background: '#c33', marginRight: 8 }}
                            onClick={() => {
                                props.onDelete(deleteIdx);
                                setShowDeleteModal(false);
                            }}
                        >
                            Delete
                        </button>
                        <button className="auth-submit" onClick={() => setShowDeleteModal(false)} style={{ background: '#aaa' }}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoadWatchList;