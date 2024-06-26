import { IProduct, IAppState, IOrder, FormErrors } from '../types';
import { Model } from './base/model';

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
		this.order = {
			address: '',
			payment: '',
			email: '',
			phone: '',
			items: [],
			total: null,
		};

		this.validateOrder;
		this.validateContact;
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
		const errors: typeof this.formErrors = {
			payment: '',
			address: '',
		};
		const hasErrors = !this.order.payment || !this.order.address;
		if (hasErrors) {
			errors.payment = 'Введите адрес и выберите способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('orderFormError:change', this.formErrors);
		return !hasErrors;
	}

	validateContact() {
		const errors: typeof this.formErrors = {
			phone: '',
			email: '',
		};
		const hasErrors = !this.order.phone || !this.isValidEmail(this.order.email);
		if (hasErrors) {
			errors.phone = 'Введите email и номер телефона';
		}
		this.formErrors = errors;
		this.events.emit('contactFormError:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	isValidEmail(email: string): boolean {
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailPattern.test(email);
	}
}
