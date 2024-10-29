import { useEffect, useState } from 'react'
import backend from "./services/utils"


const Button = ({text, onClick}) => {
    return(<button onClick={onClick}>{text}</button>)
}

const Filter = ({value, handler}) => {

    return (
        <div>find countries 
            <input value={value} onChange={handler} /> 
        </div>
    )
}

const DisplayCountry = ({country}) => {
    const latlng = country.latlng
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        backend
            .getWeather(latlng[0],latlng[1])
            .then( response => setWeather(response.data))
            .catch( console.log("dados de temperatura não carregados"))
    },[])

    

    return(
        <div>
            {
                <div>
                    <div>
                        <h1>{country.name.common}</h1>
                        <p>capital {country.capital.map( city => `${city} `)}</p>
                        <p>area {country.area}</p>
                    </div>
                    <div>
                        <h3>languages:</h3>
                        <ul>
                            {Object.values(country.languages).map( lang => <li>{lang}</li>)}
                        </ul>
                    </div>
                    <div>
                        <img src={country.flags.svg} width="300" height="512" ></img>
                    </div>
                    {   weather && 
                    (<div>
                        <h2>Weather in {country.capital[0]}</h2>
                        <p>temperature {weather.main.temp} Celsius</p>
                        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="" />
                        <p>wind {weather.wind.speed} m/s </p>
                    </div>) }
                </div>
            }
    </div>
   )
}


const Countries = ({filterObject, countries}) => {

    const [selected, setSelected] = useState(null)

    const filteredCountries = countries.filter( country => country.name.common.toUpperCase().includes(filterObject.toUpperCase()))

    if(filteredCountries.length > 10){ return (<p>Too many matches specify another filter</p>) }

    if( filteredCountries.length === 1){ 
        const country = filteredCountries[0]
    return (
       <div>
            {
                <div>
                    <div>
                        <h1>{country.name.common}</h1>
                        <p>capital {country.capital.map( city => `${city} `)}</p>
                        <p>area {country.area}</p>
                    </div>
                    <div>
                        <h3>languages:</h3>
                        <ul>
                            {Object.values(country.languages).map( lang => <li>{lang}</li>)}
                        </ul>
                    </div>
                    <div>
                        <img src={country.flags.svg} width="300" height="512" ></img>
                    </div>
                </div>
            }
       </div>
    )
}

    return(
        <div>
            {filteredCountries.map( filtered => 
            <div> {filtered.name.common} 
            <Button text="show" onClick={() => setSelected(filtered) }/>
            {selected === filtered && <DisplayCountry country={selected}/>}
            </div>
            )}
        </div>
    )
}

const App = () => {
  const [countries, setCountries] = useState([]) 

  useEffect(() => {
    backend
        .getAll()
        .then( response => {
            setCountries(response.data)
        })
  },[])

  const [newFilter, setNewFilter] = useState('')

  const handleFilter = (event) => {
      setNewFilter(event.target.value)
  }

  
  return (
    <div>
      <Filter value={newFilter} handler={handleFilter}/>
      <Countries filterObject={newFilter} 
      countries={countries}
     />
    </div>
  )
}

export default App