import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useDraggable } from '@dnd-kit/core';
import { 
  Type, 
  Mail, 
  Lock, 
  FileText, 
  ChevronDown, 
  Circle, 
  CheckSquare, 
  Send 
} from 'lucide-react';

// Map field types to icons
const FIELD_ICONS = {
  text: Type,
  email: Mail,
  password: Lock,
  textarea: FileText,
  select: ChevronDown,
  radio: Circle,
  checkbox: CheckSquare,
  submit: Send
};

const DraggableFieldButton = ({ fieldType, fieldConfig, onAddField }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `palette-${fieldType}`,
    data: {
      type: 'field-type',
      fieldType: fieldType,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const IconComponent = FIELD_ICONS[fieldType] || Type;

  return (
    <Button
      ref={setNodeRef}
      style={style}
      variant="ghost"
      className={`w-full justify-start h-auto p-4 text-left hover:bg-accent/50 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={() => onAddField(fieldType)}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-center gap-3 w-full">
        <div className="flex-shrink-0">
          <IconComponent className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{fieldConfig.label}</div>
          <div className="text-xs text-muted-foreground truncate">
            {getFieldDescription(fieldType)}
          </div>
        </div>
      </div>
    </Button>
  );
};

const getFieldDescription = (fieldType) => {
  const descriptions = {
    text: 'Single line text input',
    email: 'Email address input with validation',
    password: 'Password input with hidden text',
    textarea: 'Multi-line text input',
    select: 'Dropdown selection menu',
    radio: 'Single choice from multiple options',
    checkbox: 'Boolean checkbox input',
    submit: 'Form submission button'
  };
  return descriptions[fieldType] || 'Form field';
};

export const FieldPalette = ({ formState }) => {
  const { FIELD_TYPES, addField } = formState;

  const inputFields = ['text', 'email', 'password', 'textarea'];
  const selectionFields = ['select', 'radio', 'checkbox'];
  const actionFields = ['submit'];

  const renderFieldGroup = (title, fieldTypes) => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">
        {title}
      </h3>
      <div className="space-y-1">
        {fieldTypes.map((fieldType) => (
          <DraggableFieldButton
            key={fieldType}
            fieldType={fieldType}
            fieldConfig={FIELD_TYPES[fieldType]}
            onAddField={addField}
          />
        ))}
      </div>
    </div>
  );

  return (
    <Card className="border-none shadow-none bg-transparent custom-scrollbar overflow-y-auto h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Field Types</CardTitle>
        <p className="text-sm text-muted-foreground">
          Drag fields to the canvas or click to add
        </p>
      </CardHeader>
      
      <CardContent className="space-y-0">
        {renderFieldGroup('Input Fields', inputFields)}
        {renderFieldGroup('Selection Fields', selectionFields)}
        {renderFieldGroup('Action Fields', actionFields)}
      </CardContent>
    </Card>
  );
}; 