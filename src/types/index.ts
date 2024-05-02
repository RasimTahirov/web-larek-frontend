export interface IProduct {
    id: string;
    description?: string
    image: string
    title: string
    category?: string
    price: number
}

export interface IAppState {
    catalog: IProduct[]
    basket: IProduct[]
    preview: string | null
    order: string | null
}

export interface IPayment {
    paymentMethod: string
    address: string
}

export interface IContacts {
    email: string
    phone: string
}

export interface IBasket extends IPayment, IContacts {
    items: IProduct[]
    total: number
}

export interface SuccessfulOrder {
    id: string;
    total: number
}

export interface IPage {
    catalog: HTMLElement[]
}

export interface IModal {
    content: HTMLElement
}

export type FormErrors = Partial<Record<keyof IContacts, string>>;
export type Category = 'софт-скилл | другое | дополнительное | кнопка'