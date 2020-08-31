import days from './days';

export default (data) => {
	const extraDay = days.filter((x) => !Object.keys(data).includes(x))[0];
	let parsed = Object.entries(data).map((item) => {
		return {
			day: item[0],
			main: item[1][0].main,
			weather: item[1][0].weather[0],
		};
	});
	parsed.push({ ...parsed[0], day: extraDay });

	return parsed;
};
