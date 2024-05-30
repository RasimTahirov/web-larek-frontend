import { Component } from './base/component';
import { ensureElement } from '../utils/utils';
import { IProduct, IAction, Category } from '../types';

export class Card extends Component<IProduct> {
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price?: HTMLElement;
	protected _description?: HTMLElement;
	protected _buttonAddBasket: HTMLButtonElement;
	protected _deleteButton?: HTMLButtonElement;
	protected _index?: HTMLElement;

	constructor(container: HTMLElement, actions: IAction) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._category = container.querySelector('.card__category');
		this._image = container.querySelector(`.card__image`);
		this._price = container.querySelector('.card__price');
		this._description = container.querySelector('.card__text');
		this._buttonAddBasket = container.querySelector('.card__button');
		this._deleteButton = container.querySelector('.basket__item-delete');
		this._index = container.querySelector('.basket__item-index');

		if (actions?.onClick) {
			if (this._buttonAddBasket) {
				this._buttonAddBasket.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}

		if (this._deleteButton) {
			this._deleteButton.addEventListener('click', actions.onClick);
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
		const categoryClassMap = {
			'другое': 'card__category_other',
			'софт-скил': 'card__category_soft',
			'дополнительное': 'card__category_additional',
			'кнопка': 'card__category_button',
			'хард-скил': 'card__category_hard',
		};

		this.setText(this._category, value);

		const categoryClass = categoryClassMap[value];
		if (categoryClass) {
			this._category.classList.add(categoryClass);
		}
	}

	get category(): Category {
		return this._category.textContent as Category;
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set price(value: string) {
		if (value !== null) {
			this.setText(this._price, value + ' синапсов');
			this.setDisabled(this._buttonAddBasket, false);
		} else {
			this.setText(this._price, 'Бесценно');
			this.setDisabled(this._buttonAddBasket, true);
		}
	}

	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(descTemplate, str);
					return descTemplate;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}

	set index(value: number) {
		this.setText(this._index, value);
	}
}