'use strict';

//dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();

// global variables
const PORT = process.env.PORT;
const GEOCODING_API_KEY = process.env.GEOCODING_API_KEY;
const DARKSKY_API_KEY = process.env.DARKSKY_API_KEY;
const EVENTFUL_API_KEY = process.env.EVENTFUL_API_KEY;
const client = new pg.Client(process.env.DATABASE_URL);
const app = express();
app.use(cors());

// ROUTES
app.get('/location', getLocation);
app.get('/weather', getWeather);
app.get('/events', getEvents);

// CONSTRUCTOR *** I haven't use constructors 
function Location(coordinates){
  this.formatted_query = coordinates.formatted_address;
  this.latitude = coordinates.geometry.location.lat;
  this.longitude = coordinates.geometry.location.lng;
}

function Weather(location){
  this.time = new Date(location.time).toDateString();
  this.forecast = location.summary;
}

// routes functions handlers
function getLocation(req, res){
  // console.log('req.query', req.query) // { data: 'lynnwood' }
  const whatTheUserSearchedFor = req.query.data;
  superagent.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${whatTheUserSearchedFor}&key=${GEOCODING_API_KEY}`).then(response => { 
  console.log('response.body', response); // Gives the Object data of the info requested

    res.send({
      'search_query': whatTheUserSearchedFor,
      'formatted_query': response.body.results[0].formatted_address,
      'latitude': response.body.results[0].geometry.location.lat,
      'longitude': response.body.results[0].geometry.location.lng
    });
  });
}

function getWeather(req, res){
  const weatherLatitude = req.query.data.latitude;
  const weatherLongitude = req.query.data.longitude
  // console.log('req.query', req.query); // Gives the info for ex. Lynnwood, description, lat and lng

  superagent.get(`https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${weatherLatitude},${weatherLongitude}`).then(response => {
    // console.log('response.body.daily.data', response.body.daily.data) // Gives me the object or array data requested 
    
    const allWeather = response.body.daily.data; 
    
    let allData = allWeather.map(event => {
      return {
        'time': new Date(event.time * 1000).toDateString(),
        'forecast': event.summary
      }
    });
    // console.log('allData', allData);
    res.send(allData);
  });
}

function getEvents(req, res){
  // console.log('req.query.data.formatted_query', req.query.data.formatted_query)
  superagent.get(`http://api.eventful.com/json/events/search?app_key=${EVENTFUL_API_KEY}&keyword=coders&location=${req.query.data.formatted_query}&date=Future`).then(response => {
    console.log(JSON.parse(response.text).events.event[0]);
    // const firstEvent = JSON.parse(response.text).events.event[0];
    const allEvents = JSON.parse(response.text).events.event;

    const allData = allEvents.map(event => {
      return {
        'link': event.url,
        'name': event.title,
        'event_date': new Date(event.start_time).toLocaleDateString(),
        'summary': event.description
      };
    });
    // console.log(allData);

    res.send(allData);

  });
}

app.listen(PORT, () => console.log(`up on port ${PORT}`));
