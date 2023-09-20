const getFromCookie = cookieName => {
	const name = `${cookieName}=`;
	const decodedCookie = decodeURIComponent(document.cookie);
	const cookieArray = decodedCookie.split(';');

	for (let i = 0; i < cookieArray.length; i++) {
		const cookie = cookieArray[i].trim();
		if (cookie.indexOf(name) === 0) {
			return cookie.substring(name.length, cookie.length);
		}
	}

	return null;
};

const generatePassword = length => {
	const charset =
		'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?';
	let password = '';

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * charset.length);
		password += charset[randomIndex];
	}

	return password;
};

const setPasswordToField = (id, value) => {
	const elem = document.querySelector(`#${id}`);

	if (elem) {
		elem.value = value;
	}
};

const passwordSettingHandler = () => {
	const pwdValue = getFromCookie('megamiPass');

	if (pwdValue) {
		setPasswordToField('deletePostPassword', pwdValue);
		setPasswordToField('newReplyPassword', pwdValue);
		setPasswordToField('newThreadPassword', pwdValue);
	} else {
		const generatedPwd = generatePassword(8);

		setPasswordToField('newReplyPassword', generatedPwd);
		setPasswordToField('newThreadPassword', generatedPwd);
	}
};

const normalizeDateTimeInThread = () => {
	const DateTime = luxon.DateTime;

	const postingTimes = document.querySelectorAll('.posting-time');

	for (const postingTime of postingTimes) {
		const isoDate = new Date(postingTime.innerHTML).toISOString()
		const luxonDate = DateTime
			.fromISO(isoDate)
			.setZone(
				Intl
					.DateTimeFormat()
					.resolvedOptions()
					.timeZone
			);
		postingTime.innerHTML = luxonDate.toFormat('dd.MM.yyyy (EEE) HH:mm:ss');
	}
};

const truncateHtmlInCollapsable = () => {
	const collapsableBlocks = document.querySelectorAll('.custom-collapsable');

	for (const block of collapsableBlocks) {
		block.innerHTML = truncateHtml(block.innerHTML, 64);
	}
};

const truncateHtml = (inputHtml, maxLength) => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(inputHtml, 'text/html');
	const root = doc.body;
	let currentLength = 0;

	const traverse = node => {
		if (node.nodeType === Node.TEXT_NODE) {
			const text = node.textContent;
			const remainingChars = maxLength - currentLength;

			if (text.length <= remainingChars) {
				currentLength += text.length;
			} else {
				node.textContent = text.slice(0, remainingChars);
				currentLength = maxLength;
			}
		} else if (node.nodeType === Node.ELEMENT_NODE) {
			for (const child of node.childNodes) {
				traverse(child);
			}
		}
	};

	traverse(root);

	if (currentLength >= maxLength) {
		const ellipsisNode = doc.createTextNode('...');
		root.appendChild(ellipsisNode);
	}

	return root.innerHTML;
};

const processThreadReplyLink = () => {
	const replyInThreadModal = document.getElementById('replyInThreadModal');

	if (replyInThreadModal) {
		replyInThreadModal.addEventListener('show.bs.modal', event => {
			const textArea = document.getElementById('newReplyComment');
			textArea.value = '';

			const trigger = event.relatedTarget;
			const postNumber = trigger.dataset["postNumber"];

			textArea.value = `>>${postNumber}\r\n`;
		});
	}
};

passwordSettingHandler();
normalizeDateTimeInThread();
truncateHtmlInCollapsable();
processThreadReplyLink();
