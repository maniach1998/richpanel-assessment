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
} from '@reach/combobox';

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
				className='location w-6'
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
				<ComboboxPopover>
					<ComboboxList>
						{status === 'OK' &&
							data.map(({ id, description }) => (
								<ComboboxOption key={id} value={description} />
							))}
					</ComboboxList>
				</ComboboxPopover>
			</Combobox>
			<img
				src='images/search.svg'
				alt='search icon'
				className='search-icon w-6'
			/>
		</div>
	);
};

export default SearchBar;
