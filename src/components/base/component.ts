export abstract class Component<T> {
	// Конструктор класса, который принимает контейнер DOM элемент
	protected constructor(protected readonly container: HTMLElement) {}

	// Метод для установки текстового содержимого элемента
	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	// Метод для установки состояния disabled элемента
	protected setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) {
				element.setAttribute('disabled', 'disavled');
			} else {
				element.removeAttribute('disabled');
			}
		}
	}

	// Метод для установки изображения элемента
	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	// Метод для отрисовки компонента с данными, переданными в виде частичного объекта типа Т
	render(data?: Partial<T>): HTMLElement {
		// Применяем данные к экземпляру класса
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
