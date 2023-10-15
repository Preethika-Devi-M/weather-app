

const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const d = new Date();
let j = d.getDay();
let index = {
    0: ['pm2_5', `PM2`], 1: ['pm10', `PM10`], 2: ['so2', `SO<sub>2</sub>`],
    3: ['no2', `NO<sub>2</sub>`], 4: ['o3', `O<sub>3</sub>`], 5: ['co', 'CO']
}
const loadingPage = document.getElementById('load');
const loadAqi = document.getElementById('load-aqi');
const aqiLoc = document.getElementById("aqi-location");
const dateTimeDisplay = document.querySelectorAll('.dt-display');
console.log(dateTimeDisplay)
const sunRS = document.querySelectorAll('.rise-set');
const overlay = document.querySelectorAll('.overlay-content');
const newsOverlay = document.querySelector(".news-overlay");
let searchedLoaction;
const uv = document.querySelectorAll('.uv');
const uvSug = ["No Protection Required!,Low",
    "Protection Required!,Medium",
    "Protection Essential!,High",
    "Need Shade!,Very High",
    "Can't go out!,Extreme"]
const uvS = document.querySelectorAll('.uv-sug');

display_today = (loca = 'Chennai') => {
    let cls = 'template';
    let content = document.getElementById('today');
    let aqi = document.getElementById('aqi');
    content.innerHTML = '';
    aqi.innerHTML = '';
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=2e237ee7d07f4ce3ab2145012232604&q=${loca}&days=1&aqi=yes&alerts=no`)
        .then(response => response.json())
        .then(data => {
            loadingPage.style.display = 'none';
            loadAqi.style.display = 'none';
            let k = Number(data['location']['localtime'].split(' ')[1].split(':')[0]);
            for (let i = 0; i < 8; i++) {
                if (i == 0) {
                    cls += ' active';
                }
                const temp = `
        <div class="${cls} d-flex p-2 mx-2 flex-column align-items-center">
            <p class="m-0">
                ${timeConversion(k)}
            </p>
            <img src=${data['forecast']['forecastday'][0]['hour'][k]['condition']['icon']} alt="">
            <p class="m-0">
                ${data['forecast']['forecastday'][0]['hour'][k]['temp_c']}℃
            </p>
            <p class='d-none'>${k}</p>
        </div>
    `
                cls = 'template';
                content.innerHTML += temp;

                k++;
                k %= 24;


            }

            /*************************************************************************************************** */

            const hourly = document.querySelectorAll('.template');
            const weatherOverlayDisplay = document.getElementById('weather-overlay');
            console.log(overlay)
            console.log(hourly);
            hourly.forEach(each => {
                each.onclick = () => {
                    console.log();
                    weatherOverlayDisplay.style.display = 'flex';
                    const num = Number(each.textContent.split('\n')[9].trim());
                    overlay[0].setAttribute("src", data['forecast']['forecastday'][0]['hour'][num]['condition']['icon']);
                    overlay[1].innerText = each.innerText.split('\n')[0];
                    overlay[2].innerText = data['forecast']['forecastday'][0]['hour'][num]['temp_c'] + '℃';
                    overlay[3].innerText = data['forecast']['forecastday'][0]['hour'][num]['condition']['text'];
                    overlay[4].innerText = data['forecast']['forecastday'][0]['hour'][num]['chance_of_rain'];
                    overlay[5].innerText = data['forecast']['forecastday'][0]['hour'][num]['wind_kph'] + ' ';
                    overlay[6].innerText = data['forecast']['forecastday'][0]['hour'][num]['humidity'] + ' ';
                }
            });

            weatherOverlayDisplay.onclick = () => {
                weatherOverlayDisplay.style.display = 'none';
            }


            /******************************************************************************************************** */
            for (let a = 0; a < 6; a++) {
                const tmp = `
        <div class="aqi-template px-2 py-3 d-flex flex-column align-items-center">
        <b><p class="m-0 pb-1" style="font-size: 20px;">${data['current']['air_quality'][index[a][0]].toFixed(1)}</p></b>
        <p class="m-0" style="font-size: 18px; font-weight: 450;">${index[a][1]}</p>
        </div>
        `
                aqi.innerHTML += tmp;
            }
            const aqiIcon = document.querySelectorAll('.aqi-icon');
            if (data['current']['air_quality']['gb-defra-index'] <= 3) {
                aqiIcon[0].style.color = ' #33cc33';
                aqiIcon[1].style.color = ' #33cc33';
                aqiIcon[1].innerText = " Good";
            }
            else if (data['current']['air_quality']['gb-defra-index'] > 3 && data['current']['air_quality']['gb-defra-index'] <= 6) {
                aqiIcon[0].style.color = '#ffcc00';
                aqiIcon[1].style.color = '#ffcc00';
                aqiIcon[1].innerText = ' Moderate';
            }
            else if (data['current']['air_quality']['gb-defra-index'] > 6 && data['current']['air_quality']['gb-defra-index'] <= 9) {
                aqiIcon[0].style.color = ' #ff471a';
                aqiIcon[1].style.color = ' #ff471a';
                aqiIcon[1].innerText = " Poor";
            }
            else {
                aqiIcon[0].style.color = ' #bf00ff';
                aqiIcon[1].style.color = ' #bf00ff';
                aqiIcon[1].innerText = ' Toxic';
            }
        }
        );
}

display_week = (loca = 'Chennai') => {
    let cls = 'template1';
    let content = document.getElementById('week');
    content.innerHTML = '';
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=2e237ee7d07f4ce3ab2145012232604&q=${loca}&days=7&aqi=no&alerts=no`)
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < 7; i++) {
                if (i == 0) {
                    cls += ' active2';
                }
                const temp = `
            <div class="${cls} d-flex p-2 mx-2 flex-column align-items-center">
                <p class="m-0">${day[j].slice(0, 3)}</p>
                <img src=${data['forecast']['forecastday'][j]['day']['condition']['icon']} alt="">
                <p class="m-0">${data['forecast']['forecastday'][j]['day']['maxtemp_c']}℃</p>
                <p class="d-none">${j}</p>
            </div>
            `
                cls = 'template1';
                content.innerHTML += temp;

                j++;
                j %= 7;
            }
            const weekly = document.querySelectorAll('.template1');
            const weatherOverlayDisplay = document.getElementById('weather-overlay');
            weekly.forEach(each => {
                each.onclick = () => {
                    weatherOverlayDisplay.style.display = 'flex';
                    const num = Number(each.textContent.split('\n')[4].trim());
                    overlay[0].setAttribute("src", data['forecast']['forecastday'][num]['day']['condition']['icon']);
                    overlay[1].innerText = each.innerText.split('\n')[0];
                    overlay[2].innerText = data['forecast']['forecastday'][num]['day']['maxtemp_c'] + '℃';
                    overlay[3].innerText = data['forecast']['forecastday'][num]['day']['condition']['text'];
                    overlay[4].innerText = data['forecast']['forecastday'][num]['day']['daily_chance_of_rain'];
                    overlay[5].innerText = data['forecast']['forecastday'][num]['day']['maxwind_kph'] + ' ';
                    overlay[6].innerText = data['forecast']['forecastday'][num]['day']['avghumidity'] + ' ';
                }
            });
        }
        );
}

/*FUNCTION FOR SEARCH EVENT*/

const searchText = (event) => {
    if (event.keyCode == 13) {
        const location = document.getElementById('search-text').value;
        search(location);
    }
}

const search = (location = 'Chennai') => {
    let x = document.querySelectorAll('.right-main-content');
    loadingPage.style.display = 'block';
    loadAqi.style.display = 'block';
    fetch(`http://api.weatherapi.com/v1/current.json?key=2e237ee7d07f4ce3ab2145012232604&q=${location}&aqi=no`)
        .then(response => response.json())
        .then(data => {
            x[4].innerText = data['current']['condition']['text'];
            x[0].innerText = data['location']['name'];
            x[1].setAttribute("src", data['current']['condition']['icon']);
            x[3].innerText = `${data['current']['temp_c']}℃`;
            x[6].innerText = data['current']['wind_kph'];
            x[8].innerText = data['current']['humidity'];
            x[5].innerText = data['current']['feelslike_c'];
            x[2].innerText = d.getDate() + " " + month[d.getMonth()].slice(0, 3);
            if (data['current']['humidity'] <= 33) {
                x[7].innerText = "humidity_low";
            }
            else if (data['current']['humidity'] > 33 && data['current']['humidity'] <= 77) {
                x[7].innerText = "humidity_mid";
            }
            else {
                x[7].innerText = "humidity_high";
            }
            let uvVal = data['current']['uv'];
            if (uvVal <= 2) {
                uvS[0].innerText = uvSug[0].split(',')[1];
                uvS[1].innerText = uvSug[0].split(',')[0];
            }
            else if (uvVal > 2 && uvVal <= 5) {
                uvS[0].innerText = uvSug[1].split(',')[1];
                uvS[1].innerText = uvSug[1].split(',')[0];
            }
            else if (uvVal > 5 && uvVal <= 7) {
                uvS[0].innerText = uvSug[2].split(',')[1];
                uvS[1].innerText = uvSug[2].split(',')[0];
            }
            else if (uvVal > 7 && uvVal <= 10) {
                uvS[0].innerText = uvSug[3].split(',')[1];
                uvS[1].innerText = uvSug[3].split(',')[0];
            }
            else {
                uvS[0].innerText = uvSug[4].split(',')[1];
                uvS[1].innerText = uvSug[4].split(',')[0];
            }
            uv[0].innerText = uvVal;
            uv[1].innerText = data['current']['vis_km'] + ' km';
        });
    auto_cls.style.display = 'none';
    document.getElementById('autoDetectLoading').style.display = 'none';
    aqiLoc.innerText = ' ' + location;
    display_week(location);
    display_today(location);
    sunRiseSet(location);
    //newsContent();
}

const sunRiseSet = (loca) => {
    fetch(`http://api.weatherapi.com/v1/astronomy.json?key=2e237ee7d07f4ce3ab2145012232604%20&q=${loca}`)
        .then(res => res.json())
        .then(data => {
            sunRS[0].innerText = data['astronomy']['astro']['sunrise'];
            sunRS[1].innerText = data['astronomy']['astro']['sunset'];
        })
}

timeConversion = (time) => {
    let res;
    if (time == 12) {
        res = time + "\nPM";
    }
    else if (time == 24) {
        res = time + '\nAM';
    }
    else if (time == 0) {
        res = '12 AM';
    }
    else if (time < 12) {
        res = time + '\nAM';
    }
    else {
        res = time % 12 + '\nPM';
    }
    return res;
}

let weekDayTransform = document.querySelectorAll('.week-day');
weekDayTransform[0].addEventListener('click', function () {
    weekDayTransform[3].style.setProperty("display", "none", "important");
    weekDayTransform[1].style.opacity = '0.6';
    weekDayTransform[2].style.setProperty("display", "flex", "important");
    weekDayTransform[0].style.opacity = '1';
})

weekDayTransform[1].addEventListener('click', function () {
    weekDayTransform[2].style.setProperty("display", "none", "important");
    weekDayTransform[0].style.opacity = '0.6';
    weekDayTransform[3].style.setProperty("display", "flex", "important");
    weekDayTransform[1].style.opacity = '1';
})

let auto_cls = document.getElementById('autoCompleteTemplate');

const autoComplete = () => {
    let val = document.getElementById('search-text').value;
    let loop_var;
    console.log(val.length)
    if (val.length >= 3) {
        auto_cls.style.display = 'block';
        fetch(`http://api.weatherapi.com/v1/search.json?key=2e237ee7d07f4ce3ab2145012232604&q=${val}`)
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    auto_cls.innerText = "";
                }
                loop_var = data.length;

                for (let n = 0; n < loop_var; n++) {
                    const search_temp = `
          <div class="search-cards auto-comp mb-2 p-1">
          <span class="m-0" style="font-size: 16px;font-weight: 500;">
              ${data[n]['name']}
          </span>
          <span class="m-0" style="font-size: 10px; font-weight: 500;">
              ${data[n]['region']},${data[n]['country']}
              </span>
          </div>
          `;
                    auto_cls.innerHTML += search_temp;
                }
                const searchCards = document.querySelectorAll('.search-cards');
                searchCards.forEach(card => {
                    card.onclick = () => {
                        document.getElementById('search-text').value = card.querySelector('span').textContent.trim();
                        auto_cls.style.display = 'none';
                        searchedLoaction = card.querySelector('span').textContent.trim();
                        search(card.querySelector('span').textContent.trim());

                    }
                })
            })
    }
    if (val.length < 3) {
        auto_cls.innerText = "No area found!";
    }
}

const dtDisplay = () => {
    const AP = (d.getHours() >= 12) ? 'PM' : 'AM';
    let t;
    if (d.getHours() == 0) {
        t = 12;
    }
    else if (d.getHours() <= 12) {
        t = d.getHours();
    }
    else {
        t = d.getHours() % 12;
    }
    dateTimeDisplay[0].innerHTML = `${("00" + t).slice(-2)}:${("00" + d.getMinutes()).slice(-2)} ${AP} `;
    //dateTimeDisplay[0].innerHTML = d.toLocaleTimeString();

    dateTimeDisplay[1].innerHTML = day[d.getDay()] + ', ' + d.getDate() + ' ' + month[d.getMonth()] + ', ' + d.getFullYear();
    const hour = d.getHours();
    if (hour >= 5 && hour < 12) {
        dateTimeDisplay[2].innerHTML = "Good morning!";
    } else if (hour >= 12 && hour < 18) {
        dateTimeDisplay[2].innerHTML = "Good afternoon!";
    } else if (hour >= 18 && hour < 22) {
        dateTimeDisplay[2].innerHTML = "Good evening!";
    } else {
        dateTimeDisplay[2].innerHTML = "Good night!";
    }
}
setInterval(dtDisplay, 5000);

const locationDetect = () => {
    document.getElementById('autoDetectLoading').style.display = 'block';
    fetch('http://ip-api.com/json')
        .then(response => response.json())
        .then(data => {
            console.log(data.city);
            searchedLoaction = data.city;
            search(data.city);
        })
}

const newsContent = () => {
    const newsC = document.getElementById('news-temp');

    const apiKey = '4347232e588b43a0b8474309231410';
    const url = `https://newsapi.org/v2/everything?q=weather&apiKey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < 20; i++) {
                const tmpl = `
        <div class="news-template mb-2 px-2 py-1" >
        <b><p class="mb-1" style='color: #2D4A86;' >
            ${data.articles[i]['title']}
        </p></b>
        <p class="m-0" style="font-size: 12px;">
        ${data.articles[i]['publishedAt'].split('T')[0]}
        </p>
        <p class="d-none">${i}</p>
    </div>
        `;
                newsC.innerHTML += tmpl;
            }
            const newsCard = document.querySelectorAll('.news-template');
            const y = document.querySelectorAll('.news');
            console.log("---->", newsCard);
            newsCard.forEach(card => {
                card.onclick = () => {
                    newsOverlay.style.display = 'block';
                    let nI = Number(card.textContent.split('\n')[7].trim());
                    y[0].innerText = data.articles[nI]['title'];
                    y[1].innerText = data.articles[nI]['description'];
                    y[2].setAttribute('src', data.articles[nI]['urlToImage']);
                    y[3].innerText = data.articles[nI]['content'];
                    y[4].setAttribute('href', data.articles[nI]['url']);
                    y[5].innerText = data.articles[nI]['source']['name'];
                }
            })
        })
}

const closeNews = () => {
    newsOverlay.style.display = 'none';
}

const refresh = () => {
    document.getElementById('autoDetectLoading').style.display = 'block';
    setTimeout(Notrefresh, 1000);
}

const Notrefresh = () => {
    search(searchedLoaction);
    document.getElementById('autoDetectLoading').style.display = 'none';
}

const displayUVRec = () => {
    document.querySelector('.uv-rec').style.display = 'block';
}

const noneUVRec = () => {
    document.querySelector('.uv-rec').style.display = 'none';
}
let wAlert = document.getElementById('walert-display');
const weatherAlert = () => {
    document.getElementById('autoDetectLoading').style.display = 'block';
    setTimeout(waDisplay, 1000);

}

const waDisplay = () => {
    document.getElementById('autoDetectLoading').style.display = 'none';
    wAlert.style.display = 'block';
}

const closeWA = () => {
    wAlert.style.display = 'none';
}
