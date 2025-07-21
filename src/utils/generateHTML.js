// Generate HTML from form fields configuration
export const generateHTML = (fields, options = {}) => {
  const { includeTailwind = false, includeStyles = true } = options;
  
  // Base styles for form elements (used when includeTailwind is false)
  const baseStyles = {
    form: 'max-width: 600px; margin: 0 auto; padding: 2rem; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);',
    label: 'display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151;',
    input: 'width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1rem; margin-bottom: 1rem;',
    textarea: 'width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1rem; margin-bottom: 1rem; min-height: 120px; resize: vertical;',
    select: 'width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1rem; margin-bottom: 1rem; background: white;',
    radio: 'margin-right: 0.5rem;',
    checkbox: 'margin-right: 0.5rem;',
    button: 'background: #3b82f6; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 6px; font-size: 1rem; cursor: pointer; transition: background-color 0.2s;',
    fieldset: 'border: 1px solid #e5e7eb; border-radius: 6px; padding: 1rem; margin-bottom: 1rem;',
    legend: 'font-weight: 600; color: #374151; padding: 0 0.5rem;'
  };
  
  // Tailwind classes for form elements
  const tailwindClasses = {
    form: 'max-w-2xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg',
    label: 'block mb-2 font-semibold text-gray-700 dark:text-gray-300',
    input: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white mb-4',
    textarea: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white mb-4 min-h-[120px] resize-y',
    select: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white mb-4',
    radio: 'mr-2',
    checkbox: 'mr-2',
    button: 'bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200',
    fieldset: 'border border-gray-300 dark:border-gray-600 rounded-md p-4 mb-4',
    legend: 'font-semibold text-gray-700 dark:text-gray-300 px-2'
  };
  
  const styles = includeTailwind ? tailwindClasses : baseStyles;
  
  let html = includeTailwind ? `<form class="${styles.form}">\n` : '<form>\n';
  
  fields.forEach((field) => {
    html += generateFieldHTML(field, styles, includeTailwind);
  });
  
  html += '</form>';
  
  return html;
};

const generateFieldHTML = (field, styles, includeTailwind) => {
  const { type, label, name, placeholder, required, options, value } = field;
  let html = '';
  
  const styleAttr = (element) => includeTailwind ? `class="${styles[element]}"` : '';
  
  switch (type) {
    case 'text':
    case 'email':
    case 'password':
      html += `  <div>\n`;
      if (label) {
        const labelStyle = styleAttr('label');
        html += `    <label for="${name}"${labelStyle ? ` ${labelStyle}` : ''}>${label}${required ? ' *' : ''}</label>\n`;
      }
      const inputStyle = styleAttr('input');
      html += `    <input type="${type}" id="${name}" name="${name}"${inputStyle ? ` ${inputStyle}` : ''}`;
      if (placeholder) html += ` placeholder="${placeholder}"`;
      if (required) html += ` required`;
      if (value) html += ` value="${value}"`;
      html += `>\n  </div>\n\n`;
      break;
      
    case 'textarea':
      html += `  <div>\n`;
      if (label) {
        const labelStyle = styleAttr('label');
        html += `    <label for="${name}"${labelStyle ? ` ${labelStyle}` : ''}>${label}${required ? ' *' : ''}</label>\n`;
      }
      const textareaStyle = styleAttr('textarea');
      html += `    <textarea id="${name}" name="${name}"${textareaStyle ? ` ${textareaStyle}` : ''}`;
      if (placeholder) html += ` placeholder="${placeholder}"`;
      if (required) html += ` required`;
      html += `>${value || ''}</textarea>\n  </div>\n\n`;
      break;
      
    case 'select':
      html += `  <div>\n`;
      if (label) {
        const labelStyle = styleAttr('label');
        html += `    <label for="${name}"${labelStyle ? ` ${labelStyle}` : ''}>${label}${required ? ' *' : ''}</label>\n`;
      }
      const selectStyle = styleAttr('select');
      html += `    <select id="${name}" name="${name}"${selectStyle ? ` ${selectStyle}` : ''}`;
      if (required) html += ` required`;
      html += `>\n`;
      if (placeholder) {
        html += `      <option value="" disabled selected>${placeholder}</option>\n`;
      }
      if (options) {
        options.forEach(option => {
          const isSelected = value === option ? ' selected' : '';
          html += `      <option value="${option}"${isSelected}>${option}</option>\n`;
        });
      }
      html += `    </select>\n  </div>\n\n`;
      break;
      
    case 'radio':
      const fieldsetStyle = styleAttr('fieldset');
      html += `  <fieldset${fieldsetStyle ? ` ${fieldsetStyle}` : ''}>\n`;
      if (label) {
        const legendStyle = styleAttr('legend');
        html += `    <legend${legendStyle ? ` ${legendStyle}` : ''}>${label}${required ? ' *' : ''}</legend>\n`;
      }
      if (options) {
        const radioStyle = styleAttr('radio');
        options.forEach((option, index) => {
          const isChecked = value === option ? ' checked' : '';
          html += `    <div>\n`;
          html += `      <input type="radio" id="${name}_${index}" name="${name}" value="${option}"${radioStyle ? ` ${radioStyle}` : ''}${isChecked}`;
          if (required && index === 0) html += ` required`;
          html += `>\n`;
          html += `      <label for="${name}_${index}">${option}</label>\n`;
          html += `    </div>\n`;
        });
      }
      html += `  </fieldset>\n\n`;
      break;
      
    case 'checkbox':
      html += `  <div>\n`;
      const checkboxStyle = styleAttr('checkbox');
      html += `    <input type="checkbox" id="${name}" name="${name}"${checkboxStyle ? ` ${checkboxStyle}` : ''}`;
      if (required) html += ` required`;
      if (value) html += ` checked`;
      html += `>\n`;
      if (label) {
        html += `    <label for="${name}">${label}${required ? ' *' : ''}</label>\n`;
      }
      html += `  </div>\n\n`;
      break;
      
    case 'button':
    case 'submit':
      const buttonStyle = styleAttr('button');
      html += `  <button type="${type === 'button' ? 'button' : 'submit'}"${buttonStyle ? ` ${buttonStyle}` : ''}>${label || 'Submit'}</button>\n\n`;
      break;
      
    default:
      break;
  }
  
  return html;
};

// Generate JSON configuration from fields
export const generateJSON = (fields) => {
  return JSON.stringify({ fields }, null, 2);
}; 