import { UniqueResponses } from "./uniqueResponses.model";
import { PutInOrders } from "./putInOrders.model";
import { Pairs } from "./pairs.model";

export class Exercise {
    id_page!: number;
    question!: string;
    feedback!: string;
    type!: string;
    createdAt?: string;
    updatedAt?: string;

    UniqueResponses?: UniqueResponses[];
    PutInOrders?: PutInOrders[];
    Pairs?: Pairs[];
}