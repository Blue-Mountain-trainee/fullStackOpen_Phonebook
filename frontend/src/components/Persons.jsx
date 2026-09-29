const Persons = ({filteredPersons, onDeletePerson}) => {
  return (
    filteredPersons.map((person) =>
        <p key={person.name}>
          {person.name} {person.number} 
          <button onClick={() => {onDeletePerson(person)}}>
            delete
          </button>
        </p>
    )
  )
}

export default Persons