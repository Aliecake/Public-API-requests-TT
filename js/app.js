const gallery = document.getElementById(`gallery`);
// change employee count as needed.
const currentEmployeeCount = 12;

// reusable async/await
async function fetchData(url) {
	try {
		const res = await fetch(url);
		const data = await res.json();
		return data;
	} catch (err) {
		throw err;
	}
}

// IIFE Immediately invokes async fetch
(async function fetchUsers() {
	const allUsers = await fetchData(`https://randomuser.me/api/?results=${currentEmployeeCount}&nat=us,au,gb,ca`);
	// .then
	createCard(allUsers.results);
	createModalContainer();
	createModal(allUsers.results);
	createSearchBox();
})();

function createCard(users) {
	users.forEach((user, ii) => {
		const html = cardHTML(user);
		const div = document.createElement(`div`);
		div.className = `card`;
		div.innerHTML += html;
		div.addEventListener(`click`, e => modalPopup(ii));
		gallery.appendChild(div);
	});
}

// creating modal container, aria labels added for accessibility
function createModal(users) {
	const modalContainer = document.getElementsByClassName(`modal-container`)[0];
	users.forEach((user, i) => {
		const div = document.createElement(`div`);
		const html = modalHTML(user);
		div.className = `modal`;
		div.innerHTML += html;
		modalContainer.appendChild(div);
		nextPrevButtonHandlers(users, i);
	});
}

function createModalContainer() {
	const div = document.createElement(`div`);
	div.className = `modal-container`;
	div.setAttribute(`tabindex`, `-1`);
	div.setAttribute(`aria-labelledby`, `Modal`);
	div.setAttribute(`aria-hidden`, `true`);
	gallery.appendChild(div);
}
function createSearchBox() {
	const searchContainer = document.getElementsByClassName(`search-container`)[0];

	const div = document.createElement(`div`);
	const form = document.createElement(`form`);

	const html = `
			<input type="search" id="search-input" class="search-input" placeholder="Search...">
			<input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
	`;
	form.setAttribute(`action`, `#`);
	form.setAttribute(`method`, `GET`);
	form.innerHTML = html;
	// both listeners included to prevent bugs (ie if user is using speech to text)
	form.addEventListener(`keyup`, e => search(e));
	form.addEventListener(`click`, e => search(e));
	div.appendChild(form);
	searchContainer.appendChild(div);
}

function birthdayFormatChange(timestamp) {
	const birthday = new Date(timestamp);
	return `${birthday.getMonth() + 1}/${birthday.getDate()}/${birthday.getFullYear()}`;
}
// Modal can be displayed when clicked
function modalPopup(ii) {
	const modals = document.getElementsByClassName(`modal-container`)[0];
	const currentUser = [...modals.children][ii];

	modals.style.display = `block`;
	// remove any previous shown modal.
	[...modals.children].forEach(child => {
		child.style.display = `none`;
	});
	currentUser.style.display = `block`;
}

function nextPrevButtonHandlers(users, i) {
	const buttons = [...document.getElementsByClassName(`modal-btn-container`)][i];

	const prev = [...buttons.children][0];
	const next = [...buttons.children][1];

	if (i === 0) {
		// allows return of last/first in array, regardless of length. More employees can be added.
		prev.addEventListener(`click`, e => modalPopup(users.length + (i % users.length) - 1));
		next.addEventListener(`click`, e => modalPopup((i + 1) % users.length));
	} else {
		prev.addEventListener(`click`, e => modalPopup(i - 1));
		next.addEventListener(`click`, e => modalPopup((i + 1) % users.length));
	}
}
function search(e) {
	e.preventDefault();
	const input = document.getElementById(`search-input`);
	const searchVal = input.value.toLowerCase();

	const cards = [...document.getElementsByClassName(`card-name`)];
	const filteredCards = cards.filter(card => card.innerText.toLowerCase().includes(searchVal));
	// display or not display results of keyup/search
	cards.forEach(card => {
		if (filteredCards.includes(card)) {
			card.closest(`.card`).style.display = `block`;
		} else {
			card.closest(`.card`).style.display = `none`;
		}
	});
}
// close button for modal card
gallery.addEventListener(`click`, e => {
	if (e.target.parentNode.id === `modal-close-btn`) {
		e.target.closest(`.modal`).style.display = `none`;
		e.target.closest(`.modal-container`).style.display = `none`;
	}
});

function cardHTML(user) {
	return `
	<div class="card-img-container">
		<img class="card-img" src="${user.picture.thumbnail}" alt="profile picture of ${user.name.first} ${user.name.last}">
	</div>
	<div class="card-info-container">
		<h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
		<p class="card-text">${user.email}</p>
		<p class="card-text cap">${user.location.city}, ${user.location.state}</p>
	</div>
	`;
}

function modalHTML(user) {
	return `
	<button type="button" id="modal-close-btn" class="modal-close-btn">
		<strong>X</strong>
	</button>
	<div class="modal-info-container">
		<img
		class="modal-img"
		src="${user.picture.medium}"
		alt="profile picture of ${user.name.first} ${user.name.last}"
		/>
		<h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
		<p class="modal-text">${user.email}</p>
		<p class="modal-text cap">${user.location.city}</p>
		<hr />
		<p class="modal-text">${user.phone}</p>
		<p class="modal-text">
			${user.location.street.number} ${user.location.street.name},
			${user.location.city}, ${user.location.state} ${user.location.postcode}
			${user.location.country}</p>
		<p class="modal-text">Birthday: ${birthdayFormatChange(user.dob.date)}</p>
	</div>
	<div class="modal-btn-container">
		<button type="button" id="modal-prev" class="modal-prev btn"> Prev </button>
		<button type="button" id="modal-next" class="modal-next btn"> Next </button>
	</div>
`;
}
