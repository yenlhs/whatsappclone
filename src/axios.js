import axios from 'axios'

const instance = axios.create({
	// baseURL: 'http://localhost:5001/translatorapi-1344d/australia-southeast1/api',
	// baseURL: 'https://australia-southeast1-translatorapi-1344d.cloudfunctions.net/api', // API url from cloud function
	// baseURL: 'http://localhost:9000',
	baseURL: 'https://transmate-api-mern.herokuapp.com',
});

export default instance;
