import { Component } from './base/component';
import { IEvents } from './base/events';
import { IPage } from '../types';
import { ensureElement } from '../utils/utils';

export class Page extends Component<IPage> {
	protected _catalog: HTMLElement;
	protected _counter: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container)

        this._catalog = ensureElement<HTMLElement>('.gallery', container)
        this._counter = ensureElement<HTMLElement>('.header__basket-counter', container)
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper', container)
        this._basket = ensureElement<HTMLElement>('.header__basket', container)

        this._basket.addEventListener('click', () => {
            this.events.emit('basket: open')
        })
    }

    set counter(value: number) {
        this.setText(this._counter, String(value))
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items)
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('.page__wrapper_locked')
        } else {
            this._wrapper.classList.remove('page__wrapper_locked')
        }
    }
}
