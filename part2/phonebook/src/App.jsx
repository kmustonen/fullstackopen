import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'

const PersonForm = ({ newPerson, addNewPerson, handleNameChange, handleNumberChange }) => {
  return (
    <form onSubmit={addNewPerson}>
      <div>
        name: <input value={newPerson.name} onChange={handleNameChange} />
        number: <input value={newPerson.number} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Filter = ({ filterWith, handleFilterChange }) => {
  return (
    <>
      filter shown with <input value={filterWith} onChange={handleFilterChange} />
    </>
  )
}

const Persons = ({ persons, filterWith, handleRemove }) => {
  return (
    <ul>
      {persons
        .filter(person => person.name.toLowerCase().includes(filterWith.toLowerCase()))
        .map(person => <li key={person.name}>
          <p>{person.name} {person.number}</p>
          <button onClick={() => { if (confirm(`Delete ${person.name} ?`)) handleRemove(person.id) }}>delete</button>
        </li>)}
    </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])

  const [newPerson, setNewPerson] = useState({ name: '', number: '' })
  const [filterWith, setFilter] = useState('')

  useEffect(() => {
    phonebookService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])


  const handleNameChange = (e) => {
    e.preventDefault()
    setNewPerson({ ...newPerson, name: e.target.value })
  }

  const handleNumberChange = (e) => {
    e.preventDefault()
    setNewPerson({ ...newPerson, number: e.target.value })
  }

  const handleFilterChange = (e) => {
    e.preventDefault
    setFilter(e.target.value)
  }

  const addNewPerson = (e) => {
    e.preventDefault()
    const exists = persons.findIndex((person) => person.name === newPerson.name) !== -1
    exists
      ? alert(`${newPerson.name} is already added to phonebook`)
      : (setPersons(persons.concat(newPerson)), phonebookService.create(newPerson))
  }

  const handleRemove = (id) => {
    phonebookService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterWith={filterWith} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm newPerson={newPerson} addNewPerson={addNewPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={persons} filterWith={filterWith} handleRemove={handleRemove} />
    </div>
  )

}

export default App