import { useEffect, useState } from 'react'
import backend from "./services/utils"


const Button = ({text, onClick}) => {
    return(<button onClick={onClick}>{text}</button>)
}
const Notification = ({message, error}) => {
    const color = error ? "red" : "green"
    
    if(message === null){ return null }
    
    const styles = {
        color: color,
        background: "lightgrey",
        fontSize: 20,
        borderStyle: "solid",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }
    return(
        <div style={styles}>{message}</div>
    )
}
const Filter = ({value, handler}) => {
    return (
        <div>filter shown with: 
            <input value={value} onChange={handler} /> 
        </div>
    )
}

const PhoneForm = (props) => {
    return(
        <form onSubmit={props.onSubmit}>
        <div>
          name: <input 
          value={props.value1} 
          onChange={props.handler1}/>
        </div>
        <div>
          number: <input 
          value={props.value2} 
          onChange={props.handler2}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

const Contacts = ({filterObject, persons, setPersons, setError, setMessage}) => {

    const deleteContact = (id, name) => {
       const message = `Delete ${name}`
       const confirmation = window.confirm(message)

       if(confirmation){
        backend
            .deletion(id)
            .then( setPersons(persons.filter( person => person.id !== id)) )
            .catch( error => {
                setError(true)
                setMessage(`Information of ${name} has already been removed from server.`)
                setTimeout(() => {
                    setError(false)
                    setMessage(null)
                }, 5000)
            })
       }
    }

    return(
        <div>
            {persons.filter( person => person.name.toUpperCase().includes(filterObject.toUpperCase())).map( filtered => <div> {filtered.name} {filtered.number} {filtered.id}<Button text="delete" onClick={() => deleteContact(filtered.id, filtered.name)}/>
            </div>)}
        </div>
    )
}

const App = () => {
  const [persons, setPersons] = useState([]) 

  useEffect(() => {
    backend
        .getAll()
        .then( response => {
            setPersons(response.data)
        })
  },[])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(false)


  const addContact = (event) => {
    event.preventDefault()
    const name = newName
    if(persons.some(person => (person.name === newName))){
        const message = `${newName} is already added to the phonebook. Replace old number with the new one?`
        if(window.confirm(message)){
            const personUpdated = {...persons.find( person => person.name === newName), number: `${newNumber}` }
            backend
                .update(personUpdated.id, personUpdated)
                .then( response => { setPersons(persons.map( person => person.id === personUpdated.id ? response.data : person ))
                setNewName('')
                setNewNumber('')
                })
                .catch( error => {
                    setError(true)
                    setMessage(error.response.data.error)
                    setTimeout(() => {
                        setError(false)
                        setMessage(null)
                    }, 5000)
                })

            setMessage(`Updated ${name}`)
            setTimeout(() => setMessage(null), 5000)
            
        }else{
            setNewName('')
            setNewNumber('')
        }
    }else{
        const phoneObject = {
            name : newName,
            number : newNumber
        }

        backend
            .create(phoneObject)
            .then(response => {
                setPersons( persons.concat(response.data))
                setNewName('')
                setNewNumber('')
            })
            .catch( err => {
                setError(true)
                setMessage(err.response.data.error)
                setTimeout(() => {
                    setError(false)
                    setMessage(null)
                }, 5000)
            })

        setMessage(`Added ${name}`)
        setTimeout(() => setMessage(null), 5000)
    }
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }


  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilter = (event) => {
      setNewFilter(event.target.value)
  }

  

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={newFilter} handler={handleFilter}/>
      <h2>add a new </h2> 
      <Notification message={message} error={error}/>
      <PhoneForm value1={newName} value2={newNumber} 
      handler1={handleNameChange} handler2={handleNumberChange} 
      onSubmit={addContact}/>
      <h2>Numbers</h2>
     <Contacts filterObject={newFilter} 
     persons={persons} setPersons={setPersons}
     setError={setError} setMessage={setMessage}
     />
    </div>
  )
}

export default App