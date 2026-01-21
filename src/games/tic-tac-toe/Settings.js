import { Cookies } from "../../common/cookies.js";

const SETTINGS_KEY = "manyGames_settings";

const DEFAULT_SETTINGS = {
	player2Name: "",
	xColor: "#e74c3c",
	oColor: "#3498db",
	bestOf: 1,
	keyboardScheme: "numpad",
};

export class Settings {
	constructor() {

		this.load();
	}

	load() {
		const saved = Cookies.getJSON(SETTINGS_KEY);
		this._settings = saved
			? { ...DEFAULT_SETTINGS, ...saved }
			: { ...DEFAULT_SETTINGS };
		this._applyColors();
	}

	save() {
		Cookies.setJSON(SETTINGS_KEY, this._settings);
	}


	getAll() {
		return { ...this._settings };
	}

	/**
	 * Update multiple settings
	 * @param {Object} updates
	 */
	update(updates) {
		const oldXColor = this._settings.xColor;
		const oldOColor = this._settings.oColor;

		this._settings = { ...this._settings, ...updates };

		if (updates.xColor !== oldXColor || updates.oColor !== oldOColor) {
			this._applyColors();
		}

		this.save();
	}

	get xColor() {
		return this._settings.xColor;
	}

	set xColor(value) {
		this._settings.xColor = value;
		this._applyColors();
		this.save();
	}

	get oColor() {
		return this._settings.oColor;
	}

	set oColor(value) {
		this._settings.oColor = value;
		this._applyColors();
		this.save();
	}

	get keyboardScheme() {
		return this._settings.keyboardScheme;
	}

	set keyboardScheme(value) {
		this._settings.keyboardScheme = value;
		this.save();
	}

	/**
	 * Reset to defaults
	 */
	reset() {
		this._settings = { ...DEFAULT_SETTINGS };
		this._applyColors();
		this.save();
	}

	/**
	 * Apply X/O colors to CSS custom properties
	 * @private
	 */
	_applyColors() {
		document.documentElement.style.setProperty(
			"--x-color",
			this._settings.xColor
		);
		document.documentElement.style.setProperty(
			"--o-color",
			this._settings.oColor
		);
	}
}
