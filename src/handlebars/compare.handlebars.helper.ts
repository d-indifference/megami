/* eslint-disable */

// Should be typed...
export const compareHandlebarsHelper = (v1, operator, v2, options) => {
	v1 = Number(v1);
	v2 = Number(v2);

	const operators = {
		'==': v1 == v2 ? true : false,
		'===': v1 === v2 ? true : false,
		'!=': v1 != v2 ? true : false,
		'!==': v1 !== v2 ? true : false,
		'>': v1 > v2 ? true : false,
		'>=': v1 >= v2 ? true : false,
		'<': v1 < v2 ? true : false,
		'<=': v1 <= v2 ? true : false,
		'||': v1 || v2 ? true : false,
		'&&': v1 && v2 ? true : false
	};

	if (operators.hasOwnProperty(operator)) {
		if (operators[operator]) {
			return options.fn(this);
		}
		return options.inverse(this);
	}
	return console.error(`Error: Expression "${operator}" not found`);
};
