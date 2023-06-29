import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

const debounce = (func:React.Dispatch<React.SetStateAction<string>>,
  delay:number) => {
  let timerId: number;

  return (...args:string[]) => {
    clearTimeout(timerId);
    timerId = setTimeout(func, delay, ...args);
  };
};

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selected, setSelected] = useState<Person>();
  const [showPeople, setshowPeople] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const visiblePeople = useMemo(() => {
    return peopleFromServer.filter(
      person => person.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [appliedQuery]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setshowPeople(true);
  };

  const handleSelectPerson
  = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    person: Person) => {
    event.preventDefault();
    setSelected(person);
    setAppliedQuery('');
    setQuery(person.name);
    setshowPeople(false);
  };

  const handleInputFocus = () => {
    setshowPeople(true);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selected
          ? `${selected.name} (${selected.born} - ${selected.died})`
          : 'No selected person'}
      </h1>

      <div
        className={showPeople ? 'dropdown is-active' : 'dropdown'}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={event => {
              handleInputChange(event);
            }}
            onFocus={handleInputFocus}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {visiblePeople.length
              ? visiblePeople.map(person => (
                <div
                  key={person.name}
                  className="dropdown-item"
                >
                  <button
                    type="submit"
                    onClick={(event) => {
                      handleSelectPerson(event, person);
                    }}
                  >
                    <p
                      className={person.sex === 'f'
                        ? 'has-text-danger'
                        : 'has-text-link'}
                    >
                      {person.name}
                    </p>
                  </button>
                </div>
              ))
              : (
                <div className="dropdown-item">
                  No matching suggestions
                </div>
              )}
          </div>
        </div>
      </div>
    </main>
  );
};
