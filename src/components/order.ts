import { IContacts, IPayment } from '../types';
import { ensureElement } from '../utils/utils';
import { AppState } from './appstate';
import { IEvents } from './base/events';
import { Form } from './form';

export class OrderForm extends Form<IPayment> {
	protected _paymentContainer: HTMLElement;
	protected _paymentButton: HTMLButtonElement[];
	protected _addressInput: HTMLInputElement;
	protected _nextButton: HTMLButtonElement;
	protected _errorText: HTMLElement;
	protected appState: AppState;

	constructor(container: HTMLFormElement, events: IEvents, appState: AppState) {
		super(container, events);

		this.appState = appState;

		this._paymentContainer = ensureElement<HTMLElement>('.order__buttons', this.container);
		this._paymentButton = Array.from(this._paymentContainer.querySelectorAll('.button_alt'));
		this._addressInput = this.container.elements.namedItem('address') as HTMLInputElement;
		this._nextButton = this.container.querySelector<HTMLButtonElement>('.order__button');
		this._errorText = this.container.querySelector('.form__error-test');

		this._paymentContainer.addEventListener('click', (event) => {
			const target = event.target as HTMLButtonElement;
			if (target.classList.contains('button_alt')) {
				events.emit('order:payment', { payment: target.name });
				this.setToggleClassPayment(target.name);
				this.appState.setPayment(target.name);
				this.validateForm();
			}
		});

		this._addressInput.addEventListener('input', () => {
			this.appState.setAddress(this._addressInput.value);
			this.validateForm();
		});

		this._nextButton.addEventListener('click', () => {
			if (!this._nextButton.disabled) {
				events.emit('contact:open');
			}
		});

		this.validateForm();
	}

	set address(value: string) {
		this._addressInput.value = value;
		this.validateForm();
	}

	setToggleClassPayment(name: string) {
		this._paymentButton.forEach((button) => 
			{this.toggleClass(button, 'button_alt-active', button.name === name)});
	}

	validateForm() {
		const isValid = this.appState.validateOrder();

		if (isValid) {
			this._nextButton.disabled = false;
			this._errorText.classList.add('form__error-test-none');
		} else {
			this._nextButton.disabled = true;
			this._errorText.classList.remove('form__error-test-none');
		}
	}
}

export class Contacts extends Form<IContacts> {
	protected _phoneInput: HTMLInputElement;
	protected _emailInput: HTMLInputElement;
	protected _nextButton: HTMLButtonElement;
	protected _emailErrorMessage: HTMLElement;
	protected _phoneErrorMessage: HTMLElement;
	protected appState: AppState;

	constructor(container: HTMLFormElement, events: IEvents, appState: AppState) {
		super(container, events);

		this.appState = appState;

		this._phoneInput = container.elements.namedItem('phone') as HTMLInputElement;
		this._emailInput = container.elements.namedItem('email') as HTMLInputElement;
		this._nextButton = container.querySelector<HTMLButtonElement>('.paybtn');
		this._emailErrorMessage = this._emailInput.nextElementSibling as HTMLElement;
		this._phoneErrorMessage = this._phoneInput.nextElementSibling as HTMLElement;

		this._phoneInput.addEventListener('input', () => {
			this._phoneInput.value = this.appState.formatPhoneInput(this._phoneInput.value);
			this.appState.setPhone(this._phoneInput.value);
			this.validateForm();
		});

		this._emailInput.addEventListener('input', () => {
			this.appState.setEmail(this._emailInput.value);
			this.validateForm();
		});

		this._nextButton.addEventListener('click', () => {
			if (!this._nextButton.disabled) {
				events.emit('contacts:submit', {
					email: this._emailInput.value,
					phone: this._phoneInput.value,
				});
			}
		});

		this.validateForm();
	}

	set email(value: string) {
		this._emailInput.value = value;
		this.validateForm();
	}

	set phone(value: string) {
		this._phoneInput.value = value;
		this.validateForm();
	}

	validateForm() {
		const isValid = this.appState.validateContacts();

		if (isValid) {
			this._nextButton.disabled = false;
			this._emailErrorMessage.classList.add('form__error-test-none');
			this._phoneErrorMessage.classList.add('form__error-test-none');
		} else {
			this._nextButton.disabled = true;
			if (!this.appState.isValidEmail(this._emailInput.value)) {
				this._emailErrorMessage.classList.remove('form__error-test-none');
			} else {
				this._emailErrorMessage.classList.add('form__error-test-none');
			}

			if (this._phoneInput.value.length !== 12) {
				this._phoneErrorMessage.classList.remove('form__error-test-none');
			} else {
				this._phoneErrorMessage.classList.add('form__error-test-none');
			}
		}
	}
}
