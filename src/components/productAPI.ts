import { Api, ApiListResponse } from './base/api';
import { IProduct, IOrder, SuccessfulOrder } from '../types';

export interface ProductService {
	getProductById: (id: string) => Promise<IProduct>;
	getProductList: () => Promise<IProduct[]>;
	createOrder: (order: IOrder) => Promise<SuccessfulOrder>;
}

export class productAPI extends Api implements ProductService {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductById(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`).then((item: IProduct) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	createOrder(order: IOrder): Promise<SuccessfulOrder> {
		return this.post('/order', order).then((result: SuccessfulOrder) => ({
			id: result.id,
			total: result.total,
		}));
	}
}