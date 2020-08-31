import React from 'react';
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
	ComboboxOptionText,
} from '@reach/combobox';
import SearchWeather from './SearchWeather';

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
			<img
				src='images/location.svg'
				alt='location icon'
				className='location w-4 md:w-6 mt-1 md:mt-0'
			/>
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
					className='rounded-lg shadow-lg focus:shadow-outline focus:outline-none focus:border-blue-400'
					placeholder='Enter an address'
				/>
				<ComboboxPopover className='rounded shadow-xl border-0'>
					<ComboboxList className='divide-y divide-gray-400'>
						{status === 'OK' &&
							data.map(({ id, description }) => (
								<ComboboxOption key={id} value={description}>
									<div className='flex justify-between items-center py-2'>
										<div className='flex-1'>
											<ComboboxOptionText />
										</div>
										<div className='flex flex-initial items-center'>
											<SearchWeather data={description} />
										</div>
									</div>
								</ComboboxOption>
							))}
					</ComboboxList>
				</ComboboxPopover>
			</Combobox>
			<img
				src='images/search.svg'
				alt='search icon'
				className='search-icon w-4 md:w-6 mt-1 md:mt-0'
			/>
		</div>
	);
};

export default SearchBar;
