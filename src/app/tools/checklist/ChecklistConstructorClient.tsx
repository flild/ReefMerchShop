'use client';

import { useState, useRef } from 'react';
import { Download, AlertCircle, FileImage, Upload, Trash2, ChevronRight } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

export function ChecklistConstructorClient({ templates }: { templates: any[] }) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const previewRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  const handleAnswerChange = (blockId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [blockId]: value }));
  };

  const handleFileUpload = (blockId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleAnswerChange(blockId, event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePDF = async () => {
    if (!previewRef.current) return;

    // Simple validation
    if (selectedTemplate) {
      for (const block of selectedTemplate.blocks) {
        if (block.isRequired && !answers[block.id]) {
          toast.error(`Поле "${block.title}" обязательно для заполнения`);
          return;
        }
      }
    }

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`checklist_${selectedTemplate?.title || 'order'}.pdf`);
      toast.success('PDF успешно сгенерирован!');
    } catch (err) {
      console.error(err);
      toast.error('Ошибка при генерации PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  if (templates.length === 0) {
    return (
      <div className="bg-theme-surface p-8 rounded-[40px] anime-border text-center">
        <p className="text-xl font-bold text-theme-muted">Нет доступных шаблонов чек-листов.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Form Controls */}
      <div className="lg:col-span-5 space-y-8">

        {/* Template Selector */}
        <div className="bg-theme-surface p-8 rounded-[40px] anime-border anime-shadow">
          <h3 className="text-xl font-black text-theme-text mb-6">Выберите изделие</h3>
          <div className="flex flex-col gap-3">
            {templates.map(t => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTemplateId(t.id);
                  setAnswers({});
                }}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${
                  selectedTemplateId === t.id
                  ? 'border-theme-highlight bg-theme-highlight/10 shadow-sm -translate-y-0.5'
                  : 'border-theme-border bg-theme-bg hover:border-theme-highlight/50'
                }`}
              >
                <span className="font-bold text-theme-text text-lg">{t.title}</span>
                {selectedTemplateId === t.id && <ChevronRight className="text-theme-highlight" />}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Form Blocks */}
        {selectedTemplate && selectedTemplate.blocks.length > 0 && (
          <div className="bg-theme-surface p-8 rounded-[40px] anime-border anime-shadow space-y-8">
            <h3 className="text-2xl font-black text-theme-text mb-2">{selectedTemplate.title}</h3>
            {selectedTemplate.description && (
              <p className="text-theme-muted font-medium mb-6">{selectedTemplate.description}</p>
            )}

            <div className="space-y-8">
              {selectedTemplate.blocks.map((block: any) => {
                let options: any[] = [];
                try {
                  options = JSON.parse(block.optionsJson) || [];
                } catch {}

                return (
                  <div key={block.id} className="space-y-3">
                    <label className="block text-sm font-black text-theme-muted uppercase tracking-widest">
                      {block.title} {block.isRequired && <span className="text-theme-accent">*</span>}
                    </label>

                    {block.description && (
                      <p className="text-xs text-theme-muted font-bold -mt-2">{block.description}</p>
                    )}

                    {block.type === 'text' && (
                      <input
                        type="text"
                        value={answers[block.id] || ''}
                        onChange={(e) => handleAnswerChange(block.id, e.target.value)}
                        className="w-full bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight"
                      />
                    )}

                    {block.type === 'textarea' && (
                      <textarea
                        value={answers[block.id] || ''}
                        onChange={(e) => handleAnswerChange(block.id, e.target.value)}
                        rows={3}
                        className="w-full bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight resize-y"
                      />
                    )}

                    {block.type === 'number' && (
                      <input
                        type="number"
                        value={answers[block.id] || ''}
                        onChange={(e) => handleAnswerChange(block.id, e.target.value)}
                        className="w-full bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight"
                      />
                    )}

                    {block.type === 'radio' && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {options.map((opt, i) => (
                          <label key={i} className={`flex flex-col items-center justify-center p-3 rounded-2xl cursor-pointer border-2 transition-all text-center ${
                            answers[block.id] === opt.label
                            ? 'border-theme-highlight bg-theme-highlight/10 shadow-sm'
                            : 'border-theme-border bg-theme-bg hover:border-theme-highlight/50'
                          }`}>
                            <input
                              type="radio"
                              name={`block-${block.id}`}
                              value={opt.label}
                              checked={answers[block.id] === opt.label}
                              onChange={(e) => handleAnswerChange(block.id, e.target.value)}
                              className="sr-only"
                            />
                            {opt.imageUrl ? (
                              <img src={opt.imageUrl} alt={opt.label} className="w-16 h-16 object-contain mb-2 rounded-xl" />
                            ) : (
                              <div className="w-16 h-16 bg-theme-surface rounded-xl mb-2 flex items-center justify-center border-2 border-theme-border text-theme-muted font-bold text-xs">
                                {opt.label.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                            <span className="font-bold text-theme-text text-sm leading-tight">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {block.type === 'checkbox' && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {options.map((opt, i) => {
                          const isChecked = Array.isArray(answers[block.id]) && answers[block.id].includes(opt.label);
                          return (
                            <label key={i} className={`flex flex-col items-center justify-center p-3 rounded-2xl cursor-pointer border-2 transition-all text-center ${
                              isChecked
                              ? 'border-theme-highlight bg-theme-highlight/10 shadow-sm'
                              : 'border-theme-border bg-theme-bg hover:border-theme-highlight/50'
                            }`}>
                              <input
                                type="checkbox"
                                value={opt.label}
                                checked={isChecked}
                                onChange={(e) => {
                                  const current = Array.isArray(answers[block.id]) ? [...answers[block.id]] : [];
                                  if (e.target.checked) {
                                    handleAnswerChange(block.id, [...current, opt.label]);
                                  } else {
                                    handleAnswerChange(block.id, current.filter(item => item !== opt.label));
                                  }
                                }}
                                className="sr-only"
                              />
                              {opt.imageUrl ? (
                                <img src={opt.imageUrl} alt={opt.label} className="w-16 h-16 object-contain mb-2 rounded-xl" />
                              ) : (
                                <div className="w-16 h-16 bg-theme-surface rounded-xl mb-2 flex items-center justify-center border-2 border-theme-border text-theme-muted font-bold text-xs">
                                  {opt.label.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              <span className="font-bold text-theme-text text-sm leading-tight">{opt.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {block.type === 'select' && (
                      <select
                        value={answers[block.id] || ''}
                        onChange={(e) => handleAnswerChange(block.id, e.target.value)}
                        className="w-full bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight appearance-none"
                      >
                        <option value="">Выберите...</option>
                        {options.map((opt, i) => (
                          <option key={i} value={opt.label}>{opt.label}</option>
                        ))}
                      </select>
                    )}

                    {(block.type === 'image' || block.type === 'file') && (
                      <div className="flex flex-col gap-2">
                        {!answers[block.id] ? (
                          <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-theme-border rounded-[20px] bg-theme-bg hover:border-theme-highlight hover:bg-theme-highlight/5 cursor-pointer transition-all">
                            <Upload className="text-theme-muted mb-2" size={32} />
                            <span className="font-bold text-theme-text">Нажмите для загрузки</span>
                            <span className="text-xs text-theme-muted mt-1 font-medium">JPEG, PNG, WebP</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(block.id, e)}
                              className="sr-only"
                            />
                          </label>
                        ) : (
                          <div className="relative rounded-[20px] overflow-hidden border-2 border-theme-border bg-theme-bg">
                            <img src={answers[block.id]} alt="Preview" className="w-full h-auto object-contain max-h-[200px]" />
                            <button
                              onClick={() => handleAnswerChange(block.id, null)}
                              className="absolute top-2 right-2 p-2 bg-theme-red-bg text-theme-red-text rounded-xl hover:scale-105 transition-transform shadow-md"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Live Preview & Export */}
      <div className="lg:col-span-7 sticky top-24 space-y-6">

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-theme-surface p-6 rounded-[32px] anime-border anime-shadow">
          <div>
            <h2 className="text-2xl font-black text-theme-text">Предпросмотр</h2>
            <p className="text-sm font-bold text-theme-muted">Так будет выглядеть готовый файл</p>
          </div>
          <button
            onClick={generatePDF}
            disabled={isGenerating || !selectedTemplate}
            className="flex items-center gap-2 px-8 py-4 bg-theme-highlight text-[var(--theme-btn-text)] rounded-[20px] font-black hover:-translate-y-1 transition-transform shadow-[4px_4px_0_0_var(--theme-border)] active:shadow-[0_0_0_0_var(--theme-border)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Генерация...' : <><Download size={20} /> Сгенерировать PDF</>}
          </button>
        </div>

        {/* The actual preview container to be exported to PDF */}
        <div className="bg-white text-black p-8 md:p-12 rounded-xl shadow-2xl mx-auto overflow-hidden relative" style={{ minHeight: '800px' }}>
          {selectedTemplate ? (
            <div ref={previewRef} className="bg-white w-full h-full flex flex-col gap-6" style={{ width: '800px', margin: '0 auto', padding: '40px' }}>
              {/* Header inside PDF */}
              <div className="flex items-start justify-between border-b-4 border-black pb-6 mb-6">
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">{selectedTemplate.title}</h1>
                  <p className="text-xl font-bold text-gray-500 uppercase tracking-widest">Чек-лист спецификации</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{new Date().toLocaleDateString('ru-RU')}</div>
                </div>
              </div>

              {/* Answers Grid inside PDF */}
              <div className="grid grid-cols-2 gap-8">
                {selectedTemplate.blocks.map((block: any) => {
                  const answer = answers[block.id];

                  return (
                    <div key={block.id} className="flex flex-col gap-2">
                      <div className="font-black text-xs uppercase tracking-widest text-gray-500 border-b-2 border-gray-200 pb-1">
                        {block.title}
                      </div>

                      {/* Image Preview */}
                      {(block.type === 'image' || block.type === 'file') ? (
                        <div className="mt-2 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                          {answer ? (
                            <img src={answer} alt={block.title} className="max-w-full max-h-full object-contain" />
                          ) : (
                            <span className="text-gray-400 font-bold text-sm uppercase">Изображение не загружено</span>
                          )}
                        </div>
                      ) : (
                        /* Text Preview */
                        <div className="font-bold text-xl leading-tight">
                          {answer === undefined || answer === '' || (Array.isArray(answer) && answer.length === 0) ? (
                            <span className="text-gray-300 italic">—</span>
                          ) : Array.isArray(answer) ? (
                            answer.join(', ')
                          ) : (
                            answer.toString()
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Footer inside PDF */}
              <div className="mt-auto pt-12 border-t-2 border-gray-200 text-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                Сгенерировано в AI Studio Applet
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
              <FileImage size={64} className="mb-4" />
              <p className="font-bold text-xl uppercase tracking-widest">Выберите шаблон слева</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
