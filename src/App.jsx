import { useEffect, useState } from 'react'
/*  Images  */
import clearIcon from './assets/clear.png'
import cloudIcon from './assets/cloud.png'
import drizzleIcon from './assets/drizzle.png'
import humidityIcon from './assets/humidity.png'
import rainIcon from './assets/rain.png'
import searchIcon from './assets/search.jpg'
import snowIcon from './assets/snow.png'
import windIcon from './assets/wind.png'

import './App.css'

const WheatherDetails = ({icon,temp,city,country,lat,log,wind,humidity,error,loading,cityNotFound})=> {
  return (
    <>
    <div className="image">
      <img src={icon} alt="image" />
    </div>
    <div className="temp">{temp} °C</div>
    <div className="location">{city}</div>
    <div className="country">{country}</div>
    <div className="cord">
      <div>
        <span className="lat">Lattitude</span>
        <span>{lat}</span>
      </div>
      <div>
        <span className="log">Longitude</span>
        <span>{log}</span>
      </div>
    </div>
    <div className="data-container">
      <div className="element">
        <img src={humidityIcon} alt="humidity" className="icon" />
        <div className="data">
          <div className="humidity-percent">{humidity} %</div>
          <div className="text">Humidity</div>
        </div>
      </div>

      <div className="element">
        <img src={windIcon} alt="wind" className="icon" />
        <div className="data">
          <div className="wind-percent">{wind} km/h</div>
          <div className="text">Wind Speed</div>
        </div>
      </div>
    </div>
    
    

    </>
  )
}

function App() {

  let apiKey = "284b4ef29d985d9693d97447eebd3677"

  const [icon,setIcon] = useState(clearIcon)
  const [temp,setTemp] = useState(0)
  const [city,setCity] = useState("")
  const [country,setCountry] = useState("")
  const [lat,setLat] = useState(0)
  const [log,setLog] = useState(0)
  const [humidity,setHumidity] = useState(0)
  const [wind,setWind] = useState(0)

  const[error,setError]=useState(null)

  const [text,setText] = useState("Colombo")

  const [cityNotFound,setCityNotFound] = useState(false)
  const[loading,setLoading] = useState(false)

  const wheatherIconMap = {
    "01d":clearIcon,
    "01n":clearIcon,
    "02d":cloudIcon,
    "02n":cloudIcon,
    "03d":drizzleIcon,
    "03n":drizzleIcon,
    "04d":drizzleIcon,
    "04n":drizzleIcon,
    "09d":rainIcon,
    "09n":rainIcon,
    "10d":rainIcon,
    "10n":rainIcon,
    "13d":snowIcon,
    "13n":snowIcon
  }

  const search = async ()=>{
    setLoading(true)
    
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apiKey}&units=Metric`

    try{
      let res = await fetch(url)
      let data = await res.json()

      if(data.cod === "404"){
        console.error("City Not Found")
        setError(null)
        setCityNotFound(true)
        setLoading(true)
        return
      }

      setHumidity(data.main.humidity)
      setWind(data.wind.speed)
      setTemp(Math.floor(data.main.temp))
      setCity(data.name)
      setCountry(data.sys.country)
      setLat(data.coord.lat)
      setLog(data.coord.lon)

      const wheatherIconCode = data.weather[0].icon
      setIcon(wheatherIconMap[wheatherIconCode] ||  clearIcon)
      setCityNotFound(false)

    }catch(error){
      console.error("An error occured: ",error.message)
      setError("Error Occured while fetching data!!!")
    }finally{
      setLoading(false)

    }
  }

  const handlecity = (e) => {
    setText(e.target.value)
  }
  const handleKeyDown = (e) =>{
    if(e.key === "Enter"){
      search()
    }
  }

  useEffect(function(){
    search()
  },[])
  

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input type="text" className='cityInput' placeholder='Search City' onChange={handlecity} value={text} onKeyDown={handleKeyDown} />
          <div className="search-icon" onClick={()=> search()}>
            <img src={searchIcon} alt="Search" />
          </div>
        </div>
        { loading && <div className="loading-message">Loading...</div>}
    {error && <div className="error-message">{error}</div>}
    {cityNotFound && <div className="city-not-found">City Not Found</div>}
    {!loading && !cityNotFound && <  WheatherDetails  icon={icon}
        temp={temp}
        city={city}
        country={country}
        lat={lat}
        log={log}
        humidity={humidity}
        wind={wind}
        
        />}

<p className="copyright">Design by <span>Asjad Ahd</span></p>
      </div>
    </>
  )
}

export default App
