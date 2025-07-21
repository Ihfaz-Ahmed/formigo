import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { X, Plus, Settings } from 'lucide-react';

const OptionsEditor = ({ options, onChange }) => {
  const [localOptions, setLocalOptions] = useState(options || []);

  useEffect(() => {
    setLocalOptions(options || []);
  }, [options]);

  const addOption = () => {
    const newOptions = [...localOptions, `Option ${localOptions.length + 1}`];
    setLocalOptions(newOptions);
    onChange(newOptions);
  };

  const removeOption = (index) => {
    const newOptions = localOptions.filter((_, i) => i !== index);
    setLocalOptions(newOptions);
    onChange(newOptions);
  };

  const updateOption = (index, value) => {
    const newOptions = localOptions.map((option, i) => 
      i === index ? value : option
    );
    setLocalOptions(newOptions);
    onChange(newOptions);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Options</Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={addOption}
          className="h-8 px-2"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add
        </Button>
      </div>
      
      <div className="space-y-2">
        {localOptions.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="flex-1"
            />
            {localOptions.length > 1 && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => removeOption(index)}
                className="h-10 w-10 p-0 text-destructive hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const FieldEditor = ({ selectedField, onUpdateField }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (selectedField) {
      setFormData({ ...selectedField });
    } else {
      setFormData({});
    }
  }, [selectedField]);

  const handleInputChange = (key, value) => {
    const newFormData = { ...formData, [key]: value };
    setFormData(newFormData);
    
    if (selectedField) {
      onUpdateField(selectedField.id, { [key]: value });
    }
  };

  if (!selectedField) {
    return (
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="flex flex-col items-center justify-center h-64 text-center">
          <Settings className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-muted-foreground mb-2">
            No Field Selected
          </h3>
          <p className="text-sm text-muted-foreground">
            Click on a field in the canvas to edit its properties
          </p>
        </CardContent>
      </Card>
    );
  }

  const fieldType = selectedField.type;
  const hasOptions = ['select', 'radio'].includes(fieldType);
  const hasPlaceholder = ['text', 'email', 'password', 'textarea', 'select'].includes(fieldType);
  const canBeRequired = fieldType !== 'submit';

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5" />
          Field Properties
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {fieldType.charAt(0).toUpperCase() + fieldType.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Label */}
        <div className="space-y-2">
          <Label htmlFor="field-label" className="text-sm font-medium">
            Label
          </Label>
          <Input
            id="field-label"
            value={formData.label || ''}
            onChange={(e) => handleInputChange('label', e.target.value)}
            placeholder="Enter field label"
          />
        </div>

        {/* Name/ID */}
        <div className="space-y-2">
          <Label htmlFor="field-name" className="text-sm font-medium">
            Field Name
          </Label>
          <Input
            id="field-name"
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="field_name"
          />
          <p className="text-xs text-muted-foreground">
            Used as the HTML name and id attribute
          </p>
        </div>

        {/* Placeholder */}
        {hasPlaceholder && (
          <div className="space-y-2">
            <Label htmlFor="field-placeholder" className="text-sm font-medium">
              Placeholder
            </Label>
            <Input
              id="field-placeholder"
              value={formData.placeholder || ''}
              onChange={(e) => handleInputChange('placeholder', e.target.value)}
              placeholder="Enter placeholder text"
            />
          </div>
        )}

        {/* Options */}
        {hasOptions && (
          <OptionsEditor
            options={formData.options}
            onChange={(options) => handleInputChange('options', options)}
          />
        )}

        {/* Default Value */}
        {fieldType === 'textarea' ? (
          <div className="space-y-2">
            <Label htmlFor="field-value" className="text-sm font-medium">
              Default Value
            </Label>
            <Textarea
              id="field-value"
              value={formData.value || ''}
              onChange={(e) => handleInputChange('value', e.target.value)}
              placeholder="Enter default value"
              rows={3}
            />
          </div>
        ) : fieldType === 'checkbox' ? (
          <div className="flex items-center justify-between">
            <Label htmlFor="field-checked" className="text-sm font-medium">
              Default Checked
            </Label>
            <Switch
              id="field-checked"
              checked={formData.value || false}
              onCheckedChange={(checked) => handleInputChange('value', checked)}
            />
          </div>
        ) : ['text', 'email', 'password'].includes(fieldType) ? (
          <div className="space-y-2">
            <Label htmlFor="field-value" className="text-sm font-medium">
              Default Value
            </Label>
            <Input
              id="field-value"
              type={fieldType === 'password' ? 'text' : fieldType}
              value={formData.value || ''}
              onChange={(e) => handleInputChange('value', e.target.value)}
              placeholder="Enter default value"
            />
          </div>
        ) : null}

        {/* Required */}
        {canBeRequired && (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="field-required" className="text-sm font-medium">
                Required Field
              </Label>
              <p className="text-xs text-muted-foreground">
                User must fill this field to submit the form
              </p>
            </div>
            <Switch
              id="field-required"
              checked={formData.required || false}
              onCheckedChange={(required) => handleInputChange('required', required)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 