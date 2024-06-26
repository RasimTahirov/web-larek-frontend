import { Component } from './base/component';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { IModal } from '../types';

export class Modal extends Component<IModal> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>('.modal__close',container);
		this._content = ensureElement<HTMLElement>('.modal__content', container);
		
		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (events) =>
			events.stopPropagation()
		);
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		this.toggleClass(this.container, 'modal_active', true);
		this.events.emit('modal:open');
	}

	close() {
		this.toggleClass(this.container, 'modal_active', false);
		this.events.emit('modal:close');
	}

	render(data?: Partial<IModal>): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
