import { useState } from 'react'
import './App.css'
import AttributeContainer from './components/AttributeContainer';
import { JSONAttribute } from './types';

function App() {
  const [jsonContent, setJSONContent] = useState<string>(JSON.stringify({}));
  const [jsonAttributes, setJsonAttributes] = useState<JSONAttribute[]>([
    { name: "", type: "string", value: "" }
  ]);
  const [error, setError] = useState<string>("");


  const handleAddAttribute = () => {
    const originalAttributes = structuredClone(jsonAttributes);
    originalAttributes.push({ name: '', type: 'string', value: '' });
    setJsonAttributes(originalAttributes);
  };

  const handleRemoveAttribute = (index: number) => {
    console.log('Test')
    const originalAttributes = structuredClone(jsonAttributes);
    if(index === 0) return;
    const filteredAttributes = originalAttributes.filter((attribute, attrIndex) => {
      if(attrIndex !== index) return;
      return attribute;
    });
    setJsonAttributes(filteredAttributes);
  }

  const handleConvertJSON = () => {
    try {
      const json: Record<string, string | string[] | number[] | boolean[]> = {};
      jsonAttributes.forEach((attribute) => {
        let attributeValue;
        const attributeName = attribute.name;
        if(attribute.type === 'string') attributeValue = attribute.value.toString();
        else if(attribute.type === 'number') attributeValue = parseInt(attribute.value.toString());
        else if(attribute.type === 'boolean') attributeValue = (attribute.value === 'true');
        else if(attribute.type === 'array' && Array.isArray(attribute.value)) attributeValue = attribute.value.map((item) => item.value);

        const jsonAttributeValue = attributeValue;
        json[attributeName] = jsonAttributeValue;
      })

      setJSONContent(JSON.stringify(json, undefined, 4));
    }
    catch (error) {
      console.log({error})
      if(error instanceof Error) {
        setError(error.message);
      }
    }
  }

  const resetJSON = () => {
    setJsonAttributes([{ name: "", type: "string", value: "" }]);
    setJSONContent(JSON.stringify({}));
  }

  return (
    <main className='main-content'>
      <section className='instructions-section'>
        <h1>Simple JSON Generator</h1>
        <p className='instructions'>Generate JSON by adding attributes</p>
      </section>

      <section className='json-builder'>
        <div className='json-builder-buttons'>
          <button onClick={() => handleAddAttribute()}>Add New Atrribute</button>
          <button onClick={() => handleConvertJSON()}>Generate JSON</button>
          <button onClick={() => resetJSON()}>Clear JSON Attributes</button>
        </div>
        <div className='json-builder-content'>
          {
            jsonAttributes.map((attribute, index) => {
              return (
                <AttributeContainer
                  key={index}
                  index={index}
                  attribute={attribute}
                  setJsonAttributes={setJsonAttributes}
                  handleRemoveAttribute={handleRemoveAttribute}
                  jsonAttributes={jsonAttributes}
                />
              )
            })
          }
        </div>
      </section>

      <section className='json-content'>
        { error.length > 0 && <span className='error-message'>{error}</span> }
        {
          <textarea readOnly value={jsonContent} />
        }
      </section>
    </main>
  )
}

export default App
