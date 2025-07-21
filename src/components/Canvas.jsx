import React from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';
import { useDroppable } from '@dnd-kit/core';
import { FormField } from './FormField';
import { Card } from './ui/card';
import { PlusCircle } from 'lucide-react';

const DroppableCanvas = ({ children, isEmpty }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'canvas',
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 p-6 overflow-y-auto custom-scrollbar transition-colors ${
        isOver ? 'bg-accent/20' : ''
      }`}
    >
      <Card className={`min-h-full p-8 transition-all ${
        isOver ? 'border-primary shadow-lg' : 'border-dashed'
      }`}>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full min-h-96 text-center">
            <PlusCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              Start Building Your Form
            </h3>
            <p className="text-muted-foreground max-w-md">
              Click on the field types from the left panel to the add them to your form. 
              You can reorder fields by dragging them up or down.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold mb-2">Form Preview</h3>
              <p className="text-sm text-muted-foreground">
                Drag to reorder • Click to select and edit
              </p>
            </div>
            {children}
          </div>
        )}
      </Card>
    </div>
  );
};

export const Canvas = ({ formState }) => {
  const {
    fields,
    selectedField,
    setSelectedField,
    addField,
    removeField,
    reorderFields,
  } = formState;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    // Handle dropping field type from palette to canvas
    if (active.data.current?.type === 'field-type' && over.id === 'canvas') {
      const fieldType = active.data.current.fieldType;
      addField(fieldType);
      return;
    }

    // Handle reordering fields within canvas
    if (active.data.current?.type === 'form-field' && over.data.current?.type === 'form-field') {
      const activeIndex = fields.findIndex(field => field.id === active.id);
      const overIndex = fields.findIndex(field => field.id === over.id);

      if (activeIndex !== overIndex) {
        reorderFields(activeIndex, overIndex);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <DroppableCanvas isEmpty={fields.length === 0}>
        {fields.length > 0 && (
          <SortableContext items={fields} strategy={verticalListSortingStrategy}>
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                field={field}
                index={index}
                isSelected={selectedField?.id === field.id}
                onSelect={() => setSelectedField(field)}
                onRemove={() => removeField(field.id)}
              />
            ))}
          </SortableContext>
        )}
      </DroppableCanvas>
    </DndContext>
  );
}; 