import { IContacts, IPayment } from '../types';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './form';

export class OrderForm extends Form<IPayment> {
	protected _paymentContainer: HTMLElement;
	protected _paymentButton: HTMLButtonElement[];
	protected _addressInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._paymentContainer = ensureElement<HTMLElement>('.order__buttons', this.container);
		this._paymentButton = Array.from(this._paymentContainer.querySelectorAll('.button_alt'));
		this._addressInput = this.container.elements.namedItem('address') as HTMLInputElement;

		if (this._paymentButton) {
			this._paymentButton.forEach((button) => {
				button.addEventListener('click', () => {
					this.paymentSelected = button.name;
				});
			});
		}
	}

	set paymentSelected(name: string) {
		this._paymentButton.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
			this.events.emit(`order:payment`, { payment: name });
		});
	}

	set address(value: string) {
		this._addressInput.value = value;
	}
}

export class Contacts extends Form<IContacts> {
	protected _phoneInput: HTMLInputElement;
	protected _emailInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._phoneInput = container.elements.namedItem('phone') as HTMLInputElement;
		this._emailInput = container.elements.namedItem('email') as HTMLInputElement;
	}

	set email(value: string) {
		this._emailInput.value = value;
	}

	set phone(value: string) {
		this._phoneInput.value = value;
	}
}
