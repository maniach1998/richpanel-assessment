import React from 'react';
import _ from 'underscore';

const ForecastCards = ({ data, selectedDay, setSelectedDay }) => {
	if (_.isEmpty(data))
		return (
			<div className='flex justify-center items-center py-3'>
				<div className='animate-pulse text-lg font-semibold'>
					Loading...
				</div>
			</div>
		);

	return (
		<div className='flex flex-no-wrap justify-center items-center py-3 px-3 md:px-0'>
			{data.map(({ day, main, weather }) => (
				<div
					key={day}
					className={`px-3 md:px-6 py-3 lg:px-10 lg:py-6 cursor-pointer border-2 ${
						selectedDay === day
							? 'border-blue-400 bg-yellow-100'
							: 'border-white'
					}`}
					onClick={() => setSelectedDay(day)}>
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

export default ForecastCards;
