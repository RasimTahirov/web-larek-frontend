export interface IProduct {
	id: string;
	description?: string;
	image: string;
	title: string;
	category?: string;
	price: number;
	index?: number;
	quantity?: number;
}

export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
	preview: string | null;
	order: string | null;
}

export interface IPayment {
	payment: string;
	address: string;
}

export interface IContacts extends IPayment, IOrder {
	email: string;
	phone: string;
}

export interface IOrder {
	payment: string;
	address: string;
	email: string;
	phone: string;
	items: string[];
	total: number;
}

export interface IBasket {
	items: IProduct[];
	total: number;
}

export interface IBasketItems {
	items: HTMLElement[];
	title: string;
	price: string;
}

export interface SuccessfulOrder {
	id: string;
	total: number;
}

export interface IPage {
	catalog: HTMLElement[];
	locked: boolean;
	counter: number;
}

export interface IModal {
	content: HTMLElement;
}

export interface IAction {
	onClick: (event: MouseEvent) => void;
}

export interface IFormValid {
	valid: boolean;
}

export type Category =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';
