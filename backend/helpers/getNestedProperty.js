function getNestedProperty(obj, propPath) {
	const properties = propPath.split('.');
	return properties.reduce((acc, curr) => {
		if (acc) {
			return acc[curr];
		} else {
			return undefined;
		}
	}, obj);
}

module.exports = getNestedProperty;
