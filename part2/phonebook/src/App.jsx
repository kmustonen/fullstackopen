import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ])
  const [newName, setNewName] = useState('')

  const handleNameChange = (e) => {
    e.preventDefault()
    setNewName(e.target.value)
  }

  const addNewPerson = (e) => {
    e.preventDefault()
    const exists = persons.findIndex((person) => person.name === newName) !== -1
    exists
      ? alert(`${newName} is already added to phonebook`)
      : setPersons(persons.concat({ name: newName, id: persons.length }))
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addNewPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map(person => <li key={person.name}> {person.name}</li>)}
      </ul>
    </div >
  )

}

export default App