import { Component } from './base/component';
import { ensureElement } from '../utils/utils';
import { IProduct, IAction, Category } from '../types';

export class Card extends Component<IProduct> {
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price?: HTMLElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: IAction) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._category = container.querySelector('.card__category');
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._price = container.querySelector('.card__price');
		this._description = container.querySelector('.card__text');
		this._button = container.querySelector('.card__button');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set category(value: Category) {
		this.setText(this._category, value);
	}

	get catrgory(): Category {
		return this._category.textContent as Category;
	}

	// set category(value: Category) {
	// 	let categoryClass = '';
	// 	switch (value) {
	// 		case 'софт-скилл':
	// 			categoryClass = 'card__category_soft';
	// 			break;
	// 		case 'другое':
	// 			categoryClass = 'card__category_hard';
	// 			break;
	// 		case 'дополнительное':
	// 			categoryClass = 'card__category_additional';
	// 			break;
	// 		case 'кнопка':
	// 			categoryClass = 'card__category_button';
	// 			break;
	// 		default:
	// 			categoryClass = 'card__category_other';
	// 			break;
	// 	}
	// 	this._category.className = categoryClass;
	// }

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set price(value: string) {
		if (value !== null) {
			this.setText(this._price, value + ' синапсов');
			this.setDisabled(this._button, false);
		} else {
			this.setText(this._price, 'Бесценно');
			this.setDisabled(this._button, true);
		}
	}
}
