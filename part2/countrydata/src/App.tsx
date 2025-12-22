import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ name, capital, area, languages, flag }: any) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>Capital {capital}</p>
      <p>Area {area}</p>
      <h3>Languages</h3>
      <ul>
        {languages.map((language: string) => <li key={language}>{language}</li>)}
      </ul>
      <img src={flag} width="150px" />
    </div>)
}

const App = () => {
  const [value, setValue] = useState('')
  const [country, setCountry] = useState<any>(null)
  const [countries, setCountries] = useState<string[]>([])
  const [matchingCountries, setMatching] = useState<string[]>([])

  useEffect(() => {
    console.log('fetching country names...')
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        const countries = response.data.map((country: any) => country.name.common)
        setCountries(countries)
      })
  }, [])

  const getCountryData = (countryName: string) => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${countryName}`)
      .then(response => {
        setCountry({ name: countryName, capital: response.data.capital[0], area: response.data.area, languages: Object.values(response.data.languages), flag: response.data.flags.png })
      })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    setValue(event.target.value)
    const query = event.target.value
    const newMatching = countries.filter(country =>
      country.toLowerCase().includes(query.toLowerCase())
    )

    setMatching(newMatching)
    if (newMatching.length === 1) {
      setCountry(getCountryData(newMatching[0]))
    } else { setCountry(null) }
  }

  const handleShow = (countryName: string) => () => {
    getCountryData(countryName)
  }

  return (
    <div>
      find countries: <input value={value} onChange={handleChange} />
      {(!country && matchingCountries.length <= 5 && matchingCountries.length > 1) && <ul>
        {matchingCountries.map(country => <li key={country}>{country}<button onClick={handleShow(country)}>Show</button></li>)}
      </ul>}
      {matchingCountries.length > 5 && <p>Too many matches, specify another filter</p>}
      {country && <Country {...country} />}
    </div>
  )
}

export default App