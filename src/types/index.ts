export interface JSONAttribute {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'array';
    value: string | ArrayItem[];
}
  
export interface ArrayItem {
    type: 'string' | 'number' | 'boolean';
    value: string;
}