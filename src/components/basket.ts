import { Component } from './base/component';
import { IBasket } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

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
		} else {
			this.setDisabled(this._button, true);
		}
	}
}
