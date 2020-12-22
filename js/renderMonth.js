import { d, daysShort, getOffsetStart, getLastDateOfMonth } from './date.js';

import { renderHeading } from './renderHeading.js';

import { modalPopup } from './modal.js';

// Query Alias
const query = document.querySelector.bind(document);
const queryAll = document.querySelectorAll.bind(document);

// Elements
const datesContainer = query('.calendar_dates');

// Renders Month
export function renderMonth(direction = null) {
	// Heading
	renderHeading();
	// Number of rows month should have
	const numRows = getOffsetStart() + getLastDateOfMonth() > 35 ? 6 : 5;
	const numDatesTotal = numRows * 7;

	datesContainer.innerHTML = ``;

	// ADD ROWS: appropriate num of rows, 5 or 6
	for (let row = 0; row < numRows; row++) {
		datesContainer.innerHTML += `<div class="row"></row>`;
	}

	// Define after rows are added to the dom
	const rowCollection = queryAll('.row');

	// Add 7 dates to dach row
	rowCollection.forEach(row => {
		for (let x = 0; x < 7; x++) {
			row.innerHTML += `<div class="date">loading...</div>`;
		}
	});

	// Define after dates are added to the dom
	const dateCollection = queryAll('.date');

	// ADD dates
	for (let i = 0; i < numRows * 7; i++) {
		// Starts at the first index
		const date = new Date(
			d.getFullYear(),
			d.getMonth(),
			1 - getOffsetStart() + i,
		);
		// CURRENT MONTH: Add date <div>
		if (date.getMonth() === d.getMonth()) {
			// All dates
			dateCollection[
				i
			].innerHTML = `<div class="date_num" data-date="date">${date.getDate()}</div>`;
			// TODAY: date only for today
			let dateToday = new Date();
			// Adjust index -1 to get correct date
			if (
				dateToday.getDate() == i - 1 &&
				dateToday.getMonth() == date.getMonth() &&
				dateToday.getFullYear() == date.getFullYear()
			) {
				const dateNumCollection = queryAll('.date_num');
				// Add focus to "today"
				dateNumCollection[i].classList.add('today');
			}
		} else {
			// DATE BLUR: all dates not current month, either prev or next
			let dateBlur = new Date(d.getFullYear(), d.getMonth(), i - 1);
			// PREV & NEXT MONTH: add class for special styling to dates not of current month
			dateCollection[
				i
			].innerHTML = `<div class="date_num date_num--blur">${date.getDate()}</div>`;
			dateCollection[i].classList.add('date--blur');
		}
	}

	// For each date <div>, square date container
	dateCollection.forEach((date, index) => {
		// ADD: data-date attr to be able to access it
		date.setAttribute(
			'data-date',
			new Date(d.getFullYear(), d.getMonth(), index - 1),
		);
		// Create Heading for "Day Of Week" & give a value to its class attr
		const dow = document.createElement('SPAN');
		dow.classList.add('date_dow');
		dow.innerHTML = `${daysShort[index]}`;
		// Add date heading Only to first row
		if (index < 7) {
			date.prepend(dow);
		}
	});

	// ANIMATE: calendar scroll direction ('left' or 'right')
	if (direction !== null) {
		const slideDirection = `slide-${direction}`;
		rowCollection.forEach(row => {
			row.classList.add(slideDirection);
		});
	}
}

datesContainer.addEventListener('click', event => {
	if (event.target.classList.contains('date')) {
		// Task Modal Pop Up
		modalPopup(event);
	}
});
