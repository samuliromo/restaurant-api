const express = require('express');
const router = express.Router();
const data = require('../../data.json');

router.get('/', (req, res, next) => {
  res.status(200).json(data.restaurants);
})

router.get('/search', (req, res, next) => {
  if (req.query.q.length < 1) return res.status(422).json({message: 'query is too short'});
  let [lat, lon] = [req.query.lat, req.query.lon];

  restaurants = data.restaurants
  .filter(restaurant => wordFilter(restaurant, req.query.q))
  .filter(restaurant => countDistance(lat,lon,restaurant.location[1],restaurant.location[0]) <= 3);

  res.status(200).json(restaurants)
})

const wordFilter = (element, word) => {
  let lower = word.toLowerCase()
  if (element.name.toLowerCase().includes(lower) || 
      element.description.toLowerCase().includes(lower) ||
      element.tags.map(tag => tag.toLowerCase()).includes(lower)) {
        return element
      }
}

const countDistance = (lat1, lon1, lat2, lon2) => {
    let radlat1 = Math.PI * lat1/180;
		let radlat2 = Math.PI * lat2/180;
		let theta = lon1-lon2;
		let radtheta = Math.PI * theta/180;
		let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.853159616;
		return dist;
}

module.exports = router;