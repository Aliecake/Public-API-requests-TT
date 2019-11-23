const gallery = document.getElementById(`gallery`);

// reusable async/await
async function fetchData(url) {
	const res = await fetch(url);
	const data = await res.json();
	return data;
}

// IIFE Immediately invokes async fetch
(async function fetchUsers() {
	const allUsers = await fetchData(`https://randomuser.me/api/?results=12`);
	// .then
	createCard(allUsers.results);
	createModalContainer();
	createModal(allUsers.results);
})();

function createCard(users) {
	users.forEach(user => {
		const html = `
		<div class="card-img-container">
			<img class="card-img" src="${user.picture.thumbnail}" alt="profile picture of ${user.name.first} ${user.name.last}">
		</div>
		<div class="card-info-container">
			<h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
			<p class="card-text">${user.email}</p>
			<p class="card-text cap">${user.location.city}, ${user.location.state}</p>
		</div>

		`;
		const div = document.createElement(`div`);
		div.className = `card`;
		div.innerHTML += html;
		gallery.appendChild(div);
		//* *Not working, Help! */
		div.addEventListener(`click`, e => console.log(`ggggg`));
	});
}

// creating modal container, aria labels added for accessibility
function createModal(users) {
	const modalContainer = document.getElementsByClassName(`modal-container`)[0];
	users.forEach(user => {
		const html = `
			<div class="modal" id="${user.login.uuid}">
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
		</div>
		<div class="modal-btn-container">
		<button type="button" id="modal-prev" class="modal-prev btn">
		  Prev
		</button>
		<button type="button" id="modal-next" class="modal-next btn">
		  Next
		</button>
	  </div>
		`;
		modalContainer.innerHTML += html;
	});
}

// /////Helper functions
function birthdayFormatChange(timestamp) {
	const birthday = new Date(timestamp);
	return `${birthday.getMonth() + 1}/${birthday.getDate()}/${birthday.getFullYear()}`;
}

function createModalContainer() {
	const html = `
	<div class="modal-container" tabindex="-1" aria-labelledby="Modal" aria-hidden="true">
	</div>
	`;
	gallery.innerHTML += html;
}

// close button for modal card
gallery.addEventListener(`click`, e => {
	if (e.target.parentNode.id === `modal-close-btn`) {
		// modal container
		e.target.parentNode.parentNode.parentNode.style.display = `none`;
	}
});

// gallery.addEventListener(`click`, e => {
// 	const cardsNodelList = document.querySelectorAll('[class^=card]');
// 	cardsNodelList.forEach(cardPart => {
// 		if (e.target === cardPart) {
// 			console.log(cardsNodelList);
// 		}
// 	});
// });
