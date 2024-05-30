import { Component } from './base/component';
import { IBasket } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

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

	set items(items: HTMLElement[]) {
		if (items.length > 0) {
			this.setDisabled(this._button, false);
			this.hideElement(this._titleEmpty);
		} else {
			this.setDisabled(this._button, true);
			this.showElement(this._titleEmpty);
		}
		this._list.replaceChildren(...items);
	}

	set title(value: string) {
		this.setText(this._titleEmpty, value);
	}

	get title(): string {
		return this._titleEmpty.textContent || '';
	}

	set total(value: number) {
		this.setText(this._total, `${value} синапсов`);
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