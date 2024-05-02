import { Component } from './base/component';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { IModal } from '../types';

export class Modal extends Component<IModal> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	// set content(value: HTMLElement) {
	//     if (value) {
	//         while (this._content.firstChild) {
	//             this._content.removeChild(this._content.firstChild)
	//         }
	//         this._content.appendChild(value)
	//     }
	// }

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:opem');
	}

	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal_close');
	}

	render(data?: Partial<IModal>): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
