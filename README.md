# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

___

## Данные и типы данных

## Типы данных

- `Category` — это строковый объединенный тип, представляющий различные категории используемых в карточках товара

```ts
export type Category =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';
```

- `FormErrors` — это тип, который представляет объект ошибок формы. Он используется для отображения сообщений об ошибках, связанных с различными полями формы заказа.

```ts
export type FormErrors = Partial<Record<keyof IOrder, string>>;
```

## Основные интерфесы

 - `IProduct` - Представляет продукт в каталоге товаров.
   - `id: string` - уникальный идентификатор продукта.
   - `description` - описание продукта
   - `image: string` - URL изображения продукта.
   - `title: string` - название продукта.
   - `category: string` - категория продукта.
   - `price: number` - стоимость продукта.
   - `quantity: number` - общее количество товаров в корзине.

```ts
export interface IProduct {
	id: string;
	description?: string;
	image: string;
	title: string;
	category?: string;
	price: number;
	index?: number;
	quantity?: number;
}
```

Интерфейс `IProduct` используется для описания структуры данных продукта.

 - `IAppState ` - Представляет состояние приложения.
   - `catalog: IProduct[]` - массив продуктов, доступных в каталоге.
   - `basket: IProduct[]` - массив продуктов, добавленных в корзину.
   - `preview: string | null` - идентификатор продукта для предпросмотра.
   - `order: string | null` - идентификатор текущего заказа.

Интерфейс `IAppState` описывает общее состояние приложения, включая каталог товаров, корзину, текущий предпросмотр и заказ.

```ts

export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
	preview: string | null;
	order: string | null;
}
```

 - `IPayment` - Добавляет поля для оплаты и адреса.
   - `payment: string` - способ оплаты.
   - `address: string` - адрес доставки.

```ts
export interface IPayment extends IOrder {
	payment?: string;
	address?: string;
}
```

Интерфейс `IPayment` используется для представления данных, связанных с оплатой и доставкой.

 - `IContacts` - Добавляет поля контактов.
   - `email: string` - адрес электронной почты.
   - `phone: string` - номер телефона.

```ts
export interface IContacts extends IPayment, IOrder {
	email?: string;
	phone?: string;
}
```

Интерфейс `IContacts` используется для представления данных контактов клиента.
___

## Базовый код

### Класс Api

Класс Api используется для создания экземпляра, который выполняет API запросы.

>Свойства

 - `baseUrl: string` - Базовый URL для API.
 - `options: RequestInit` - Дополнительные параметры для настройки запросов.

> Методы

- `handleResponse` - метод, который обрабатывает ответ от сервера.
- `get` - метод получает данные с сервера.
- `post` - метод отправляет данные на сервер 

___

### Класс EventEmitter

Класс предоставляет функциональность для управления событиями, включая добавление, удаление и вызов обработчиков событий.

> Основные методы

- `on` - подписка на событие.
- `emit` - инициирование события.
- `trigger` - возвращает функцию, при вызове которой инициируется указанное в параметрах событие.

___

## Класс Component

Класс `Component` является абстрактным базовым классом, предоставляющим основные методы и свойства для управления HTML-элементами и их состоянием. Он предназначен для наследования другими классами, которые будут реализовывать конкретные компоненты пользовательского интерфейса.

> Методы
- `protected setDisabled` - Устанавливает или снимает атрибут disabled у элемента.
- `protected setText` - Устанавливает текстовое содержимое элемента.
- `protected setDisabled` - Устанавливает источник и альтернативный текст изображения.

___

## UI Components

### Класс Modal

Класс `Modal` отвечает за создание и управление модальным окном на веб-странице. Он наследуется от класса `Component` и реализует основные функции для открытия, закрытия и отображения контента внутри модального окна.

>Методы

- `set content(value: HTMLElement)` - Устанавливает контент для модального окна.
- `open()` - Открытие модально окна.
- `close()` - Закрытие модально окна.

___

## Класс Form

Класс `Form` предназначен для управления формой на веб-странице, обработкой ввода пользователя, валидацией и отправкой данных. Он наследуется от класса Component и работает с типом данных `T`, представляющим модель данных формы.

> Функциональность

Класса `Form`, устанавливает элементы `_submit` и `_errors`, а также добавляет обработчики событий для изменения ввода и отправки формы.

> Свойства

- `_submit: HTMLButtonElement` - Кнопка отправки формы.
- `_errors: HTMLElement` - Элемент для отображения ошибок формы.

> Методы

- `protected onInputChange(field: keyof T, value: string)`

```ts
protected onInputChange(field: keyof T, value: string) {
 this.events.emit(`${this.container.name}.${String(field)}:change`, {
  field,
  value,
 });
}
```

- `set errors(value: string)` - Устанавливает текст ошибок формы.
- `set valid(value: boolean)` - Устанавливает состояние валидности формы, управляя доступностью кнопки отправки.

___

## Общие компоненты

### Класс Card

Класс `Card` наследуется от абстрактного класса `Component` и представляет собой компонент карточки продукта, который используется для отображения информации о продукте и взаимодействия с ним.

> Свойства

- `_title: HTMLElement` - Элемент, отображающий название продукта.
- `_category: HTMLElement` - Элемент, отображающий категорию продукта.
- `_image: HTMLImageElement` - Элемент изображения продукта.
- `_price: HTMLElement` - Элемент, отображающий стоимость продукта.
- `_description: HTMLElement` - Элемент, отображающий описание продукта.
- `_buttonAddBasket: HTMLButtonElement` - Кнопка для добавления продукта в корзину.
- `_deleteButton: HTMLButtonElement` - Кнопка для удаления продукта из корзины.
- `_index: HTMLElement` - Элемент для отображения индекса продукта в корзине.

> Основные методы класса

- `setText` - Метод из базового класса Component, устанавливающий текстовое содержимое элемента. Используется для установки названия товара, описания и его категории.
- `toggleClass` - Метод из базового класса Component, переключающий класс на элементе.

```ts
set title(value: string) {
 this.setText(this._title, value);
}

set category(value: Category) {
 const categoryClassMap = {
  'другое': 'card__category_other',
  'софт-скил': 'card__category_soft',
  'дополнительное': 'card__category_additional',
  'кнопка': 'card__category_button',
  'хард-скил': 'card__category_hard',
 }

 this.setText(this._category, value);

 const categoryClass = categoryClassMap[value];
  if (categoryClass) {
   this.toggleClass(this._category, categoryClass, true);
  }
}
```

- `setDisabled` - Метод из базового класса Component, устанавливающий или снимающий состояние disabled элемента. Используется в карточке товара для кнопки 'купить', если товар уже находится в корзине или нет стоимости для его приобретения.

```ts
set isInBasket(value: boolean) {
 this._isInBasket = value;
 this.setDisabled(this._buttonAddBasket, value);
}

set price(value: string) {
 if (value !== null) {
  this.setText(this._price, value + ' синапсов');
  this.setDisabled(this._buttonAddBasket, this._isInBasket);
 } else {
  this.setText(this._price, 'Бесценно');
  this.setDisabled(this._buttonAddBasket, true);
 }
}
```

- `setImage` Устанавливает изображение и альтернативный текст для карточки товара.

```ts
set image(value: string) {
 this.setImage(this._image, value, this.title);
}
```

Методы и свойства класса `Card` предоставляют удобные способы манипуляции данными продукта и их отображением в DOM. Класс также поддерживает действия, такие как добавление и удаление из корзины, благодаря передаваемым в конструктор `actions`. Этот класс позволяет легко создавать и управлять карточками продуктов в веб-приложении, обеспечивая при этом гибкость и расширяемость.

___

### Класс Basket

Класс представляет собой компонент корзины, который управляет списком товаров, их общей стоимостью и взаимодействием с пользователем. Он наследуется от базового класса Component.

> Свойства

- `_list: HTMLElement` - Элемент, содержащий список товаров.
- `_total: HTMLElement` - Элемент, отображающий общую стоимость товаров в корзине.
- `_button: HTMLButtonElement` - Кнопка для оформления заказа.
- `_titleEmpty: HTMLElement` - Элемент, отображающий сообщение о пустой корзине.

> Функциональность

Класс Basket предназначен для управления отображением содержимого корзины и взаимодействия с пользователем. Он обеспечивает:

- Управление отображением сообщения о пустой корзине. Если в корзине нет товаров, отображается сообщение о пустой корзине, при добавлении товара в корзину, сообщение пропадает при помощи `hideElement`, которое принимает параметр `display = 'none'`

```ts
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
```

- `addItem` Добавляет указанный элемент в список товаров корзины. `clear()` - Очищает список товаров в корзине.

Класс `Basket` является важной частью пользовательского интерфейса приложения, обеспечивая удобное управление и отображение информации о покупках пользователю.

___

### Класс OrderForm

Класс представляет собой компонент формы заказа. Он управляет вводом данных для платежа и адреса доставки.

> Свойства

- `_paymentContainer: HTMLElement` - Контейнер, содержащий кнопки выбора способа оплаты.
- `_paymentButton: HTMLButtonElement[]` - Массив кнопок выбора способа оплаты.
- `_addressInput: HTMLInputElement` - Поле ввода адреса доставки.

> Методы

- `set paymentSelected(name: string)` - Позволяет установить выбранный способ оплаты, изменяя визуальное состояние кнопок оплаты.

```ts
set paymentSelected(name: string) {
 this._paymentButton.forEach((button) => {
  this.toggleClass(button, 'button_alt-active', button.name === name);
  this.events.emit(`order:payment`, { payment: name });
  });
}
```

- `set address(value: string)` - Используется для установки значения в поле ввода адреса доставки.

___

### Класс Contacts

Класс представляет собой компонент формы контактов. Он управляет вводом данных для контактной информации (телефон и email).

- `_phoneInput: HTMLInputElement` - Поле ввода телефонного номера.
- `_emailInput: HTMLInputElement` - Поле ввода email.

> Методы

- `set email(value: string)` - Устанавливает значение email.
- `set phone(value: string)` - Устанавливает значение номера телефона.

```ts
set email(value: string) {
 this._emailInput.value = value;
}

set phone(value: string) {
 this._phoneInput.value = value;
}
```

___

### Класс Success

Класс `Success` представляет компонент для отображения сообщения об успешном выполнении операции.

> Свойства

- `_close: HTMLElement` - Элемент кнопки закрытия.
- `_total: HTMLElement` - Элемент для отображения общей суммы списанных средств.

> Методы

- `set total(total: string)` - Устанавливает значение общей суммы списанных средств с помощью метода `setText` из базового класса `Component`

```ts
set total(total: string) {
 this.setText(this._total, `Списано ${total} синапсов`);
}
```

___

### Класс Page

Класс `Page` представляет собой компонент, управляющий страницей в веб-приложении.

> Методы

- `set counter(value: number)` - Устанавливает значение счетчика товаров корзины в зависимости от количества товаров в корзине.
- `set catalog(items: HTMLElement[])` - Устанавливает общий каталог товаров на странице.
- `set locked(value: boolean)` - блокирует страницу при открытии модальных окон.

```ts
set locked(value: boolean) {
 if (value) {
  this._wrapper.classList.add('page__wrapper_locked');
  this._locked = true;
 } else {
  this._wrapper.classList.remove('page__wrapper_locked');
  this._locked = false;
 }
}
```
___

## Управление данными

### Класс AppState

Класс `AppState` является моделью приложения для управления состоянием данных

> Поля класса

- `catalog: IProduct[]` - Каталог продуктов.
- `basket: IProduct[]` - Корзина товаров.
- `order: IOrder` - Информация о заказе, включая адрес доставки, способ оплаты, контактные данные и список товаров.
- `preview: string | null` - Идентификатор товара, выбранного для предпросмотра.
- `formErrors: FormErrors` - Объект для хранения ошибок формы заказа.

> Взаимодействие частей класса AppState

>> Управление каталогом товаров

- Метод `setCatalog(items: IProduct[])` устанавливает новый список товаров в каталоге.
- При установке нового каталога генерируется событие items:changed, которое оповещает другие части приложения о изменении каталога.

>> Управление корзиной покупок

- Методы `addToBasket(value: IProduct)` и `removeFromBasket(value: IProduct)` добавляют и удаляют товары из корзины соответственно.
- При изменении содержимого корзины вызывается событие basket:changed, чтобы обновить интерфейс или другие части приложения.

>> Управление информацией о заказе

- `setEmail`, `setPhone`, `setAddress`, `setPayment` - Устанавливает адрес электронной, номер телефона, адрес доставки и способ оплаты в заказе.
- Метод `resetOrder()` сбрасывает информацию о заказе до начального состояния.

>> Управление предпросмотром товара
- Метод `setPreview(item: IProduct)` устанавливает товар для предпросмотра.
- При установке предпросмотра генерируется событие `preview:changed`, которое может быть использовано для обновления интерфейса предпросмотра товара.

>> Валидация данных
- Методы `validateOrder()` и `validateContact()` проверяют правильность заполнения соответствующих данных заказа и контактной информации.
- При обнаружении ошибок генерируются события `orderFormError:change` и `contactFormError:change`, чтобы уведомить интерфейс о наличии ошибок.

___

### Класс ProductAPI

Класс предоставляет методы для взаимодействия с API продуктов и заказов, включая получение информации о продукте, списка продуктов и создание заказа.

>Конструктор

- `cdn: string` - Базовый URL, где хранятся изображения товаров.
- `baseUrl: string` - Базовый URL для API.
- `options: RequestInit` - Дополнительные параметры для запросов к API.

>Методы

- `getProductById` - Получает список всех продуктов и добавляет для каждой карточки URL изображения
- `createOrder` - Отправляет запрос об информации заказа

Этот класс предназначен для упрощения работы с API продуктов, предоставляя удобные методы для получения списка продуктов и создания заказов -->