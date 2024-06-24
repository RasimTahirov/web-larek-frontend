import { IProduct, IAppState, IOrder } from '../types';
import { Model } from './base/model';

type FormErrors = Partial<Record<keyof IOrder, string>>;

export class AppState extends Model<IAppState> {
	catalog: IProduct[];
	basket: IProduct[] = [];
	order: IOrder = {
		address: '',
		payment: '',
		email: '',
		phone: '',
		items: [],
		total: null,
	};
	preview: string | null;
	formErrors: FormErrors = {};

	setCatalog(items: IProduct[]): void {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	addToBasket(value: IProduct) {
		const existingItemIndex = this.basket.findIndex(
			(item) => item.id === value.id
		);

		if (existingItemIndex !== -1) {
			this.basket[existingItemIndex].quantity =
				(this.basket[existingItemIndex].quantity || 0) + 1;
		} else {
			this.basket.push({ ...value, quantity: 1 });
		}

		this.emitChanges('basket:changed', { basket: this.basket });
	}

	isItemInBasket(item: IProduct): boolean {
		return this.basket.some((basketItem) => basketItem.id === item.id);
	}

	setPreview(item: IProduct) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	getBasketAmount() {
		return this.basket.length;
	}

	getTotalPrice() {
		return this.basket.reduce(
			(total, item) => total + (item.price || 0) * (item.quantity || 1),
			0
		);
	}

	removeFromBasket(value: IProduct) {
		const existingItemIndex = this.basket.findIndex(
			(item) => item.id === value.id
		);

		if (existingItemIndex !== -1) {
			this.basket.splice(existingItemIndex, 1);
			this.emitChanges('basket:changed', { basket: this.basket });
		}
	}

	clearBasket() {
		this.basket = [];
		this.emitChanges('basket:changed', { basket: this.basket });
		this.clearBasketCounter();
	}

	resetOrder() {
		console.log('Сброс')
		console.log('До сброс', this.order)
		this.order = {
			address: '',
			payment: '',
			email: '',
			phone: '',
			items: [],
			total: null,
		};
		console.log('После сброс', this.order)

		this.validateOrder
		this.validateContact
		this.emitChanges('order:changed', this.order);
	}

	clearBasketCounter() {
		this.emitChanges('basket:changed', { count: 0 });
	}



	setEmail(email: string) {
		this.order.email = email;
		this.validateContact();
	}

	setPhone(phone: string) {
		this.order.phone = phone;
		this.validateContact();
	}

	setAddress(address: string) {
		this.order.address = address;
		this.validateOrder();
	}

	setPayment(payment: string) {
		this.order.payment = payment;
		this.validateOrder();
	}

	validateOrder() {
    const errors: typeof this.formErrors = {};
		// if (!this.order.payment || !this.order.address) {
		// 	errors.title = 'Введите'
		// }

    if(!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты'
		}
    if(!this.order.address) {
      errors.address = 'Необходимо указать адрес'
    }

    this.formErrors = errors;
    this.events.emit('orderFormError:change', this.formErrors)
    return Object.keys(errors).length === 0
  }


	validateContact() {
    const errors: typeof this.formErrors = {};
    if(!this.order.email) {
      errors.email = 'Необходимо указать email'
    }
    if(!this.order.phone) {
      errors.phone = 'Необходимо указать телефон'
    }
    this.formErrors = errors;
    this.events.emit('contactFormError:change', this.formErrors)
    return Object.keys(errors).length === 0
  }

// validateContact() {

// }

	// const isEmailValid = this.order.email.trim() !== '';
	// const isPhoneValid = this.order.phone.trim().length === 12;
	// return isEmailValid && isPhoneValid;

	// isValidEmail(email: string): boolean {
	// 	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	// 	return emailPattern.test(email);
	// }

	// formatPhoneInput(phone: string): string {
	// 	const digitsOnly = phone.replace(/\D/g, '');
	// 	if (digitsOnly.startsWith('8')) {
	// 		return '+7' + digitsOnly.substring(1);
	// 	} else if (!digitsOnly.startsWith('7')) {
	// 		return '+7' + digitsOnly;
	// 	} else {
	// 		return '+' + digitsOnly;
	// 	}
	// }
}
