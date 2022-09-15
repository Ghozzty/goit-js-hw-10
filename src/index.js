// _libs

import './css/styles.css';
const debounce = require('lodash.debounce');
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';

// _refs

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const oneCountry = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');

// create header

const header = document.createElement('h1');
header.textContent = 'Please enter country name';
input.before(header);

//__add some style

countryList.style.listStyle = 'none';
countryList.style.padding = '0';
oneCountry.style.fontSize = '18px';
oneCountry.style.marginBot = '15px';

// _main event

input.addEventListener('input', debounce(inputEvent, DEBOUNCE_DELAY));

function inputEvent(e) {
  let nameCountry = e.target.value;

  if (!nameCountry) {
    countryList.innerHTML = '';
    oneCountry.innerHTML = '';
    return;
  } else {
    fetchCountries(nameCountry)
      .then(data => {
        const lengthArr = data.length;

        if (lengthArr > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          return;
        }

        if (lengthArr > 1 && lengthArr < 11) {
          renderMoreCountries(data);
          return;
        }

        if (lengthArr === 1) {
          renderOnecountry(data);
          return;
        }
      })
      .catch(error =>
        Notify.failure('Oops, there is no country with that name')
      );
  }
}

// _service functions

function renderOnecountry(data) {
  const markup = `<p style = 'font-size: 30px'><img width = 40 height = 40 src="${
    data[0].flags.svg
  }" style = 'height: auto; margin-right: 10px'>${data[0].name.official}</p>
  <p><span style = 'font-weight:700'>Capital:</span> ${data[0].capital}</p>
  <p><span style = 'font-weight:700'>Population:</span> ${
    data[0].population
  }</p>
  <p><span style = 'font-weight:700'>Languages:</span> ${extractLanguages(
    data[0].languages
  )}</p>`;

  countryList.innerHTML = '';
  oneCountry.innerHTML = markup;
}

function renderMoreCountries(data) {
  let markup = ``;
  data.map(elem => {
    markup += `<li><img width = 20 height = 20 src="${elem.flags.svg}" style = 'height: auto; margin-right: 10px'>${elem.name.official}</li>`;
  });
  countryList.innerHTML = markup;
  oneCountry.innerHTML = '';
}

function extractLanguages(langObj) {
  let languages = '';
  const langArr = Object.values(langObj);
  for (const lang of langArr) {
    languages += `${lang}, `;
  }

  languages = languages.slice(0, -2);

  return languages;
}
