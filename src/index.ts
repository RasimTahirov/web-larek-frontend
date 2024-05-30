import './scss/styles.scss';
import { AppState } from './components/appstate';
import { Contacts, OrderForm } from './components/order';
import { IProduct } from './types';
import { EventEmitter } from './components/base/events';
import { Card } from './components/card';
import { Modal } from './components/modal';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/page';
import { productAPI } from './components/productAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { Basket,  } from './components/basket';
import { Success } from './components/success';
const events = new EventEmitter();
const appData = new AppState({}, events);

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const api = new productAPI(CDN_URL, API_URL);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);

api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});

events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const { id, category, title, price, image } = item;
		const cardCatalog = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return cardCatalog.render({
			id,
			category,
			title,
			price,
			image,
		});
	});
});

events.on('card:select', (item: IProduct) => {
	appData.setPreview(item);
});

events.on('preview:changed', (item: IProduct) => {
	const { id, title, image, category, description, price } = item;
	const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('card:add', item),
	});
	modal.render({
		content: cardPreview.render({
			id,
			title,
			image,
			category,
			description,
			price,
		}),
	});
});

events.on('card:add', (item: IProduct) => {
	appData.addToBasket(item);
	page.counter = appData.getBasketAmount();
	modal.close();
});

events.on('basket:changed', () => {
	let indexCounter = 1;

	const basketItems = appData.basket.map((item) => {
		const { title, price } = item;
		const cardItem = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:remove', item),
		});
		cardItem.index = indexCounter++;
		cardItem.title = title;
		cardItem.price = price !== null ? price.toString() : null;
		return cardItem.render();
	});
	basket.items = basketItems;
	basket.total = appData.getTotalPrice();
});

events.on('card:remove', (item: IProduct) => {
	appData.removeFromBasket(item);
	page.counter = appData.getBasketAmount();
});

events.on('contact:open', () => {
	const contactsModalContent = cloneTemplate(contactsTemplate);
	modal.render({ content: contactsModalContent });
	modal.open();

	const formContainer = ensureElement<HTMLFormElement>('.form[name="contacts"]');
	new Contacts(formContainer, events, appData);
});

events.on('basket:open', () => {
	const modalContent = basket.render();
	modal.render({ content: modalContent });
});

events.on('order:open', () => {
	modal.render({ content: cloneTemplate(orderTemplate) });
	new OrderForm(ensureElement<HTMLFormElement>('.form[name="order"]'), events, appData);
	modal.open();
});

events.on('order:payment', (event: { payment: string }) => {
	appData.setPayment(event.payment);
});

events.on('order:address', (event: { address: string }) => {
	appData.setAddress(event.address);
});

events.on('contacts:submit', (data: { email: string; phone: string }) => {
	if (data && data.email && data.phone) {
		appData.setEmail(data.email);
		appData.setPhone(data.phone);
		appData.updateOrderItems();

		const totalPrice = appData.getTotalPrice();
		appData.order.total = totalPrice;

		console.log(appData.order);

		api
			.createOrder(appData.order)
			.then((result) => {
				appData.clearBasket();

				const success = new Success(cloneTemplate(successTemplate), {
					onClick: () => modal.close(),
				});

				modal.render({
					content: success.render({
						total: result.total,
					}),
				});
				appData.resetOrder();
			})
			.catch((err) => {
				console.error(err);
			});
	}
});

events.on('modal:open', () => (page.locked = true));
events.on('modal:close', () => (page.locked = false));
