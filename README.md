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
- src/styles/styles.scss — корневой файл стилей
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

## Базовый код
### Класс Api
Класс Api используется для создания экземпляра, который выполняет API запросы.

```ts
constructor(baseUrl: string, options: RequestInit = {})
```
 - `baseUrl: string` - Базовый URL для API.
 - `options: RequestInit` - Дополнительные параметры для настройки запросов. 

```ts
protected handleResponse(response: Response): Promise<object>
```
 - `handleResponse` - метод, который обрабатывает ответ от сервера.

```ts
get(uri: string): Promise<object>
```
- `get` - метод получает данные с сервера.

```ts
post(uri: string, data: object, method: ApiPostMethods = 'POST')
```
- `post` - метод отправляет данные на сервер
___
### Класс Component
```ts
abstract class Component<T>
```
Абстрактный класс для создания компонентов пользовательского интерфейса, которые работают с HTML-элементами.

<!-- ```ts
protected constructor(protected readonly container: HTMLElement)
``` -->

```ts
protected toggleClass(element: HTMLElement, className: string, force?: boolean)
```
- `toggleClass` - переключает CSS-класс на указанном HTML-элементе.

```ts
protected setText(element: HTMLElement, value: unknown)
```
- `setText` - устанавливает текстовое содержимое указанного HTML-элемента.

```ts
protected setDisabled(element: HTMLElement, state: boolean)
```
- `setDisabled` - устанавливает или снимает атрибут `disabled` у указанного HTML-элемента.

```ts
protected setImage(element: HTMLImageElement, src: string, alt?: string)
```
- `setImage` - устанавливает источник и альтернативный текст для HTML-элемента изображения.

```ts
render(data?: Partial<T>): HTMLElement
```
- `render` - Метод обновляет компонент с переданными данными и возвращает корневой HTML-элемент.
___
### Класс EventEmitter
```ts
class EventEmitter implements IEvents
```
Класс предоставляет функциональность для управления событиями, включая добавление, удаление и вызов обработчиков событий. 

```ts
on<T extends object>(eventName: EventName, callback: (event: T) => void)
```
 - `on` - Добавляет обработчик для указанного события.

```ts
off(eventName: EventName, callback: Subscriber)
```
- `of` - Удаляет обработчик для указанного события.

```ts
emit<T extends object>(eventName: string, data?: T)
```
- `emit` - Вызывает все обработчики для указанного события.

```ts
onAll(callback: (event: EmitterEvent) => void)
```
- `onAll` - Добавляет обработчик для всех событий.

```ts
offAll()
```
- `offAll` - Удаляет все обработчики для всех событий.
  
```ts
trigger<T extends object>(eventName: string, context?: Partial<T>)
```
- `trigger` - Создает функцию-триггер, которая вызывает событие при вызове.
___
### Класс Model
```ts
abstract class Model<T>
```
Абстрактный базовый класс, предназначенный для создания моделей данных. Модели используются для представления и управления данными в приложении.

```ts
emitChanges(event: string, payload?: object) 
```
- `emitChanges` - Метод emitChanges инициирует событие с указанными данными.