import { IProduct, IAppState, IOrder, Category } from '../types';
import { Model } from './base/model';

export class Product extends Model<IProduct> {
	id: string;
	title: string;
	category: Category;
	image: string;
	price: number | null;
	description: string;
}

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
		this.catalog = items.map((item) => new Product(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	addToBasket(value: Product) {
		const existingItemIndex = this.basket.findIndex(
			(item) => item.id === value.id
		);

		if (existingItemIndex !== -1) {
			this.basket[existingItemIndex].quantity += 1;
		} else {
			this.basket.push({ ...value, quantity: 1 });
		}

		this.updateOrderItems();
		this.emitChanges('basket:changed', { basket: this.basket });
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
		return this.basket.reduce((total, item) => total + item.price, 0);
	}

	removeFromBasket(value: Product) {
		const existingItemIndex = this.basket.findIndex(
			(item) => item.id === value.id
		);

		if (existingItemIndex !== -1) {
			this.basket.splice(existingItemIndex, 1);
			this.updateOrderItems();
			this.emitChanges('basket:changed', { basket: this.basket });
		}
	}

	clearBasket() {
		this.basket = [];
		this.updateOrderItems();
		this.emitChanges('basket:changed', { basket: this.basket });
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
}
