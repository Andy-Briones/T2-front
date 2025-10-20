import { Category } from "./category";
import { Family } from "./family";
import { Laboratory } from "./laboratory";

export class Product {
    id_product: number;
    description: string
    expired: string;
    name: string
    presentation: string;
    stock: number;
    unuit_price: number;
    category: Category;  
    laboratory: Laboratory;  
    family: Family; 
}
