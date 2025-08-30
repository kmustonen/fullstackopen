import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1231244' }
  ])
  const [newPerson, setNewPerson] = useState({ name: '', number: '' })

  const handleNameChange = (e) => {
    e.preventDefault()
    setNewPerson({ ...newPerson, name: e.target.value })
  }

  const handleNumberChange = (e) => {
    e.preventDefault()
    setNewPerson({ ...newPerson, number: e.target.value })
  }

  const addNewPerson = (e) => {
    e.preventDefault()
    const exists = persons.findIndex((person) => person.name === newPerson.name) !== -1
    exists
      ? alert(`${newPerson.name} is already added to phonebook`)
      : setPersons(persons.concat(newPerson))
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addNewPerson}>
        <div>
          name: <input value={newPerson.name} onChange={handleNameChange} />
          number: <input value={newPerson.number} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map(person => <li key={person.name}>{person.name} {person.number}</li>)}
      </ul>
    </div >
  )

}

export default App