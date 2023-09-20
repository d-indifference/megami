const buildPgAdminLink = () => {
	const url = new URL(window.location.href);

	return `${url.protocol}//${url.hostname}:5050`;
};

const setPgAdminLink = () => {
	const linkBtn = document.querySelector('#pgAdminLink');

	linkBtn.setAttribute('href', buildPgAdminLink());
};

setPgAdminLink();
