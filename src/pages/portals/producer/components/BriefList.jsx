import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { listIncomingBriefs } from '@/services/api/projects';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const BriefCard = ({ brief, onSelect }) => {
  const submittedAgo = formatDistanceToNow(new Date(brief.created_at), { addSuffix: true, locale: es });

  return (
    <Card className="border border-white/10 bg-[#121420]/80 transition hover:border-accent/60">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl text-white">
              {brief.project?.title || 'Proyecto sin título'}
            </CardTitle>
            <p className="text-xs uppercase tracking-widest text-white/40 mt-1">{brief.id.slice(0, 8)}</p>
          </div>
          <Badge variant="outline" className="border-accent/40 text-accent">
            {brief.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-white/80">
        <div>
          <p className="text-sm font-semibold text-white/90">Objetivo</p>
          <p className="text-sm">{brief.objective || 'Sin especificar'}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white/90">Audiencia</p>
          <p className="text-sm line-clamp-2">{brief.audience || 'No definida'}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-white/50">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {submittedAgo}
          </span>
          {brief.deadline_date && (
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Deadline: {brief.deadline_date}
            </span>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-between text-accent hover:text-accent/80 hover:bg-accent/10"
          onClick={() => onSelect(brief)}
        >
          Ver detalle
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

const EmptyState = () => (
  <Card className="border border-white/10 bg-[#121420]/60">
    <CardContent className="py-16 text-center text-white/70">
      <p className="text-lg font-semibold">No hay briefs pendientes</p>
      <p className="mt-2 text-sm text-white/50">
        Cuando un cliente envíe un brief, aparecerá aquí para que lo evalúes y armes la propuesta.
      </p>
    </CardContent>
  </Card>
);

const BriefList = ({ onSelectBrief }) => {
  const [briefs, setBriefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBriefs = async () => {
    setLoading(true);
    const { data, error } = await listIncomingBriefs();
    if (error) {
      setError(error.message);
    } else {
      setBriefs(data || []);
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBriefs();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border border-red-500/40 bg-red-500/10">
        <CardContent className="py-12 text-center text-red-200">
          <p className="font-semibold">No pudimos cargar los briefs.</p>
          <p className="mt-2 text-sm opacity-80">{error}</p>
          <Button className="mt-4" variant="outline" onClick={fetchBriefs}>
            Intentar de nuevo
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (briefs.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {briefs.map((brief) => (
        <BriefCard key={brief.id} brief={brief} onSelect={onSelectBrief} />
      ))}
    </div>
  );
};

export default BriefList;

