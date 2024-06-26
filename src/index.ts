import './scss/styles.scss';
import { AppState } from './components/appstate';
import { Contacts, OrderForm } from './components/order';
import { IOrder, IProduct } from './types';
import { EventEmitter } from './components/base/events';
import { Card } from './components/card';
import { Modal } from './components/modal';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/page';
import { productAPI } from './components/productAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { Basket } from './components/basket';
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

const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
		modal.close();
	},
});

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
	events.emit('preview:changed', item);
});

events.on('preview:changed', (item: IProduct) => {
	const { id, title, image, category, description, price } = item;
	const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('card:add', item),
	});
	cardPreview.isInBasket = appData.isItemInBasket(item);
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
	if (appData.isItemInBasket(item)) {
		return;
	}
	appData.addToBasket(item);
	page.counter = appData.getBasketAmount();
	modal.close();
});

events.on('card:remove', (item: IProduct) => {
	appData.removeFromBasket(item);
	page.counter = appData.getBasketAmount();
});

events.on('basket:changed', () => {
	let indexCounter = 1;
	const basketItems = appData.basket.map((item) => {
		const { title, price } = item;
		const cardItem = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:remove', item),
		});
		return cardItem.render({
			index: indexCounter++,
			title: title,
			price: price !== null ? price : null,
		});
	});
	basket.items = basketItems;
	basket.total = appData.getTotalPrice();
});

events.on('basket:open', () => {
	const modalContent = basket.render();
	modal.render({
		content: modalContent,
	});
});

events.on('order:open', () => {
	appData.validateOrder();

	modal.render({
		content: order.render({
			address: '',
			payment: '',
			valid: false,
			errors: appData.formErrors.payment,
		}),
	});
});

events.on('order:submit', () => {
	appData.validateContact();

	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: appData.formErrors.phone,
		}),
	});
});

events.on('orderFormError:change', (errors: Partial<IOrder>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

events.on('order.address:change', (data: { value: string }) => {
	appData.setAddress(data.value);
});

events.on('order:payment', (data: { payment: string }) => {
	appData.setPayment(data.payment);
});

events.on('contactFormError:change', (errors: Partial<IOrder>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

events.on('contacts.email:change', (data: { value: string }) => {
	appData.setEmail(data.value);
});

events.on('contacts.phone:change', (data: { value: string }) => {
	appData.setPhone(data.value);
});

events.on('contacts:submit', () => {
	appData.order.total = appData.getTotalPrice();

	appData.order.items = appData.basket.map((item) => item.id);

	api
		.createOrder(appData.order)
		.then((result) => {
			appData.clearBasket();
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
});

events.on('modal:open', () => (page.locked = true));
events.on('modal:close', () => (page.locked = false));
