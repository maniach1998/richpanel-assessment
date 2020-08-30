import React from 'react';
import axios from 'axios';
import moment from 'moment';
import _ from 'underscore';
import { useLoadScript } from '@react-google-maps/api';

import SearchBar from './components/SearchBar';
import ForecastCards from './components/ForecastCards';
import DetailCard from './components/DetailCard';

const libraries = ['places'];

const App = () => {
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
		libraries,
	});

	const [place, setPlace] = React.useState({ lat: 19.0144, lng: 72.8479 });
	const [weatherData, setWeatherData] = React.useState({});
	const [extraDetails, setExtraDetails] = React.useState({});
	const [selectedDay, setSelectedDay] = React.useState({});

	React.useEffect(() => {
		async function fetchData() {
			axios
				.post(
					`https://api.openweathermap.org/data/2.5/forecast?lat=${place.lat}&lon=${place.lng}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
				)
				.then((res) => {
					const groups = _.groupBy(res.data.list, function (item) {
						return moment(item.dt_txt).format('dddd');
					});
					setExtraDetails(res.data.city);
					setWeatherData(groups);
					setSelectedDay(Object.keys(groups)[0]);
				});
		}

		fetchData();
	}, [place]);

	React.useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setPlace({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				});
			},
			(error) => {
				console.log(error);
			}
		);
	}, []);

	if (loadError) return <div>Error loading application!</div>;
	if (!isLoaded)
		return (
			<div className='flex justify-center m-auto'>
				<div className='text-4xl font-bold'>Loading...</div>
			</div>
		);

	return (
		<div className='container mx-auto md:px-12 lg:px-16 xl:px-20'>
			<div className='p-4 flex justify-center'>
				<SearchBar setPlace={setPlace} />
			</div>
			<div className='flex flex-no-wrap xl:justify-evenly w-full overflow-auto'>
				<ForecastCards
					data={weatherData}
					selectedDay={selectedDay}
					setSelectedDay={setSelectedDay}
				/>
			</div>
			<div className='p-4'>
				<DetailCard
					data={weatherData}
					details={extraDetails}
					selectedDay={selectedDay}
				/>
			</div>
		</div>
	);
};

export default App;
