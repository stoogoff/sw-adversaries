
export default class Tab {
	constructor(character, tabName) {
		this.character = character;
		this.tabName = tabName || character.name;
		this.colour = null;
	}
}