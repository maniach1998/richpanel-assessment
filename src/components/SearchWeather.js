import React from 'react';
import axios from 'axios';
import _ from 'underscore';

const SearchWeather = ({ data }) => {
	const [location, setLocation] = React.useState([]);
	const [details, setDetails] = React.useState({});
	const [unavailable, setUnavailable] = React.useState(false);

	React.useEffect(() => {
		setLocation(data.split(',').map((item) => item.trim()));
	}, [data]);

	React.useEffect(() => {
		async function fetchData() {
			if (_.isEmpty(location)) {
			} else {
				axios
					.post(
						`https://api.openweathermap.org/data/2.5/weather?q=${
							location[0]
						},${location[location.length - 1]}&units=metric&appid=${
							process.env.REACT_APP_WEATHER_API_KEY
						}`
					)
					.then((res) => {
						const { main, weather } = res.data;
						setDetails({
							temp: main.temp,
							weather: weather[0].main,
							icon: weather[0].icon,
						});
					})
					.catch((err) => {
						console.log(err);
						if (err.response.status === 404) {
							setUnavailable(true);
						}
					});
			}
		}

		fetchData();
	}, [location]);

	if (_.isEmpty(location)) return <div></div>;
	if (unavailable) return <div></div>;

	return (
		<>
			<div className='text-right'>
				<div className='text-xs md:text-sm font-bold'>
					{Math.round(details.temp)}°C
				</div>
				<div className='text-xs text-gray-600'>{details.weather}</div>
			</div>
			<div className='flex-shrink-0'>
				<img
					src={`images/${details.icon}.svg`}
					className='w-6 md:w-8 lg:w-10 mt-2 ml-1 md:ml-2'
					alt='daily weather'
				/>
			</div>
		</>
	);
};

export default SearchWeather;
