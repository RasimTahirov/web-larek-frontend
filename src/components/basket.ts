import { Component } from './base/component';
import { IBasket, IBasketItems, IProduct } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { IAction } from '../types';

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _titleEmpty: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');
		this._titleEmpty = ensureElement<HTMLElement>('.modal__title-empty', container);

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}
		
		this.items = [];
	}

	set items(items: IProduct[]) {
		if (items.length > 0) {
			this.setDisabled(this._button, false);
			this.hideElement(this._titleEmpty);
		} else {
			this.setDisabled(this._button, true);
			this.showElement(this._titleEmpty);
		}
	}

	set title(value: string) {
		this.setText(this._titleEmpty, value);
	}

	get title(): string {
		return this._titleEmpty.textContent || '';
	}

	set total(value: number) {
		this._total.textContent = String(value) + ' синапсов';
	}

	hideElement(element: HTMLElement) {
		element.style.display = 'none';
	}

	showElement(element: HTMLElement) {
		element.style.display = '';
	}

	clear() {
		this._list.innerHTML = '';
	}

	addItem(item: HTMLElement) {
		this._list.appendChild(item);
	}
}

export class BasketItem extends Component<IBasketItems> {
	protected _deleteButton?: HTMLButtonElement;
	protected _index?: HTMLElement;
	protected _title?: HTMLElement;
	protected _price?: HTMLElement;

	constructor(container: HTMLElement, actions: IAction) {
		super(container);

		this._deleteButton = container.querySelector('.basket__item-delete');
		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);

		if (this._deleteButton) {
			this._deleteButton.addEventListener('click', actions.onClick);
		}
	}

	set index(value: number) {
		this.setText(this._index, value);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: string) {
		this.setText(this._price, `${value} синапсов`);
	}
}
