export const mathHandlebarsHelper = (val1, operator, val2, options) => {
	const operators = {
		'+': Number(val1) + Number(val2),
		'-': Number(val1) - Number(val2)
	};

	if (operators.hasOwnProperty(operator)) {
		return options.fn(this);
	}
	return console.error(`Error: Expression "${operator}" not found`);
};
