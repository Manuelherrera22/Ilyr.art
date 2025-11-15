import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';

const PropertiesSidebar = ({ element, updateElement }) => {
  const { register, watch, setValue, reset } = useForm();

  useEffect(() => {
    if (element) {
      reset(element);
    }
  }, [element, reset]);

  useEffect(() => {
    if (!element) return;
    const subscription = watch((value) => {
      updateElement(element.id, value);
    });
    return () => subscription.unsubscribe();
  }, [watch, element, updateElement]);

  const parseAndSetValue = (name, value, isNumber = true) => {
    let parsedValue = isNumber ? parseInt(value.toString().replace('px', ''), 10) : value;
    if (isNumber && isNaN(parsedValue)) parsedValue = 0;
    setValue(name, parsedValue);
  }

  if (!element) {
    return (
      <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0 bg-[#0B0D12]/80 backdrop-blur-xl border-l border-white/10 rounded-lg p-3 sm:p-4 flex items-center justify-center max-h-full overflow-hidden">
        <p className="text-white/60 text-center text-sm sm:text-base px-2">Selecciona un elemento para editar sus propiedades.</p>
      </aside>
    );
  }

  return (
    <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0 bg-[#0B0D12]/80 backdrop-blur-xl border-l border-white/10 rounded-lg p-3 sm:p-4 flex flex-col space-y-3 sm:space-y-4 custom-scrollbar overflow-y-auto max-h-full">
        <h2 className="text-lg sm:text-xl font-bold text-white">Propiedades</h2>
        
        {element.type === 'text' && (
            <>
                <div className="space-y-2">
                    <Label htmlFor="content" className="text-white/80">Contenido</Label>
                    <Textarea id="content" {...register('content')} className="bg-background/50 text-white" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="fontSize" className="text-white/80">Tamaño de Fuente ({watch('fontSize') || 0}px)</Label>
                    <Slider 
                        defaultValue={[element.fontSize || 16]} 
                        max={128} 
                        min={8} 
                        step={1} 
                        onValueChange={(val) => setValue('fontSize', val[0])}
                    />
                </div>
            </>
        )}

        <div className="space-y-2">
            <Label htmlFor="x" className="text-white/80">Posición X</Label>
            <Input id="x" type="number" {...register('x', { valueAsNumber: true })} className="bg-background/50 text-white" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="y" className="text-white/80">Posición Y</Label>
            <Input id="y" type="number" {...register('y', { valueAsNumber: true })} className="bg-background/50 text-white" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="width" className="text-white/80">Ancho</Label>
            <Input id="width" type="number" {...register('width', { valueAsNumber: true, onChange: (e) => parseAndSetValue('width', e.target.value) })} className="bg-background/50 text-white" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="height" className="text-white/80">Alto</Label>
            <Input id="height" type="number" {...register('height', { valueAsNumber: true, onChange: (e) => parseAndSetValue('height', e.target.value) })} className="bg-background/50 text-white" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="rotation" className="text-white/80">Rotación ({watch('rotation') || 0}°)</Label>
            <Slider 
                defaultValue={[element.rotation || 0]} 
                max={360} 
                min={0} 
                step={1}
                onValueChange={(val) => setValue('rotation', val[0])}
            />
        </div>
    </aside>
  );
};

export default PropertiesSidebar;