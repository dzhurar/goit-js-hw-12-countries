import axios from "axios";
import debounce from 'debounce';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const searchInput = document.getElementById('search');
const box = document.getElementById('box');
const resultUl = document.querySelector('.results');
async function getCountry(search){
    try {
        const { data } = await axios.get(`https://restcountries.com/v3.1/name/${search}`);
        if(data.length === 1){
            renderCountries(data);
            console.log(data.length)
            resultUl.innerHTML = '';
            return;
        }else if(data.length > 1 && data.length < 10){
            resultUl.innerHTML = `
            ${data.map(country => `<li>${country.name.common}</li>`).join('')}
            `
            box.innerHTML ='';
            return ;
        }else if(data.length > 10){
            console.log(data.length)
            box.innerHTML ='';
            resultUl.innerHTML = '';
            error({
                title: 'Error',
                text: `Too many matches(exactly ${data.length}), do more precise search`,
            })
            return ;
        }
    } catch (error) {
        console.error
    }
}
function renderCountries(countries){
    const html = countries.map(country =>{
        return `
            <h2>${country.name.common}</h2>
            <ul class="sides-list">
                <li class="info">
                    <p>Capital: ${country.capital}</p>
                    <p>Population: ${country.population}</p>
                    <p>Languages:</p>
                    <ul>
                        ${Object.values(country.languages).map(language => `<li>${language}</li>`).join('')}
                    </ul>
                </li>
                <li class="flag">
                    <img src="${country.flags.png}">
                </li>
            </ul>
        `
    })
    box.innerHTML = html;
}

searchInput.addEventListener('input', debounce(()=>{
    const value = searchInput.value;
    if(value === ''){
        box.innerHTML ='';
        resultUl.innerHTML = '';
    }
    getCountry(value);
}, 500))