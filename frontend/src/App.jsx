/*
    persons配列は，必ずDBと直接同期するのではなく，整合するようにsetPersonをうまく使っているだけなので，
    ミスがあると不整合が生じそう．
*/

import { useState, useEffect } from 'react'
import connect from './service/connect'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Notification from './components/Notification'
import "./index.css"

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState("")
  const [nameFilter, setNameFilter] = useState("")
  const [notice, setNotice] = useState(null)

  const showNoticeShortly = (msg) => {
    setNotice(msg)
    setTimeout(()=>setNotice(null), 5000)
  }

  useEffect(() => {
    connect
      .getAll()
      .then(persons => {setPersons(persons)})   // persons情報源A
  }, [])

  // 大文字小文字区別せず，reference文字列がtarget文字列を含むか照合
  // 対応するrefのパターンは膨大で，すべて挙げるのは難しい
  // refとtgtをすべて小文字に直して照合すればよい
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(nameFilter.toLowerCase())
  )

  const handleNewName = (e) => {
    setNewName(e.target.value)
  }

  const handleNewNumber = (e) => {
    setNewNumber(e.target.value)
  }

  const handleNewFilter = (e) => {
    console.log(e);
    setNameFilter(e.target.value)
  }

  const handleAddPerson = (event) => {
    event.preventDefault()

    const newPerson = {
      name: newName,
      number: newNumber
    }

    if (newName === "" || newNumber === "") {
      alert("some field is empty")
      return
    }

    const oldPerson = persons.find((person) => person.name === newName)
    const samePersonExists = oldPerson !== undefined

    if (samePersonExists) {
      const isSure = window.confirm(`${oldPerson.name} is already exist, replace old number?`)
      const newPerson = {
        ...oldPerson,
        number: newNumber
      }
      if (isSure) {
        connect
          .replacePerson(newPerson)
          .then(resPerson => {
            console.log("replace data\n", resPerson)
            showNoticeShortly(`replace ${resPerson.name}'s number`)
            setPersons(persons.map(person => person.id !== resPerson.id ? person : resPerson))
          })
          .catch(e => {
            console.log("PUT failed!!", e)
            showNoticeShortly(`"${newName}" has already been removed`)
            setPersons(persons.filter(person => person.id !== oldPerson.id))
          })
      } else { 
        return 
      }
    } else {
      
      connect
        .createPerson(newPerson)
        .then(createdPerson => {
          showNoticeShortly(`"${createdPerson.name}" added`)
          setPersons(persons.concat(createdPerson))   // persons情報源B
        })
        
    }
    
    setNewName("")
    setNewNumber("")
  }

  const handleDeletePerson = (selectPerson) => {
    connect
      .deletePerson(selectPerson)
      .then(
        res => {
          console.log("delete item", res)
          showNoticeShortly(`"${res.data.name}" deleted`)
          setPersons(persons.filter(person => person.id !== selectPerson.id))  // persons情報源
        },
        err => console.log(err)
      )
  }
  
  return (
    <div>
      <h1>Phonebook</h1>

      <Notification message={notice}/>
    
      <Filter
        nameFilter={nameFilter}
        onChange={handleNewFilter}
      />
    
      <h3>add a new</h3>

      <PersonForm
        handleAddPerson={handleAddPerson}
        newName={newName}
        onNameChange={handleNewName}
        newNumber={newNumber}
        onNumberChange={handleNewNumber}
      />

      <h3>Numbers</h3>

      <Persons 
        filteredPersons={filteredPersons}
        onDeletePerson={handleDeletePerson}
      />

    </div>
  )
}

export default App