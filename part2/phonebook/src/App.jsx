import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notification">
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

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
          <button onClick={() => { if (confirm(`Delete ${person.name} ?`)) handleRemove(person) }}>delete</button>
        </li>)}
    </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])

  const [newPerson, setNewPerson] = useState({ name: '', number: '' })
  const [filterWith, setFilter] = useState('')

  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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
    const id = Math.random().toString(36).substring(2, 6)
    exists
      ? (confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one`) && updatePerson(newPerson))
      : (setPersons(persons.concat({ ...newPerson, id })),
        phonebookService.create({ ...newPerson, id }),
        setNotificationMessage(`Added ${newPerson.name}`),
        setTimeout(() => setNotificationMessage(null), 3000))
  }

  const updatePerson = (newPerson) => {
    const oldPerson = persons.find(person => person.name === newPerson.name)
    phonebookService
      .update(oldPerson.id, { ...oldPerson, number: newPerson.number })
      .then(() => {
        setPersons(persons.map(person => (person.name === newPerson.name) ? { ...person, number: newPerson.number } : person))
        setNotificationMessage(`Updated number for ${newPerson.name}`)
        setTimeout(() => setNotificationMessage(null), 3000)
      }).catch(error => {
        setErrorMessage(`Information of ${newPerson.name} has already been removed`)
        setTimeout(() => setErrorMessage(null), 3000)
      })
  }

  const handleRemove = (person) => {
    phonebookService
      .remove(person.id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== person.id))
        setNotificationMessage(`Removed ${person.name}`)
        setTimeout(() => setNotificationMessage(null), 3000)
      })
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notificationMessage} />
      <Error message={errorMessage} />
      <Filter filterWith={filterWith} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm newPerson={newPerson} addNewPerson={addNewPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={persons} filterWith={filterWith} handleRemove={handleRemove} />
    </div>
  )

}

export default App