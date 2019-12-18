
export const parent = function parent(node, parent) {
	parent = parent.toLowerCase();

	while((node = node.parentNode) != null) {
		if(node.nodeName.toLowerCase() === parent) {
			return node;
		}
	}

	return null;
}