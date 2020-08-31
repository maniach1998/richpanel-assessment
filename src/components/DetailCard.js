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
import moment from 'moment';
import _ from 'underscore';

const DetailCard = ({ data, graph, details, currentDay, currentGraph }) => {
	const { sunrise, sunset } = details;

	if (_.isEmpty(data))
		return (
			<div className='flex justify-center items-center py-3'>
				<div className='text-xl font-semibold'>Loading...</div>
			</div>
		);

	return (
		<div className='border shadow-xl rounded p-4'>
			<div className='flex items-center content-center justify-start'>
				<div className='text-6xl font-extrabold mr-4'>
					{currentDay ? Math.round(currentDay.main.temp) : ''}°C
				</div>
				<div>
					<img
						src={`images/${
							currentDay ? currentDay.weather.icon : '01d'
						}.svg`}
						alt='weather condition'
						className='w-16'
					/>
				</div>
			</div>

			<div className='p-2'>
				{!_.isEmpty(graph) && (
					<ResponsiveContainer width='100%' height={350}>
						<AreaChart data={currentGraph.data}>
							<defs>
								<linearGradient
									id='colorUv'
									x1='0'
									y1='0'
									x2='0'
									y2='1'>
									<stop
										offset='0%'
										stopColor='#7bbae8'
										stopOpacity={0.8}
									/>
									<stop
										offset='60%'
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
				)}
			</div>

			<div className='flex justify-center justify-center p-2 md:p-4'>
				<div className='w-1/2 bg-gray-200 rounded mr-6 px-4 py-4 md:px-4 md:py-6 text-left'>
					<div className='font-extrabold text-base md:text-xl'>
						Pressure
					</div>
					<div className='font-light text-base md:text-xl mt-2'>
						{currentDay ? currentDay.main.pressure : ''} hpa
					</div>
				</div>
				<div className='w-1/2 bg-gray-200 rounded ml-6 px-4 py-4 md:px-4 md:py-6 text-left'>
					<div className='font-extrabold text-base md:text-xl'>
						Humidity
					</div>
					<div className='font-light text-base md:text-xl mt-2'>
						{currentDay ? currentDay.main.humidity : ''} %
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

export default DetailCard;
