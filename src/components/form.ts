import { IFormValid } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/component';
import { IEvents } from './base/events';

export class Form<T> extends Component<IFormValid> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('input', (events) => {
			const target = events.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this.container.addEventListener('submit', (events) => {
			events.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	render(state: Partial<T> & IFormValid) {
		const { valid = false, errors = '', ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		this.errors = errors;
		this.valid = valid;
		return this.container;
	}
}