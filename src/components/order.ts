import { IContacts, IPayment } from '../types';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './form';

export class OrderForm extends Form<IPayment> {
	protected _paymentContainer: HTMLElement;
	protected _paymentButton: HTMLButtonElement[];
	protected _addressInput: HTMLInputElement;
	protected _submitButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._paymentContainer = ensureElement<HTMLElement>('.order__buttons', this.container);
		this._paymentButton = Array.from(this._paymentContainer.querySelectorAll('.button_alt'));
		this._addressInput = this.container.elements.namedItem('address') as HTMLInputElement;
		this._submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);

		if (this._paymentButton) {
			this._paymentButton.forEach((button) => {
				button.addEventListener('click', () => {
					this.paymentSelected = button.name;
				});
			});
		}

		this._submitButton.addEventListener('click', () => {
			if (!this._submitButton.disabled) {
				events.emit('contact:open');
			}
		});
	}

	set paymentSelected(name: string) {
		this._paymentButton.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
			this.events.emit(`order:payment`, { payment: name });
		});
	}

	getAddress(): string {
		return this._addressInput.value;
	}

	set address(value: string) {
		this._addressInput.value = value;
	}
}

export class Contacts extends Form<IContacts> {
	protected _phoneInput: HTMLInputElement;
	protected _emailInput: HTMLInputElement;
	protected _submitButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._phoneInput = container.elements.namedItem('phone') as HTMLInputElement;
		this._emailInput = container.elements.namedItem('email') as HTMLInputElement;
		this._submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);

		this._submitButton.addEventListener('click', (event) => {
			event.preventDefault();
			if (!this._submitButton.disabled) {
				events.emit('contacts:submit');
			}
		});
	}

	set email(value: string) {
		this._emailInput.value = value;
	}

	getEmail(): string {
		return this._emailInput.value;
	}

	set phone(value: string) {
		this._phoneInput.value = value;
	}

	getPhone(): string {
		return this._phoneInput.value;
	}
}
