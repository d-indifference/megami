const buildPostPermalink = postNumber =>
	`${window.location.href.split('#')[0]}#${postNumber}`;

const makeCopiedPopover = (thiz, message) => {
	const popover = new bootstrap.Popover(thiz, {
		content: message,
		placement: 'top'
	});

	popover.show();

	setTimeout(() => {
		popover.hide();
	}, 1000);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const copyPermalink = (thiz, postNumber) => {
	navigator.clipboard.writeText(buildPostPermalink(postNumber)).then(
		() => {
			makeCopiedPopover(thiz, 'Copied!');
		},
		err => {
			makeCopiedPopover(thiz, 'There is some problem... :(');
		}
	);
};
