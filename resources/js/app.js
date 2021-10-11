// select el
const country_name_element = document.querySelector(".country .name");
const total_cases_element = document.querySelector(".total-cases .value");
const new_cases_element = document.querySelector(".total-cases .new-value");
const deaths_element = document.querySelector(".deaths .value");
const new_deaths_element = document.querySelector(".deaths .new-value");

const ctx = document.getElementById("axes_line_chart").getContext("2d");
const ctx2 = document.getElementById("axes_line_chart2").getContext("2d");

// variables
let app_data = [],
	cases_list = [],
	recovered_list = [],
	deaths_list = [],
	deaths = [],
	formatedDates = [];
let user_country;
// user country
fetch("https://api.ipgeolocation.io/ipgeo?apiKey=14c7928d2aef416287e034ee91cd360d")
	.then((res) => {
		return res.json();
	})
	.then((data) => {
		let country_code = data.country_code2;
		//let user_country;
		country_list.forEach((country) => {
			if (country.code == country_code) {
				user_country = country.name;
			}
		});
		fetchData(user_country);
	});

/* ---------------------------------------------- */
/*                     FETCH API                  */
/* ---------------------------------------------- */
function fetchData(country) {
	user_country = country;
	country_name_element.innerHTML = "Loading...";

	(cases_list = []),

		(deaths_list = []),
		(dates = []),
		(formatedDates = []);

	var requestOptions = {
		method: "GET",
		redirect: "follow",
	};

	const api_fetch = async (country) => {
		await fetch(
			"https://api.covid19api.com/total/country/" + country + "/status/confirmed"
			, requestOptions
		)
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				data.forEach((entry) => {
					dates.push(entry.Date);
					cases_list.push(entry.Cases);
				});
			});

		await fetch(
			"https://api.covid19api.com/total/country/" + country + "/status/deaths"
			, requestOptions
		)
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				data.forEach((entry) => {
					deaths_list.push(entry.Cases);
				});
			});

		updateUI();
	};
	api_fetch(country);
}

// Update ui
function updateUI() {
	updateStats();
	axesLinearChart();
	axesLinearChart2();
}

function updateStats() {
	const total_cases = cases_list[cases_list.length - 1];
	const new_confirmed_cases = total_cases - cases_list[cases_list.length - 2];

	const total_deaths = deaths_list[deaths_list.length - 1];
	const new_deaths_cases = total_deaths - deaths_list[deaths_list.length - 2];

	country_name_element.innerHTML = user_country;
	total_cases_element.innerHTML = total_cases;
	new_cases_element.innerHTML = `+${new_confirmed_cases}`;
	deaths_element.innerHTML = total_deaths;
	new_deaths_element.innerHTML = `+${new_deaths_cases}`;

	// format dates
	dates.forEach((date) => {
		formatedDates.push(formatDate(date));
	});
}

// Update chart
let my_chart;
let my_chart2;
function axesLinearChart() {
	if (my_chart) {
		my_chart.destroy();
	}
	my_chart = new Chart(ctx, {
		type: "line",
		data: {
			datasets: [
				{
					label: "Cases",
					data: cases_list,
					fill: false,
					borderColor: "#FFF",
					backgroundColor: "#FFF",
					borderWidth: 0.4,
				}
			],
			labels: formatedDates,
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
		},
	});
	if (my_chart2) {
		my_chart2.destroy();
	}
	my_chart2 = new Chart(ctx2, {
		type: "line",
		data: {
			datasets: [
				{
					label: "Deaths",
					data: deaths_list,
					fill: false,
					borderColor: "#f44336",
					backgroundColor: "#f44336",
					borderWidth: 0.4,
				}
			],
			labels: formatedDates,
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
		},
	});
}

// function axesLinearChart2() {
// 	if (my_chart) {
// 		my_chart.destroy();
// 	}
// 	my_chart = new Chart(ctx2, {
// 		type: "line",
// 		data: {
// 			datasets: [
// 				{
// 					label: "Deaths",
// 					data: deaths_list,
// 					fill: false,
// 					borderColor: "#f44336",
// 					backgroundColor: "#f44336",
// 					borderWidth: 0.4,
// 				}
// 			],
// 			labels: formatedDates,
// 		},
// 		options: {
// 			responsive: true,
// 			maintainAspectRatio: false,
// 		},
// 	});
// }

// date formate
const monthsNames = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

function formatDate(dateString) {
	let date = new Date(dateString);
	return `${date.getDate()} ${monthsNames[date.getMonth()]}`;
}
