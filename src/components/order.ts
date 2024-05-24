import { IContacts, IPayment } from '../types';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './form';

export class OrderForm extends Form<IPayment> {
	protected _paymentContainer: HTMLElement;
	protected _paymentButton: HTMLButtonElement[];
	protected _addressInput: HTMLInputElement;
	protected _nextButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._paymentContainer = ensureElement<HTMLElement>('.order__buttons',this.container);
		this._paymentButton = Array.from(this._paymentContainer.querySelectorAll('.button_alt'));
		this._addressInput = this.container.elements.namedItem('address') as HTMLInputElement;
		this._nextButton = document.querySelector<HTMLButtonElement>('.order__button');

		this._paymentContainer.addEventListener('click', (event) => {
			const target = event.target as HTMLButtonElement;
			this.setToggleClassPayment(target.name);
			this.updateNextButtonState();
			events.emit('order:payment', { payment: target.name });
		});

		this._addressInput.addEventListener('input', () => {
			this.updateNextButtonState();
		});

		if (this._addressInput && this._nextButton) {
			this._nextButton.addEventListener('click', () => {
				const errorMessage = document.querySelector('.form__error-test');
				const address = this._addressInput.value.trim();

				const addressComponents = address.split(',');

				if (addressComponents.length < 2) {
					errorMessage.classList.remove('form__error-test-none');
					errorMessage.textContent = 'Введите полный адрес в формате (город, улица, номер дома)';

					setTimeout(() => {
						errorMessage.classList.add('form__error-test-none');
					}, 2000);
				} else {
					events.emit('order:address', { address });
					events.emit('modal:close');
					events.emit('contact:open');
				}
			});
		}
	}

	setToggleClassPayment(name: string) {
		this._paymentButton.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}

	updateNextButtonState() {
		const isPaymentSelected = Array.from(document.querySelectorAll('.button_alt')).some((button) => button.classList.contains('button_alt-active'));
		const isAddressFilled = this._addressInput.value.trim() !== '';
		this._nextButton.disabled = !(isPaymentSelected && isAddressFilled);
	}

	set address(value: string) {
		this._addressInput.value = value;
	}
}

export class Contacts extends Form<IContacts> {
	protected _phoneInput: HTMLInputElement;
	protected _emailInput: HTMLInputElement;
	protected _nextButton: HTMLButtonElement;
	protected _emailErrorMessage: HTMLElement;
	protected _phoneErrorMessage: HTMLElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._phoneInput = container.elements.namedItem('phone') as HTMLInputElement;
		this._emailInput = container.elements.namedItem('email') as HTMLInputElement;
		this._nextButton = container.querySelector<HTMLButtonElement>('.paybtn');
		this._emailErrorMessage = this._emailInput.nextElementSibling as HTMLElement;
		this._phoneErrorMessage = this._phoneInput.nextElementSibling as HTMLElement;

		this._phoneInput.addEventListener('input', () => {
			this.formatPhoneInput();
		});

		this._nextButton.addEventListener('click', (event) => {
			event.preventDefault();
			this.handleSubmit(events);
		});
	}

	set email(value: string) {
		this._emailInput.value = value;
	}

	set phone(value: string) {
		this._phoneInput.value = value;
		this.formatPhoneInput();
	}

	formatPhoneInput() {
		const inputValue = this._phoneInput.value;
		const digitsOnly = inputValue.replace(/\D/g, '');

		if (digitsOnly.startsWith('8')) {
			this._phoneInput.value = '+7' + digitsOnly.substring(1);
		} else if (!digitsOnly.startsWith('7')) {
			this._phoneInput.value = '+7' + digitsOnly;
		} else {
			this._phoneInput.value = '+' + digitsOnly;
		}
	}

	validateEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	showErrorMessage(element: HTMLElement, message: string) {
		element.classList.remove('form__error-test-none');
		element.textContent = message;
		setTimeout(() => {
			element.classList.add('form__error-test-none');
		}, 2000);
	}

	handleSubmit(events: IEvents) {
		const isPhoneValid = this._phoneInput.value.length === 12;
		const isEmailValid = this.validateEmail(this._emailInput.value);

		if (!isEmailValid) {
			this.showErrorMessage(this._emailErrorMessage, 'Введите корректный email');
		}

		if (!isPhoneValid) {
			this.showErrorMessage(this._phoneErrorMessage, 'Введите корректный номер телефона');
		}

		if (isEmailValid && isPhoneValid) {
			events.emit('contacts:submit', {
				email: this._emailInput.value,
				phone: this._phoneInput.value,
			});
		}
	}
}
