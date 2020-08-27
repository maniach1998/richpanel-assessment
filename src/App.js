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

const ForecastCards = () => {
	const items = Array(5).fill({
		day: 'Sat',
		max: '29°',
		min: '21°',
		weather: 'Sunny',
	});
	return (
		<div className='flex justify-evenly justify-center items-center py-3'>
			{items.map(({ day, max, min, weather }, index) => (
				<div
					key={index}
					className='border px-1 sm:px-3 md:px-6 md:py-3 lg:px-10 lg:py-6'>
					<div className='flex-auto text-center px-2 md:p-0'>
						<div className='font-semibold mt-2 text-sm md:text-lg'>
							{day}
						</div>
						<div className='text-sm md:text-lg'>
							<span className='font-semibold mr-2'>{max}</span>
							{min}
						</div>
						<div className='flex justify-center'>
							<img
								src='images/sun.svg'
								alt='weather condition'
								className='w-8 md:w-12 lg:w-16 mt-2'
							/>
						</div>
						<div className='my-2 text-gray-600 text-sm md:text-lg'>
							{weather}
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

const DetailCard = () => {
	const data = [
		{
			name: 'Page A',
			uv: 4000,
			pv: 2400,
			amt: 2400,
		},
		{
			name: 'Page B',
			uv: 3000,
			pv: 1398,
			amt: 2210,
		},
		{
			name: 'Page C',
			uv: 2000,
			pv: 9800,
			amt: 2290,
		},
		{
			name: 'Page D',
			uv: 2780,
			pv: 3908,
			amt: 2000,
		},
		{
			name: 'Page E',
			uv: 1890,
			pv: 4800,
			amt: 2181,
		},
		{
			name: 'Page F',
			uv: 2390,
			pv: 3800,
			amt: 2500,
		},
		{
			name: 'Page G',
			uv: 3490,
			pv: 4300,
			amt: 2100,
		},
	];
	return (
		<div className='border shadow-xl rounded p-4'>
			<div className='flex items-center content-center justify-start'>
				<div className='text-6xl font-extrabold mr-4'>26°C</div>
				<div>
					<img
						src='images/sun.svg'
						alt='weather condition'
						className='w-16'
					/>
				</div>
			</div>

			<div className='p-8'>
				<ResponsiveContainer width='100%' height={250}>
					<AreaChart data={data}>
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
						<XAxis />
						<YAxis hide />
						<CartesianGrid horizontal={false} />
						<Tooltip />
						<Area
							type='monotone'
							dataKey='uv'
							stroke='#7bbae8'
							fillOpacity={1}
							fill='url(#colorUv)'
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>

			<div className='flex justify-center justify-center p-2 md:p-4'>
				<div className='w-1/2 bg-gray-200 rounded mr-6 px-4 py-4 md:px-4 md:py-6 text-left'>
					<div className='font-extrabold text-lg md:text-xl'>
						Pressure
					</div>
					<div className='font-light text-lg md:text-xl mt-2'>
						1013 hpa
					</div>
				</div>
				<div className='w-1/2 bg-gray-200 rounded ml-6 px-4 py-4 md:px-4 md:py-6 text-left'>
					<div className='font-extrabold text-lg md:text-xl'>
						Humidity
					</div>
					<div className='font-light text-lg md:text-xl mt-2'>
						93 %
					</div>
				</div>
			</div>

			<div className='flex justify-between justify-center p-4'>
				<div className='text-left'>
					<div className='font-extrabold md:text-lg'>Sunrise</div>
					<div className='md:text-lg'>7:22am</div>
				</div>
				<div className='text-right'>
					<div className='font-extrabold md:text-lg'>Sunset</div>
					<div className='md:text-lg'>6:12pm</div>
				</div>
			</div>
		</div>
	);
};

const SearchBar = () => {
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
						console.log(result);
						const { lat, lng } = await getLatLng(result[0]);
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
	// return <div></div>;
};

const App = () => {
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
		libraries,
	});

	if (loadError) return <div>Error loading maps</div>;
	if (!isLoaded) return <div>Loading Maps</div>;

	return (
		<div className='container mx-auto md:px-12 lg:px-16 xl:px-20'>
			<div className='p-4 flex justify-center'>
				<SearchBar />
			</div>
			<div>
				<ForecastCards />
			</div>
			<div className='p-4'>
				<DetailCard />
			</div>
		</div>
	);
};

export default App;
