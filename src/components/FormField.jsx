import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  GripVertical, 
  Trash2, 
  Copy,
  Type,
  Mail,
  Lock,
  FileText,
  ChevronDown,
  Circle,
  CheckSquare,
  Send
} from 'lucide-react';

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

const FieldPreview = ({ field }) => {
  const { type, label, placeholder, required, options, value } = field;

  switch (type) {
    case 'text':
    case 'email':
    case 'password':
      return (
        <div className="space-y-2">
          {label && (
            <Label className="text-sm font-medium">
              {label}{required && <span className="text-destructive ml-1">*</span>}
            </Label>
          )}
          <Input 
            type={type}
            placeholder={placeholder} 
            defaultValue={value}
            disabled
            className="cursor-default"
          />
        </div>
      );

    case 'textarea':
      return (
        <div className="space-y-2">
          {label && (
            <Label className="text-sm font-medium">
              {label}{required && <span className="text-destructive ml-1">*</span>}
            </Label>
          )}
          <Textarea 
            placeholder={placeholder}
            defaultValue={value}
            disabled
            className="cursor-default resize-none"
            rows={3}
          />
        </div>
      );

    case 'select':
      return (
        <div className="space-y-2">
          {label && (
            <Label className="text-sm font-medium">
              {label}{required && <span className="text-destructive ml-1">*</span>}
            </Label>
          )}
          <Select disabled>
            <SelectTrigger className="cursor-default">
              <SelectValue placeholder={placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case 'radio':
      return (
        <div className="space-y-2">
          {label && (
            <Label className="text-sm font-medium">
              {label}{required && <span className="text-destructive ml-1">*</span>}
            </Label>
          )}
          <div className="space-y-2 pl-2">
            {options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name={field.name}
                  id={`${field.id}_${index}`}
                  disabled
                  defaultChecked={value === option}
                  className="cursor-default"
                />
                <Label htmlFor={`${field.id}_${index}`} className="cursor-default">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </div>
      );

    case 'checkbox':
      return (
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id={field.id}
            disabled
            defaultChecked={value}
            className="cursor-default"
          />
          <Label htmlFor={field.id} className="cursor-default">
            {label}{required && <span className="text-destructive ml-1">*</span>}
          </Label>
        </div>
      );

    case 'submit':
      return (
        <Button type="submit" disabled className="cursor-default">
          {label || 'Submit'}
        </Button>
      );

    default:
      return (
        <div className="text-muted-foreground text-sm">
          Unknown field type: {type}
        </div>
      );
  }
};

export const FormField = ({ field, index, isSelected, onSelect, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: field.id,
    data: {
      type: 'form-field',
      field,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const IconComponent = FIELD_ICONS[field.type] || Type;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`group relative transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-primary shadow-lg' 
          : 'hover:shadow-md'
      } ${
        isDragging 
          ? 'opacity-50 rotate-3 scale-105' 
          : ''
      }`}
      onClick={onSelect}
    >
      <div className="p-4">
        {/* Field Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconComponent className="h-4 w-4" />
            <span className="font-medium">{field.type.charAt(0).toUpperCase() + field.type.slice(1)}</span>
            <span className="text-xs">#{index + 1}</span>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            
            <div
              className="flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-3 w-3" />
            </div>
          </div>
        </div>

        {/* Field Preview */}
        <div className="pointer-events-none">
          <FieldPreview field={field} />
        </div>
      </div>
    </Card>
  );
}; 