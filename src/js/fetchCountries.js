export { fetchCountries };

const searchParams = 'name,capital,population,languages,flags';

function fetchCountries(name) {
  name = name.trim();
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=${searchParams}`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
