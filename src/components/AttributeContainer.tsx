import React, { ChangeEvent, Dispatch } from 'react'
import { ArrayItem, JSONAttribute } from '../types';

type AttributeContainerProps = {
    index: number;
    attribute: JSONAttribute,
    jsonAttributes: JSONAttribute[];
    setJsonAttributes: Dispatch<JSONAttribute[]>;
    handleRemoveAttribute: (index: number) => void;
}

const AttributeContainer: React.FC<AttributeContainerProps> = ({ 
  index,
  attribute,
  jsonAttributes,
  setJsonAttributes,
  handleRemoveAttribute
}) => {

  const handleAttributeChange = (index: number, key: keyof JSONAttribute, value: string | ArrayItem[]) => {
    const updatedAttributes = structuredClone(jsonAttributes);

    if(key === 'type' && (value === 'string' || value === 'number' || value === 'boolean') || value === 'array') {
      updatedAttributes[index][key] = value;
      if(value === 'array' && jsonAttributes[index].type !== 'array') {
        updatedAttributes[index].value = ""
      }
    }
    else if(key === 'value' && (typeof value === 'string' || Array.isArray(value))) {
      updatedAttributes[index][key] = value;
    }
    else if(key === 'name' && typeof value === 'string') {
      updatedAttributes[index][key] = value;
    }    

    setJsonAttributes(updatedAttributes);
  };

  const handleArrayItemChange = (parentIndex: number, childIndex: number, key: keyof ArrayItem, value: string) => {
    const originalAttributes = structuredClone(jsonAttributes);

    if (!Array.isArray(originalAttributes[parentIndex].value)) return;

    const arrayItem = structuredClone(originalAttributes[parentIndex].value);

    const item = arrayItem[childIndex] as ArrayItem;

    if (key === 'type' && (value === 'string' || value === 'number' || value === 'boolean')) {
      item.type = value as 'string' | 'number' | 'boolean';
    } else if (key === 'value') {
      item.value = value;
    }

    originalAttributes[parentIndex].value = arrayItem;
    setJsonAttributes(originalAttributes);
  };


  const handleAddArrayItem = (index: number) => {
    const originalAttributes = structuredClone(jsonAttributes);

    if(!Array.isArray(originalAttributes[index].value)) {
      originalAttributes[index].value = []
    }

    originalAttributes[index].value.push({ type: 'string', value: '' });
    setJsonAttributes(originalAttributes);
  };

  const handleRemoveArrayItem = (parentIndex: number, childIndex: number) => {
    const originalAttributes = structuredClone(jsonAttributes);
    
    if(childIndex === 0 || !Array.isArray(originalAttributes[parentIndex].value)) return;

    const filteredAttributes = originalAttributes[parentIndex].value.filter((attribute, attrIndex) => {
      if(attrIndex !== index) return;
      return attribute;
    });
    originalAttributes[parentIndex].value = filteredAttributes
    setJsonAttributes(originalAttributes);
  }


  const renderArrayItems = (parentIndex: number, arrayItems: ArrayItem[]) => {
    return arrayItems.map((item, childIndex) => (
      <div key={childIndex} className='array-items'>
        <select
          value={item.type}
          onChange={(e) => handleArrayItemChange(parentIndex, childIndex, 'type', e.target.value)}
        >
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
        </select>
        <input
          type="text"
          placeholder="Array Value"
          value={item.value}
          onChange={(e) => handleArrayItemChange(parentIndex, childIndex, 'value', e.target.value)}
        />
        {
          childIndex > 0 && (
            <button className='remove-btn' onClick={() => handleRemoveArrayItem(parentIndex, childIndex)}>Remove Item</button>
          )
        }
      </div>
    ));
  };

  return (
    <div className='attribute-row-container' key={index}>
      <div className='text-attribute'>
        <select
          value={attribute.type}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => handleAttributeChange(index, 'type', e.target.value)}
        >
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
          <option value="array">Array</option>
        </select>
        <input
          type="text"
          placeholder="Attribute Name"
          value={attribute.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleAttributeChange(index, 'name', e.target.value)}
        />
        { attribute.type !== 'array' ? (
            <input
              type="text"
              placeholder="Attribute Value"
              value={attribute.value?.toString()}
              onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
            />
          ) : (
            <button onClick={() => handleAddArrayItem(index)}>Add Array Item</button>
          )
        }
        {
          index > 0 && (
            <button className='remove-btn' onClick={() => handleRemoveAttribute(index)}>Remove Attribute</button>
          )
        }
      </div>
      {attribute.type === 'array' && (
        <div className='array-attribute-container'>
          {renderArrayItems(index, Array.isArray(attribute.value) ? attribute.value : [])}
        </div>
      )}
    </div>
  )
}

export default AttributeContainer