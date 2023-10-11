"use client";
import { useState, useEffect } from 'react';

export default function Home() {
  //https://gitlab.com/online-app/pokemon-weather-test/-/tree/main/developer
  const [city, setCity] = useState("");
  const [data, setData] = useState<any>(null);
  const [dataPokemon, setDataPokemon] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=5b04e4f5138c0c9cd1d71a4aeca15c60`;
        const response = await fetch(apiURL);
        const jsonData = await response.json();
        setData(jsonData);

        const temperature = jsonData.main.temp;

        if (temperature) {
          let pokemonType = "";

          switch (true) {
            //avoid errors when have a float number(ex: 5.1)
            case temperature < 5:
              pokemonType = "ice";
              break;
            case temperature >= 5 && temperature < 10:
              pokemonType = "water";
              break;
            case temperature >= 12 && temperature < 15:
              pokemonType = "grass";
              break;
            case temperature >= 15 && temperature < 21:
              pokemonType = "ground";
              break;
            case temperature >= 23 && temperature < 27:
              pokemonType = "bug";
              break;
            case temperature >= 27 && temperature <= 33:
              pokemonType = "rock";
              break;
            case temperature > 33:
              pokemonType = "fire";
              break;
            default:
              pokemonType = "normal";
          }

          const apiURLPokemon = `https://pokeapi.co/api/v2/type/${pokemonType}`;
          const responsePokemon = await fetch(apiURLPokemon);
          const jsonDataPokemon = await responsePokemon.json();
          setDataPokemon(jsonDataPokemon);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (city) {
      fetchData();
    }
  }, [city]);

  const getRandomPokemon = () => {
    if (dataPokemon && dataPokemon.pokemon) {
      const randomIndex = Math.floor(
        Math.random() * dataPokemon.pokemon.length
      );
      return dataPokemon.pokemon[randomIndex];
    }
    return null;
  };

  const randomPokemon = getRandomPokemon();

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-5">
      <input
        className="border-2 px-3 py-2"
        type="text"
        value={city}
        onChange={(event) => setCity(event?.target.value)}
        name="city"
        id="city"
        placeholder="Type a city..."
      />
      <div>
        {data && data.weather && city ? (
          data.cod !== "404" ? (
            <div className="text-[18px] flex flex-col gap-1">
              <p>
                <i>City:</i> {city}
              </p>
              <p>
                <i>Weather:</i> {data.weather[0].main}
              </p>
              <p>
                <i>Description:</i> {data.main.temp} ºC
              </p>
              {randomPokemon && (
                <div className="pt-5">
                  <h3 className="text-[22px] pb-1">Random Pokémon</h3>
                  <p>
                    <i>Name:</i> {randomPokemon.pokemon.name}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p>No weather data available.</p>
          )
        ) : (
          <p className="text-[14px]">
            <i>Loading weather data...</i>
          </p>
        )}
      </div>
    </div>
  )
}
