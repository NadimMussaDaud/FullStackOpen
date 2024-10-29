import axios from 'axios'
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/all"
const weatherAPI_KEY = import.meta.env.WEATHER_KEY
const units = "metric"

const getAll = () => {
  return axios.get(baseUrl)
}

const deletion = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

const getWeather = (lat, lon) => {
  return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${weatherAPI_KEY}`
  )
}

export default { getAll, deletion, getWeather }