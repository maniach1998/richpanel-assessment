import React from 'react';
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import moment from 'moment';
import _ from 'underscore';

import { useLoadScript } from '@react-google-maps/api';

import usePlacesAutocomplete, {
	getGeocode,
	getLatLng,
} from 'use-places-autocomplete';
import {
	Combobox,
	ComboboxInput,
	ComboboxPopover,
	ComboboxList,
	ComboboxOption,
} from '@reach/combobox';

const libraries = ['places'];

const ForecastCards = ({ data }) => {
	const parsed = Object.entries(data)
		.map((item) => {
			return {
				day: item[0],
				main: item[1][0].main,
				weather: item[1][0].weather[0],
			};
		})
		.slice(0, 5);

	if (_.isEmpty(data))
		return (
			<div className='flex justify-center items-center py-3 text-lg font-semibold'>
				Loading...
			</div>
		);

	return (
		<div className='flex justify-evenly justify-center items-center py-3'>
			{parsed.map(({ day, main, weather }) => (
				<div
					key={day}
					className='sm:px-3 md:px-6 md:py-3 lg:px-10 lg:py-6'>
					<div className='flex-auto text-center px-1 md:p-0'>
						<div className='font-semibold mt-2 text-xs md:text-sm'>
							{day}
						</div>
						<div className='text-xs md:text-sm'>
							<span className='font-semibold mr-2'>
								{Math.round(main.temp_max)}°C
							</span>
							{Math.round(main.temp_min)}°C
						</div>
						<div className='flex justify-center'>
							<img
								src={`images/${weather.icon}.svg`}
								alt='weather condition'
								className='w-4 md:w-12 lg:w-16 mt-2'
							/>
						</div>
						<div className='my-2 text-gray-600 text-xs md:text-sm'>
							{weather.main}
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

const DetailCard = ({ data, details }) => {
	const { sunrise, sunset } = details;
	// const {} = data[0];
	const parsed = Object.entries(data)
		.map((item) => {
			return {
				day: item[0],
				main: item[1][0].main,
				weather: item[1][0].weather[0],
			};
		})
		.slice(0, 5);

	const graph = Object.entries(data).map((item) => {
		return {
			day: item[0],
			data: item[1].map((obj) => {
				return {
					temp: obj.main.temp,
					time: moment.unix(obj.dt).format('LT'),
				};
			}),
		};
	});
	console.log(graph);
	// const graph = [
	// 	{
	// 		name: 'Page A',
	// 		uv: 4000,
	// 		pv: 2400,
	// 		amt: 2400,
	// 	},
	// 	{
	// 		name: 'Page B',
	// 		uv: 3000,
	// 		pv: 1398,
	// 		amt: 2210,
	// 	},
	// 	{
	// 		name: 'Page C',
	// 		uv: 2000,
	// 		pv: 9800,
	// 		amt: 2290,
	// 	},
	// 	{
	// 		name: 'Page D',
	// 		uv: 2780,
	// 		pv: 3908,
	// 		amt: 2000,
	// 	},
	// 	{
	// 		name: 'Page E',
	// 		uv: 1890,
	// 		pv: 4800,
	// 		amt: 2181,
	// 	},
	// 	{
	// 		name: 'Page F',
	// 		uv: 2390,
	// 		pv: 3800,
	// 		amt: 2500,
	// 	},
	// 	{
	// 		name: 'Page G',
	// 		uv: 3490,
	// 		pv: 4300,
	// 		amt: 2100,
	// 	},
	// ];

	if (_.isEmpty(data))
		return (
			<div className='flex justify-center items-center py-3 text-lg font-semibold'>
				Loading...
			</div>
		);

	return (
		<div className='border shadow-xl rounded p-4'>
			<div className='flex items-center content-center justify-start'>
				<div className='text-6xl font-extrabold mr-4'>
					{Math.round(parsed[0].main.temp)}°C
				</div>
				<div>
					<img
						src={`images/${parsed[0].weather.icon}.svg`}
						alt='weather condition'
						className='w-16'
					/>
				</div>
			</div>

			<div className='p-2'>
				<ResponsiveContainer width='100%' height={250}>
					<AreaChart data={graph[1].data}>
						<defs>
							<linearGradient
								id='colorUv'
								x1='0'
								y1='0'
								x2='0'
								y2='1'>
								<stop
									offset='25%'
									stopColor='#7bbae8'
									stopOpacity={0.6}
								/>
								<stop
									offset='100%'
									stopColor='#7bbae8'
									stopOpacity={0}
								/>
							</linearGradient>
						</defs>
						<XAxis dataKey='time' />
						<YAxis hide />
						<CartesianGrid horizontal={false} />
						<Tooltip />
						<Area
							type='monotone'
							dataKey='temp'
							stroke='#7bbae8'
							fillOpacity={1}
							fill='url(#colorUv)'
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>

			<div className='flex justify-center justify-center p-2 md:p-4'>
				<div className='w-1/2 bg-gray-200 rounded mr-6 px-4 py-4 md:px-4 md:py-6 text-left'>
					<div className='font-extrabold text-base md:text-xl'>
						Pressure
					</div>
					<div className='font-light text-base md:text-xl mt-2'>
						{parsed[0].main.pressure} hpa
					</div>
				</div>
				<div className='w-1/2 bg-gray-200 rounded ml-6 px-4 py-4 md:px-4 md:py-6 text-left'>
					<div className='font-extrabold text-base md:text-xl'>
						Humidity
					</div>
					<div className='font-light text-base md:text-xl mt-2'>
						{parsed[0].main.humidity} %
					</div>
				</div>
			</div>

			<div className='flex justify-between justify-center p-4'>
				<div className='text-left'>
					<div className='font-extrabold text-sm md:text-lg'>
						Sunrise
					</div>
					<div className='font-light text-sm md:text-lg'>
						{moment.unix(sunrise).format('LT')}
					</div>
				</div>
				<div className='text-right'>
					<div className='font-extrabold text-sm md:text-lg'>
						Sunset
					</div>
					<div className='font-light text-sm md:text-lg'>
						{moment.unix(sunset).format('LT')}
					</div>
				</div>
			</div>
		</div>
	);
};

const SearchBar = ({ setPlace }) => {
	const {
		ready,
		value,
		suggestions: { status, data },
		setValue,
		clearSuggestions,
	} = usePlacesAutocomplete({
		requestOptions: {
			location: new window.google.maps.LatLng(
				parseFloat(19.07609),
				parseFloat(72.877426)
			),
			radius: 200 * 1000,
		},
	});

	return (
		<div className='search'>
			<Combobox
				onSelect={async (address) => {
					setValue(address, false);
					clearSuggestions();

					try {
						const result = await getGeocode({ address });
						const { lat, lng } = await getLatLng(result[0]);
						setPlace({ lat, lng });
					} catch (error) {
						console.log(error);
					}
				}}>
				<ComboboxInput
					value={value}
					onChange={(e) => {
						setValue(e.target.value);
					}}
					disabled={!ready}
					placeholder='Enter an address'
				/>
				<ComboboxPopover>
					<ComboboxList>
						{status === 'OK' &&
							data.map(({ id, description }) => (
								<ComboboxOption key={id} value={description} />
							))}
					</ComboboxList>
				</ComboboxPopover>
			</Combobox>
		</div>
	);
};

const App = () => {
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
		libraries,
	});

	const [place, setPlace] = React.useState({ lat: 19.0144, lng: 72.8479 });
	const [weatherData, setWeatherData] = React.useState({});
	const [extraDetails, setExtraDetails] = React.useState({});

	React.useEffect(() => {
		async function fetchData() {
			axios
				.post(
					`http://api.openweathermap.org/data/2.5/forecast?lat=${place.lat}&lon=${place.lng}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
				)
				.then((res) => {
					const groups = _.groupBy(res.data.list, function (item) {
						return moment(item.dt_txt).format('dddd');
					});
					setExtraDetails(res.data.city);
					setWeatherData(groups);
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
	if (!isLoaded) return <div>Loading Maps</div>;

	return (
		<div className='container mx-auto md:px-12 lg:px-16 xl:px-20'>
			<div className='p-4 flex justify-center'>
				<SearchBar setPlace={setPlace} />
			</div>
			<div>
				<ForecastCards data={weatherData} />
			</div>
			<div className='p-4'>
				<DetailCard data={weatherData} details={extraDetails} />
			</div>
		</div>
	);
};

export default App;
