export interface IProduct {
	id: string;
	description?: string;
	image: string;
	title: string;
	category?: string;
	price: number;
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

export interface IContacts {
	email: string;
	phone: string;
}

export interface IOrder {
	payment: string;
	address: string;
	email: string;
	phone: string;
	items: string []
}

export interface IBasket  {
	items: IProduct[];
	total: number;
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

export interface IProductAPI {
	getProductById: (id: string) => Promise<IProduct>;
	getProductList: () => Promise<IProduct[]>;
	createOrder: (order: IOrder) => Promise<SuccessfulOrder>;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;
export type Category = 'софт-скилл | другое | дополнительное | кнопка';
