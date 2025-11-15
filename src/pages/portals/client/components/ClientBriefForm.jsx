import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { createClientBrief } from '@/services/api/briefs';

const INITIAL_REFERENCES = [''];

const INITIAL_FORM_STATE = {
  projectTitle: '',
  objective: '',
  audience: '',
  keyMessages: '',
  successMetrics: '',
  budgetRange: '',
  deadline: '',
  distributionChannels: '',
  references: INITIAL_REFERENCES,
  additionalNotes: '',
};

const steps = [
  { id: 1, title: 'Contexto', description: 'Cuéntanos lo esencial del proyecto.' },
  { id: 2, title: 'Estrategia', description: 'Objetivos, audiencias y mensajes clave.' },
  { id: 3, title: 'Referencias', description: 'Inspiraciones, canales y notas adicionales.' },
  { id: 4, title: 'Confirmación', description: 'Revisa y envía el brief al estudio.' },
];

const StepIndicator = ({ currentStep }) => (
  <div className="mb-10 flex flex-wrap items-center gap-4">
    {steps.map((step, index) => {
      const isActive = index === currentStep;
      const isCompleted = index < currentStep;
      return (
        <div key={step.id} className="flex items-center">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-all ${
              isActive
                ? 'border-accent bg-accent text-accent-foreground shadow-lg'
                : isCompleted
                ? 'border-primary bg-primary/20 text-primary'
                : 'border-white/20 text-white/60'
            }`}
          >
            {step.id}
          </div>
          <div className="ml-3 mr-6">
            <p className="text-sm font-semibold text-white">{step.title}</p>
            <p className="text-xs text-white/60">{step.description}</p>
          </div>
        </div>
      );
    })}
  </div>
);

const ReviewItem = ({ label, value }) => (
  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
    <p className="text-xs uppercase tracking-widest text-white/40">{label}</p>
    <p className="mt-2 text-sm font-medium text-white/90 whitespace-pre-line">{value || '—'}</p>
  </div>
);

const ClientBriefForm = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { clientAccountId } = useProfile();

  const referenceFields = useMemo(() => formData.references ?? INITIAL_REFERENCES, [formData.references]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleReferenceChange = (index, value) => {
    setFormData((prev) => {
      const next = [...(prev.references ?? [])];
      next[index] = value;
      return { ...prev, references: next };
    });
  };

  const addReferenceField = () => {
    setFormData((prev) => ({
      ...prev,
      references: [...(prev.references ?? []), ''],
    }));
  };

  const removeReferenceField = (index) => {
    setFormData((prev) => {
      const next = [...(prev.references ?? [])];
      next.splice(index, 1);
      return { ...prev, references: next.length > 0 ? next : [''] };
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return Boolean(formData.projectTitle && formData.objective);
      case 1:
        return Boolean(formData.audience);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!canProceed()) {
      toast({
        variant: 'destructive',
        title: 'Completa los campos requeridos',
        description: 'Necesitamos un poco más de información para continuar.',
      });
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!session?.user) {
      toast({
        variant: 'destructive',
        title: 'Sesión no encontrada',
        description: 'Por favor inicia sesión nuevamente.',
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await createClientBrief({
      accountId: clientAccountId,
      userId: session.user.id,
      formData,
    });
    setIsSubmitting(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'No se pudo enviar el brief',
        description: error.message || 'Intenta de nuevo en unos minutos.',
      });
      return;
    }

    toast({
      title: 'Brief enviado',
      description: 'Tu productor asignado revisará la información y te contactará enseguida.',
      className: 'bg-green-500 text-white',
    });
    setFormData(INITIAL_FORM_STATE);
    setCurrentStep(0);
    navigate('/client');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-white">Nombre del proyecto</label>
              <Input
                value={formData.projectTitle}
                onChange={handleChange('projectTitle')}
                placeholder="Ej. Lanzamiento global de smartwatch"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-white">Objetivo principal</label>
              <Textarea
                value={formData.objective}
                onChange={handleChange('objective')}
                placeholder="Describe la meta principal: awareness, ventas, prueba, percepción premium..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Deadline tentativo</label>
              <Input value={formData.deadline} onChange={handleChange('deadline')} type="date" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Rango de inversión</label>
              <Input
                value={formData.budgetRange}
                onChange={handleChange('budgetRange')}
                placeholder="Ej. 15K - 30K USD"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Público objetivo</label>
              <Textarea
                value={formData.audience}
                onChange={handleChange('audience')}
                rows={4}
                placeholder="Segmentos, comportamientos, insights clave."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Mensajes clave</label>
              <Textarea
                value={formData.keyMessages}
                onChange={handleChange('keyMessages')}
                rows={4}
                placeholder="¿Qué debe quedar grabado en la audiencia?"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Métricas de éxito</label>
              <Textarea
                value={formData.successMetrics}
                onChange={handleChange('successMetrics')}
                rows={3}
                placeholder="KPI primario y secundarios: vistas, compras, leads, lift..."
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Canales de distribución</label>
              <Input
                value={formData.distributionChannels}
                onChange={handleChange('distributionChannels')}
                placeholder="Ej. Instagram, OOH, TV, POS — separa por comas"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white">Referencias visuales / URLs</label>
                <Button type="button" size="sm" variant="outline" onClick={addReferenceField}>
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir referencia
                </Button>
              </div>
              <div className="space-y-3">
                {referenceFields.map((value, index) => (
                  <div key={`ref-${index}`} className="flex items-center gap-3">
                    <Input
                      value={value}
                      onChange={(event) => handleReferenceChange(index, event.target.value)}
                      placeholder="https://..."
                    />
                    {referenceFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-red-400 hover:text-red-500"
                        onClick={() => removeReferenceField(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Notas adicionales</label>
              <Textarea
                value={formData.additionalNotes}
                onChange={handleChange('additionalNotes')}
                rows={4}
                placeholder="Restricciones de marca, entregables específicos, consideraciones legales..."
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid gap-4">
            <ReviewItem label="Proyecto" value={formData.projectTitle} />
            <ReviewItem label="Objetivo" value={formData.objective} />
            <ReviewItem label="Público objetivo" value={formData.audience} />
            <ReviewItem label="Mensajes clave" value={formData.keyMessages} />
            <ReviewItem label="Métricas" value={formData.successMetrics} />
            <ReviewItem label="Deadline" value={formData.deadline} />
            <ReviewItem label="Inversión" value={formData.budgetRange} />
            <ReviewItem label="Canales" value={formData.distributionChannels} />
            <ReviewItem label="Referencias" value={referenceFields.filter(Boolean).join('\n')} />
            <ReviewItem label="Notas" value={formData.additionalNotes} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border border-white/10 bg-[#10121A]/80 backdrop-blur">
      <CardHeader className="border-b border-white/10 pb-6">
        <CardTitle className="text-3xl font-semibold text-white">Brief inteligente</CardTitle>
        <p className="text-sm text-white/60">
          Describe el reto y deja que el equipo de productores y la IA diagnóstica preparen la propuesta ideal.
        </p>
      </CardHeader>
      <CardContent className="pt-8">
        <StepIndicator currentStep={currentStep} />
        <div className="space-y-8">
          {renderStepContent()}
          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0 || isSubmitting}
              className="text-white/70 hover:text-white"
            >
              Volver
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={handleNext} disabled={isSubmitting}>
                Siguiente
              </Button>
            ) : (
              <Button type="button" className="bg-accent text-accent-foreground" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar brief'
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientBriefForm;

