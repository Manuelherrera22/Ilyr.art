import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Wand2, Sparkles, Image as ImageIcon, Cpu, Eye, FileText, Palette as PaletteIcon, RotateCcw, Lock, LogIn } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useTranslation } from 'react-i18next';

const DemoSection = () => {
  const [selectedStyle, setSelectedStyle] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [fileName, setFileName] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();
  const { t } = useTranslation();

  const visualStyles = t('home.demo.visualStyles', { returnObjects: true });

  const handleAuthCheck = () => {
    if (!isLoggedIn) {
      toast({
        title: t('home.demo.toast.authRequiredTitle'),
        description: t('home.demo.toast.authRequiredDesc'),
        duration: 4000,
        className: 'bg-card text-card-foreground border-accent futuristic-border',
      });
      return false;
    }
    return true;
  };

  const handleFileChange = (event) => {
    if (!handleAuthCheck()) return;
    const file = event.target.files && event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (!handleAuthCheck()) return;

    if (!previewImage || !description.trim() || !selectedStyle) {
      toast({
        title: t('home.demo.toast.incompleteTitle'),
        description: t('home.demo.toast.incompleteDesc'),
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: t('home.demo.toast.generatedTitle'),
        description: t('home.demo.toast.generatedDesc'),
        duration: 6000,
        className: 'bg-card text-foreground border-primary futuristic-border',
      });
    }, 3500);
  };
  
  const handleReset = () => {
    setSelectedStyle('');
    setDescription('');
    setFileName('');
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  return (
      <section id="demo" className="py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-b from-background via-card/30 to-background section-intro-glow">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-5 md:mb-6 animate-text-focus-in px-2" dangerouslySetInnerHTML={{ __html: t('home.demo.title') }} />
            <p className="text-base sm:text-lg md:text-xl text-secondary-type max-w-3xl mx-auto px-4">
              {t('home.demo.description')}
            </p>
            <div className="section-divider mt-6 sm:mt-7 md:mt-8"></div>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-start">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                className="lg:sticky lg:top-28"
              >
                <Card className="glass-card rounded-xl sm:rounded-2xl border-t-2 border-primary/50 shadow-2xl shadow-primary/15 relative">
                  {!isLoggedIn && (
                    <div className="absolute inset-0 bg-card/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl">
                      <Lock className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-accent mb-4 sm:mb-5 md:mb-6" />
                      <p className="text-lg sm:text-xl font-semibold text-center text-foreground mb-2 sm:mb-3 px-4">{t('home.demo.lockTitle')}</p>
                      <p className="text-center text-secondary-type mb-4 sm:mb-5 md:mb-6 text-sm sm:text-base px-4">
                        {t('home.demo.lockDescription')}
                      </p>
                      <Button asChild className="bg-gradient-to-r from-accent to-orange-500 text-accent-foreground futuristic-button pulse-glow px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base">
                        <Link to="/login" className="flex items-center justify-center">
                          <LogIn className="mr-2 h-4 w-4" /> {t('home.demo.lockButton')}
                        </Link>
                      </Button>
                    </div>
                  )}
                  <div className={!isLoggedIn ? 'opacity-30 pointer-events-none' : ''}>
                    <CardHeader className="p-4 sm:p-6 md:p-8">
                      <CardTitle className="text-foreground flex items-center text-xl sm:text-2xl md:text-3xl"><Cpu className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 mr-2 sm:mr-3 md:mr-4 text-accent" />{t('home.demo.setupTitle')}</CardTitle>
                      <CardDescription className="text-foreground/60 text-sm sm:text-base mt-1">{t('home.demo.setupDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5 sm:space-y-6 md:space-y-8 p-4 sm:p-6 md:p-8 pt-0">
                      <div>
                        <label htmlFor="file-upload" className="block text-foreground text-xs sm:text-sm font-medium mb-2 sm:mb-2.5"><UploadCloud className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2" />{t('home.demo.referenceImage')}</label>
                        <div className="mt-1 flex justify-center px-4 sm:px-5 md:px-6 py-6 sm:py-7 md:py-8 border-2 border-primary/25 border-dashed rounded-lg sm:rounded-xl hover:border-accent transition-colors duration-300 bg-background/20 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                          <div className="space-y-1 text-center">
                            {previewImage ? <img src={previewImage} alt="Preview" className="mx-auto h-20 sm:h-22 md:h-24 w-auto rounded-md object-contain" /> : <ImageIcon className="mx-auto h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 text-foreground/40" />}
                            <div className="flex text-xs sm:text-sm text-foreground/60 items-center justify-center flex-wrap gap-1"><span className="relative bg-card rounded-md font-medium text-accent px-2 py-1">{t('home.demo.uploadFile')}</span><input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} ref={fileInputRef} /><p className="pl-1.5">{t('home.demo.dragHere')}</p></div>
                            <p className="text-[10px] sm:text-xs text-foreground/50">{fileName || "PNG, JPG, WEBP"}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-foreground text-xs sm:text-sm font-medium mb-2 sm:mb-2.5"><FileText className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2" />{t('home.demo.describeIdea')}</label>
                        <Input id="description" placeholder={t('home.demo.ideaPlaceholder')} value={description} onChange={(e) => setDescription(e.target.value)} className="bg-background/50 text-sm sm:text-base"/>
                      </div>
                      <div>
                        <label htmlFor="style-select" className="block text-foreground text-xs sm:text-sm font-medium mb-2 sm:mb-2.5"><PaletteIcon className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2" />{t('home.demo.visualStyle')}</label>
                        <Select value={selectedStyle} onValueChange={setSelectedStyle}><SelectTrigger id="style-select" className="text-sm sm:text-base"><SelectValue placeholder={t('home.demo.stylePlaceholder')} /></SelectTrigger><SelectContent>{visualStyles.map((style) => <SelectItem key={style.value} value={style.value}>{style.label}</SelectItem>)}</SelectContent></Select>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4"><Button onClick={handleGenerate} disabled={isGenerating} size="lg" className="flex-1 text-sm sm:text-base"><Wand2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />{isGenerating ? t('home.demo.generating') : t('home.demo.generate')}</Button><Button onClick={handleReset} variant="outline" size="lg" className="text-sm sm:text-base"><RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" /></Button></div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
              >
                <Card className="glass-card rounded-xl sm:rounded-2xl border-t-2 border-accent/50 shadow-2xl shadow-accent/15 min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-full">
                  <CardHeader className="p-4 sm:p-6 md:p-8"><CardTitle className="text-foreground flex items-center text-xl sm:text-2xl md:text-3xl"><Eye className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 mr-2 sm:mr-3 md:mr-4 text-primary" />{t('home.demo.resultTitle')}</CardTitle><CardDescription className="text-foreground/60 text-sm sm:text-base mt-1">{t('home.demo.resultDescription')}</CardDescription></CardHeader>
                  <CardContent className="p-4 sm:p-6 md:p-8 pt-0 flex items-center justify-center h-[250px] sm:h-[300px] md:h-[350px] lg:h-[calc(100%-200px)]">
                    <AnimatePresence mode="wait">
                      {isGenerating ? <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center"><Sparkles className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-primary animate-pulse mx-auto mb-3 sm:mb-4" /><p className="text-sm sm:text-base">{t('home.demo.creatingVision')}</p></motion.div> : <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-foreground/50"><ImageIcon className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-5 md:mb-6" /><p className="text-sm sm:text-base">{t('home.demo.magicAwaits')}</p></motion.div>}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default DemoSection;