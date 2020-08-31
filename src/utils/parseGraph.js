import moment from 'moment';
import days from './days';

export default (data) => {
	const extraDay = days.filter((x) => !Object.keys(data).includes(x))[0];
	let graph = Object.entries(data).map((item) => {
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
	graph.push({ ...graph[0], day: extraDay });

	return graph;
};
