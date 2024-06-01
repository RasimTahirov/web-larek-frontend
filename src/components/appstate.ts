import { IProduct, IAppState, IOrder } from '../types';
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

	setCatalog(items: IProduct[]): void {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	addToBasket(value: IProduct) {
		const existingItemIndex = this.basket.findIndex(
			(item) => item.id === value.id
		);

		if (existingItemIndex !== -1) {
			this.basket[existingItemIndex].quantity = (this.basket[existingItemIndex].quantity || 0) + 1;
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

	setPayment(payment: string) {
		this.order.payment = payment;
		this.emitChanges('order:changed', { payment });
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

		this.emitChanges('order:changed', this.order);
	}

	clearBasketCounter() {
		this.emitChanges('basket:changed', { count: 0 });
	}

	updateOrderItems() {
		this.order.items = this.basket.map((item) => item.id);
	}

	setEmail(email: string) {
		this.order.email = email;
		this.emitChanges('order:changed', { email });
	}

	setPhone(phone: string) {
		this.order.phone = phone;
		this.emitChanges('order:changed', { phone });
	}

	setAddress(address: string) {
		this.order.address = address;
		this.emitChanges('order:changed', { address });
	}

	validateOrder() {
		const isPaymentSelected = this.order.payment !== '';
		const isAddressFilled = this.order.address.trim() !== '';
		return isPaymentSelected && isAddressFilled;
	}

	validateContacts() {
		const isEmailValid = this.order.email.trim() !== '';
		const isPhoneValid = this.order.phone.trim().length === 12;
		return isEmailValid && isPhoneValid;
	}

	isValidEmail(email: string): boolean {
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailPattern.test(email);
	}

	formatPhoneInput(phone: string): string {
		const digitsOnly = phone.replace(/\D/g, '');
		if (digitsOnly.startsWith('8')) {
			return '+7' + digitsOnly.substring(1);
		} else if (!digitsOnly.startsWith('7')) {
			return '+7' + digitsOnly;
		} else {
			return '+' + digitsOnly;
		}
	}
}