// console.log('Client side javascript file is loaded')

// Fetch API -> Available to most modern-day browser
// Browser-based API -> Cannot be used with backend JS
// Is not accessible to Node.js (Backend)

// fetch(url).then (callback func)
/* fetch('http://puzzle.mead.io/puzzle').then((response) => {

    // Callback function runs after the data has been 'parsed'
    // data -> parsed 'JSON'
    response.json().then( (data) => {
        console.log(data)
    })
}) */


const weatherForm = document.querySelector('form')
const searchLoc = document.querySelector('input')
const msgTitle = document.querySelector('#msg-title')
const msgBody = document.querySelector('#msg-body')

// msgTitle.textContent = ''

weatherForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const location = searchLoc.value // Input Value
    const address = 'http://localhost:3000/weather?address=' + encodeURIComponent(location)

    msgTitle.textContent = 'Loading...'
    msgBody.textContent = ''

    fetch(address).then( (response) => {
        response.json().then( (data) => {
            if(data.error) {
                msgTitle.textContent = 'Error!'
                msgBody.textContent = data.error
            } else {
                msgTitle.textContent = data.location
                const displayMsg = data.desc + '. \nIt is ' + data.temp + ' degree Celsius. Feels like ' + data.appTemp + ' degrees. There is a ' + data.precip + '% chance of rain.'
                msgBody.textContent = displayMsg
            }
        })
    })
})