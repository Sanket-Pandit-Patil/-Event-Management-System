import React, { useState, useRef, useEffect } from 'react';
import { useProfileStore } from '../store/profileStore';
import { ChevronDown, Search, Plus, Check } from 'lucide-react';
import { filterProfilesByQuery } from '../utils/dsa';

export default function Header() {
  const { profiles, selectedProfile, setSelectedProfile, createProfile } = useProfileStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddInline, setShowAddInline] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [error, setError] = useState('');

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setShowAddInline(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProfiles = filterProfilesByQuery(profiles, searchQuery);

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    try {
      setError('');
      const created = await createProfile(newProfileName.trim());
      setSelectedProfile(created);
      setNewProfileName('');
      setShowAddInline(false);
      setIsOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <header className="app-header">
      <div className="header-title-section">
        <h1>Event Management</h1>
        <p>Create and manage events across multiple timezones</p>
      </div>

      <div className="profile-selector-container" ref={dropdownRef}>
        <button 
          className="profile-selector-btn"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          <span>{selectedProfile ? selectedProfile.name : 'Select current profile...'}</span>
          <ChevronDown size={16} />
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            <div className="search-input-wrapper">
              <Search size={14} className="text-muted" />
              <input
                type="text"
                placeholder="Search current profile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div className="dropdown-options-list">
              <div
                className={`dropdown-option ${!selectedProfile ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedProfile(null);
                  setIsOpen(false);
                }}
              >
                <span>All Profiles</span>
                {!selectedProfile && <Check size={14} />}
              </div>

              {filteredProfiles.map((p) => (
                <div
                  key={p._id}
                  className={`dropdown-option ${selectedProfile && selectedProfile._id === p._id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedProfile(p);
                    setIsOpen(false);
                  }}
                >
                  <span>{p.name}</span>
                  {selectedProfile && selectedProfile._id === p._id && <Check size={14} />}
                </div>
              ))}
            </div>

            {error && <div className="alert-error" style={{ margin: '8px', fontSize: '11px' }}>{error}</div>}

            {!showAddInline ? (
              <div 
                className="add-profile-option"
                onClick={() => setShowAddInline(true)}
              >
                <Plus size={14} />
                <span>Add Profile</span>
              </div>
            ) : (
              <form className="add-profile-inline-form" onSubmit={handleCreateProfile}>
                <input
                  type="text"
                  placeholder="Enter profile name"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  autoFocus
                />
                <button type="submit">Add</button>
              </form>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
