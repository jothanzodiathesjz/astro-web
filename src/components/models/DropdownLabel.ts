export interface IDropdownLabel<T = any> {
    id: string;
    label: string;
    subtitle?: string;
    value: T;
}

export class DropdownLabel<T = any> implements IDropdownLabel<T> {
    id: string;
    label: string;
    subtitle?: string | undefined;
    value: T;

    constructor(value: T, id?: keyof T, label?: keyof T) {
        this.id = (id !== undefined ? value[id] : value) as unknown as string;
        this.label = (label !== undefined
            ? value[label]
            : value) as unknown as string;
        this.value = value;
    }
}
