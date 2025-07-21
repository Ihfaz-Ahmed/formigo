import React from 'react';
import { useFormBuilderState } from './hooks/useFormBuilderState';
import { FieldPalette } from './components/FieldPalette';
import { Canvas } from './components/Canvas';
import { FieldEditor } from './components/FieldEditor';
import { CodeOutput } from './components/CodeOutput';
import { Button } from './components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { Undo, Redo, Trash2, FormInput } from 'lucide-react';

function App() {
  const formState = useFormBuilderState();
  const {
    fields,
    selectedField,
    clearFields,
    undo,
    redo,
    canUndo,
    canRedo,
  } = formState;

  return (
    <div className="h-[100dvh] lg:h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b bg-card px-4 py-2 flex flex-col items-center gap-0 lg:flex-row lg:items-center lg:justify-between lg:px-6 lg:py-4">
        <div className="w-full flex flex-wrap items-center justify-center gap-x-2 gap-y-1 lg:w-auto lg:flex-nowrap lg:justify-start">
          <FormInput className="h-7 w-7 text-primary lg:h-8 lg:w-8" />
          <h1 className="text-xl font-bold lg:text-2xl whitespace-nowrap">Formigo</h1>
          <span className="text-muted-foreground text-xs lg:text-sm lg:ml-2 whitespace-normal text-center lg:text-left">Drag & Drop Form Builder</span>
        </div>
        <div className="w-full flex justify-center mt-4 mb-1 gap-2 lg:mt-0 lg:mb-0 lg:w-auto lg:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={!canUndo}
            className="flex items-center gap-1"
          >
            <Undo className="h-4 w-4" />
            <span className="hidden sm:inline">Undo</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={!canRedo}
            className="flex items-center gap-1"
          >
            <Redo className="h-4 w-4" />
            <span className="hidden sm:inline">Redo</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearFields}
            disabled={fields.length === 0}
            className="flex items-center gap-1 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Mobile/Tablet: All-in-one tabs layout */}
        <div className="flex-1 flex flex-col lg:hidden min-h-0">
          <Tabs defaultValue="canvas" className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-3 m-4 mb-2 flex-shrink-0">
              <TabsTrigger value="fields" className="text-xs">Fields</TabsTrigger>
              <TabsTrigger value="canvas" className="text-xs">Canvas</TabsTrigger>
              <TabsTrigger value="editor" className="text-xs">Editor</TabsTrigger>
            </TabsList>
            
            <TabsContent value="fields" className="flex-1 overflow-y-auto px-4 pb-4 min-h-0 data-[state=active]:flex data-[state=active]:flex-col">
              <FieldPalette formState={formState} />
            </TabsContent>
            
            <TabsContent value="canvas" className="flex-1 min-h-0 data-[state=active]:flex data-[state=active]:flex-col">
              <div className="flex-1 overflow-y-auto">
                <Canvas formState={formState} />
              </div>
            </TabsContent>
            
            <TabsContent value="editor" className="flex-1 min-h-0 data-[state=active]:flex data-[state=active]:flex-col">
              <Tabs defaultValue="properties" className="flex-1 flex flex-col min-h-0">
                <TabsList className="grid w-full grid-cols-2 m-4 mb-2 flex-shrink-0">
                  <TabsTrigger value="properties">Properties</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                </TabsList>
                
                <TabsContent value="properties" className="flex-1 overflow-y-auto px-4 pb-4 min-h-0 data-[state=active]:flex data-[state=active]:flex-col">
                  <FieldEditor 
                    selectedField={selectedField} 
                    onUpdateField={formState.updateField}
                  />
                </TabsContent>
                
                <TabsContent value="code" className="flex-1 overflow-y-auto px-4 pb-4 min-h-0 data-[state=active]:flex data-[state=active]:flex-col">
                  <CodeOutput fields={fields} />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop: Three-column layout */}
        <div className="hidden lg:flex flex-1 overflow-hidden">
          {/* Left Sidebar - Field Palette */}
          <div className="w-80 border-r bg-card/50 overflow-y-auto">
            <FieldPalette formState={formState} />
          </div>

          {/* Center - Canvas */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Canvas formState={formState} />
          </div>

          {/* Right Sidebar - Field Editor & Code Output */}
          <div className="w-96 border-l bg-card/50 flex flex-col h-full">
            <Tabs defaultValue="editor" className="flex-1 flex flex-col h-full">
              <TabsList className="grid w-full grid-cols-2 m-4 mb-2 flex-shrink-0">
                <TabsTrigger value="editor">Field Editor</TabsTrigger>
                <TabsTrigger value="code">Code Output</TabsTrigger>
              </TabsList>
              
              <TabsContent value="editor" className="flex-1 overflow-y-auto px-4 pb-4 min-h-0 custom-scrollbar">
                <FieldEditor 
                  selectedField={selectedField} 
                  onUpdateField={formState.updateField}
                />
              </TabsContent>
              
              <TabsContent value="code" className="flex-1 overflow-y-auto px-4 pb-4 min-h-0 custom-scrollbar">
                <CodeOutput fields={fields} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 