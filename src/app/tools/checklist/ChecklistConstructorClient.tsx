// src/app/tools/checklist/ChecklistConstructorClient.tsx
'use client';

import { useState, useRef } from 'react';
import { 
  Download, 
  Upload, 
  Trash2, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  CheckCircle2, 
  ExternalLink,
  FileCheck,
  Layers,
  Sparkles,
  Palette,
  Printer
} from 'lucide-react';
import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

export interface ChecklistBlock {
  id: string;
  type: string;
  title: string;
  description?: string | null;
  isRequired?: boolean | null;
  optionsJson?: string | null;
  [key: string]: any;
}

export interface ChecklistTemplate {
  id: string;
  title: string;
  description?: string | null;
  blocks: ChecklistBlock[];
  [key: string]: any;
}

export function ChecklistConstructorClient({ templates }: { templates: ChecklistTemplate[] }) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [zoomScale, setZoomScale] = useState<number>(0.85);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfTheme, setPdfTheme] = useState<'color' | 'bw'>('color');

  const previewRef = useRef<HTMLDivElement>(null);
  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  const handleAnswerChange = (blockId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [blockId]: value }));
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

  const imageBlocks = selectedTemplate?.blocks.filter(
    (b) => b.type === 'image' || b.type === 'file'
  ) || [];

  const linkBlock = selectedTemplate?.blocks.find(
    (b) => b.type === 'text' && b.title.toLowerCase().includes('ссылк')
  );

  const commentBlock = selectedTemplate?.blocks.find(
    (b) => b.type === 'textarea' || b.title.toLowerCase().includes('комментар')
  );

  const specBlocks = selectedTemplate?.blocks.filter(
    (b) =>
      b.type !== 'image' &&
      b.type !== 'file' &&
      b.id !== linkBlock?.id &&
      b.id !== commentBlock?.id
  ) || [];

  const generatePDF = async () => {
    if (!previewRef.current) return;

    if (selectedTemplate) {
      for (const block of selectedTemplate.blocks) {
        if (block.isRequired && !answers[block.id]) {
          toast.error(`Заполните обязательное поле: "${block.title}"`);
          return;
        }
      }
    }

    setIsGenerating(true);
    try {
      const imgData = await toJpeg(previewRef.current, {
        quality: 0.98,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        width: 794,
        height: 1123,
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      const cleanTitle = selectedTemplate?.title?.replace(/\s+/g, '_') || 'order';
      pdf.save(`reef_spec_${cleanTitle}_${pdfTheme}.pdf`);
      toast.success(`Техлист успешно скачан!`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      toast.error('Ошибка при генерации файла');
    } finally {
      setIsGenerating(false);
    }
  };

  if (templates.length === 0) {
    return (
      <div className="bg-theme-surface p-12 rounded-[32px] anime-border text-center">
        <p className="text-xl font-bold text-theme-muted">Нет доступных шаблонов чек-листов.</p>
      </div>
    );
  }

  const isColor = pdfTheme === 'color';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* ЛЕВАЯ КОЛОНКА: Конструктор */}
      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-3 [overscroll-behavior:contain]">
        
        <div className="bg-theme-surface p-6 rounded-[28px] anime-border anime-shadow">
          <div className="flex items-center gap-2 mb-4 text-theme-highlight font-black text-xs uppercase tracking-widest">
            <Layers size={16} /> Тип продукции
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTemplateId(t.id);
                  setAnswers({});
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all text-left ${
                  selectedTemplateId === t.id
                    ? 'border-theme-highlight bg-theme-highlight/10 shadow-sm font-black'
                    : 'border-theme-border bg-theme-bg hover:border-theme-highlight/50 font-bold'
                }`}
              >
                <span className="text-theme-text text-base">{t.title}</span>
                {selectedTemplateId === t.id && <ChevronRight className="text-theme-highlight" size={18} />}
              </button>
            ))}
          </div>
        </div>

        {selectedTemplate && selectedTemplate.blocks.length > 0 && (
          <div className="bg-theme-surface p-6 sm:p-8 rounded-[28px] anime-border anime-shadow space-y-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-theme-highlight bg-theme-highlight/10 px-3 py-1 rounded-full border border-theme-highlight/30">
                Параметры спецификации
              </span>
              <h3 className="text-2xl font-black text-theme-text mt-3">{selectedTemplate.title}</h3>
              {selectedTemplate.description && (
                <p className="text-theme-muted text-sm mt-1">{selectedTemplate.description}</p>
              )}
            </div>

            <div className="space-y-6 pt-2 border-t border-theme-border">
              {selectedTemplate.blocks.map((block) => {
                let options: any[] = [];
                try {
                  options = block.optionsJson ? JSON.parse(block.optionsJson) : [];
                } catch {}

                return (
                  <div key={block.id} className="space-y-2">
                    <label className="block text-xs font-black text-theme-muted uppercase tracking-wider">
                      {block.title} {block.isRequired && <span className="text-red-500">*</span>}
                    </label>

                    {block.description && (
                      <p className="text-xs text-theme-muted font-medium">{block.description}</p>
                    )}

                    {block.type === 'text' && (
                      <input
                        type="text"
                        value={answers[block.id] || ''}
                        onChange={(e) => handleAnswerChange(block.id, e.target.value)}
                        placeholder="Введите значение..."
                        className="w-full bg-theme-bg border-2 border-theme-border rounded-xl px-4 py-2.5 font-bold text-theme-text outline-none focus:border-theme-highlight transition-colors text-sm"
                      />
                    )}

                    {block.type === 'textarea' && (
                      <textarea
                        value={answers[block.id] || ''}
                        onChange={(e) => handleAnswerChange(block.id, e.target.value)}
                        rows={3}
                        placeholder="Укажите особые пожелания..."
                        className="w-full bg-theme-bg border-2 border-theme-border rounded-xl px-4 py-2.5 font-bold text-theme-text outline-none focus:border-theme-highlight transition-colors text-sm resize-y"
                      />
                    )}

                    {block.type === 'number' && (
                      <input
                        type="number"
                        value={answers[block.id] || ''}
                        onChange={(e) => handleAnswerChange(block.id, e.target.value)}
                        placeholder="0"
                        className="w-full bg-theme-bg border-2 border-theme-border rounded-xl px-4 py-2.5 font-bold text-theme-text outline-none focus:border-theme-highlight transition-colors text-sm"
                      />
                    )}

                    {block.type === 'radio' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {options.map((opt, i) => (
                          <label
                            key={i}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 transition-all ${
                              answers[block.id] === opt.label
                                ? 'border-theme-highlight bg-theme-highlight/10 font-black'
                                : 'border-theme-border bg-theme-bg hover:border-theme-highlight/40 font-medium'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`block-${block.id}`}
                              value={opt.label}
                              checked={answers[block.id] === opt.label}
                              onChange={(e) => handleAnswerChange(block.id, e.target.value)}
                              className="sr-only"
                            />
                            <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${answers[block.id] === opt.label ? 'border-theme-highlight bg-theme-highlight' : 'border-theme-muted'}`}>
                              {answers[block.id] === opt.label && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="text-theme-text text-xs leading-tight">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {block.type === 'checkbox' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {options.map((opt, i) => {
                          const isChecked = Array.isArray(answers[block.id]) && answers[block.id].includes(opt.label);
                          return (
                            <label
                              key={i}
                              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 transition-all ${
                                isChecked
                                  ? 'border-theme-highlight bg-theme-highlight/10 font-black'
                                  : 'border-theme-border bg-theme-bg hover:border-theme-highlight/40 font-medium'
                              }`}
                            >
                              <input
                                type="checkbox"
                                value={opt.label}
                                checked={isChecked}
                                onChange={(e) => {
                                  const current = Array.isArray(answers[block.id]) ? [...answers[block.id]] : [];
                                  if (e.target.checked) {
                                    handleAnswerChange(block.id, [...current, opt.label]);
                                  } else {
                                    handleAnswerChange(block.id, current.filter((item) => item !== opt.label));
                                  }
                                }}
                                className="sr-only"
                              />
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isChecked ? 'border-theme-highlight bg-theme-highlight text-white' : 'border-theme-muted'}`}>
                                {isChecked && <CheckCircle2 size={12} />}
                              </div>
                              <span className="text-theme-text text-xs leading-tight">{opt.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {block.type === 'select' && (
                      <select
                        value={answers[block.id] || ''}
                        onChange={(e) => handleAnswerChange(block.id, e.target.value)}
                        className="w-full bg-theme-bg border-2 border-theme-border rounded-xl px-4 py-2.5 font-bold text-theme-text outline-none focus:border-theme-highlight text-sm"
                      >
                        <option value="">Выберите вариант...</option>
                        {options.map((opt, i) => (
                          <option key={i} value={opt.label}>{opt.label}</option>
                        ))}
                      </select>
                    )}

                    {(block.type === 'image' || block.type === 'file') && (
                      <div>
                        {!answers[block.id] ? (
                          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-theme-border rounded-2xl bg-theme-bg hover:border-theme-highlight hover:bg-theme-highlight/5 cursor-pointer transition-all">
                            <Upload className="text-theme-muted mb-2" size={24} />
                            <span className="font-bold text-theme-text text-xs">Загрузить превью макета</span>
                            <span className="text-[10px] text-theme-muted mt-0.5">До 10 мегабайт</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(block.id, e)}
                              className="sr-only"
                            />
                          </label>
                        ) : (
                          <div className="relative rounded-2xl overflow-hidden border-2 border-theme-border bg-theme-bg p-2 flex items-center justify-between">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <img src={answers[block.id]} alt="Превью" className="w-12 h-12 object-contain rounded-lg border bg-white" />
                              <span className="text-xs font-bold text-theme-text truncate">Файл загружен</span>
                            </div>
                            <button
                              onClick={() => handleAnswerChange(block.id, null)}
                              className="p-2 text-theme-muted hover:bg-theme-surface rounded-lg transition-colors"
                              title="Удалить"
                            >
                              <Trash2 size={16} />
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

      {/* ПРАВАЯ КОЛОНКА: Предпросмотр */}
      <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pl-1 [overscroll-behavior:contain] flex flex-col">
        
        <div className="flex flex-wrap items-center justify-between gap-4 bg-theme-surface p-4 sm:p-5 rounded-[24px] anime-border anime-shadow shrink-0">
          <div>
            <h2 className="text-lg font-black text-theme-text flex items-center gap-2">
              Технический паспорт
            </h2>
            <p className="text-xs font-bold text-theme-muted">Стандарт типографии (Формат А4)</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex p-1 bg-theme-bg border-2 border-theme-border rounded-xl">
              <button
                type="button"
                onClick={() => setPdfTheme('color')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                  isColor
                    ? 'bg-[#2a8bf2] text-white shadow-sm'
                    : 'text-theme-muted hover:text-theme-text'
                }`}
              >
                <Palette size={14} />
                Фирменный
              </button>
              <button
                type="button"
                onClick={() => setPdfTheme('bw')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                  !isColor
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-theme-muted hover:text-theme-text'
                }`}
              >
                <Printer size={14} />
                Ч/Б
              </button>
            </div>

            <div className="hidden sm:flex items-center bg-theme-bg border border-theme-border rounded-xl p-1 gap-1 text-xs font-bold">
              <button
                onClick={() => setZoomScale((z) => Math.max(0.65, Number((z - 0.1).toFixed(2))))}
                className="p-1.5 hover:bg-theme-surface rounded-lg text-theme-text transition-colors"
              >
                <ZoomOut size={14} />
              </button>
              <span className="px-2 text-theme-muted">{Math.round(zoomScale * 100)}%</span>
              <button
                onClick={() => setZoomScale((z) => Math.min(1.1, Number((z + 0.1).toFixed(2))))}
                className="p-1.5 hover:bg-theme-surface rounded-lg text-theme-text transition-colors"
              >
                <ZoomIn size={14} />
              </button>
            </div>

            <button
              onClick={generatePDF}
              disabled={isGenerating || !selectedTemplate}
              className="flex items-center gap-2 px-5 py-2.5 bg-theme-highlight text-[var(--theme-btn-text)] rounded-xl font-black text-sm hover:-translate-y-0.5 transition-transform shadow-[2px_2px_0_0_var(--theme-border)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isGenerating ? 'Рендеринг...' : <><Download size={16} /> Скачать документ</>}
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-[28px] bg-neutral-900/70 p-4 sm:p-6 border-2 border-theme-border flex justify-center shadow-inner">
          <div
            style={{
              transform: `scale(${zoomScale})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out',
            }}
          >
            <div
              ref={previewRef}
              style={{
                width: '794px',
                height: '1123px',
                minWidth: '794px',
                minHeight: '1123px',
                padding: '36px 40px',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff',
                color: isColor ? '#0f172a' : '#000000',
                fontFamily: "'Nunito', 'Helvetica Neue', Arial, sans-serif",
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              
              {/* ВЕРХНЯЯ ШАПКА */}
              <div>
                <div
                  style={{
                    border: isColor ? '2.5px solid #2a8bf2' : '2.5px solid #000000',
                    borderRadius: isColor ? '18px' : '8px',
                    padding: '14px 18px',
                    backgroundColor: isColor ? '#e6f6fb' : '#ffffff',
                    boxShadow: isColor ? '4px 4px 0px #2a8bf2' : '4px 4px 0px #000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          backgroundColor: isColor ? '#093f8e' : '#000000',
                          color: '#ffffff',
                          fontWeight: 900,
                          fontSize: '11px',
                          letterSpacing: '1.5px',
                          padding: '3px 10px',
                          borderRadius: isColor ? '6px' : '0px',
                          textTransform: 'uppercase',
                        }}
                      >
                        РИФ
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          color: isColor ? '#093f8e' : '#000000',
                          fontWeight: 800,
                          letterSpacing: '0.8px',
                          textTransform: 'uppercase',
                        }}
                      >
                        Типография для мерчеделов
                      </span>
                    </div>

                    <h1
                      style={{
                        fontSize: '22px',
                        fontWeight: 900,
                        color: isColor ? '#093f8e' : '#000000',
                        textTransform: 'uppercase',
                        letterSpacing: '-0.5px',
                        margin: '6px 0 2px 0',
                        lineHeight: 1.1,
                      }}
                    >
                      {selectedTemplate?.title || 'ТЕХНИЧЕСКИЙ ЛИСТ ИЗДЕЛИЯ'}
                    </h1>

                    <div
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: isColor ? '#2a8bf2' : '#333333',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {isColor ? 'Фирменный паспорт заказа • Готов к печати' : 'Цеховой экземпляр • Монохромный стандарт'}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        border: isColor ? '2px solid #2a8bf2' : '2px solid #000000',
                        borderRadius: isColor ? '12px' : '4px',
                        padding: '8px 12px',
                        backgroundColor: '#ffffff',
                        boxShadow: isColor ? '2px 2px 0px rgba(42,139,242,0.3)' : '2px 2px 0px #000000',
                        textAlign: 'left',
                        display: 'inline-block',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '8px',
                          fontFamily: 'monospace',
                          color: isColor ? '#64748b' : '#555555',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                        }}
                      >
                        Дата генерации
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: 900,
                          fontFamily: 'monospace',
                          color: isColor ? '#093f8e' : '#000000',
                        }}
                      >
                        {new Date().toLocaleDateString('ru-RU')}
                      </div>
                      <div
                        style={{
                          fontSize: '8.5px',
                          fontWeight: 800,
                          color: isColor ? '#2a8bf2' : '#000000',
                          marginTop: '2px',
                        }}
                      >
                        {isColor ? '● ПРОВЕРЕНО' : '[X] ПРОВЕРЕНО'}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '9.5px',
                    fontFamily: 'monospace',
                    color: isColor ? '#475569' : '#333333',
                    borderBottom: isColor ? '1px solid #cbd5e1' : '1px solid #000000',
                    paddingBottom: '6px',
                    fontWeight: 700,
                  }}
                >
                  <div>СПЕЦИФИКАЦИЯ МАКЕТА К ПЕЧАТИ • ТВОЯ ГАВАНЬ МЕРЧА</div>
                  <div style={{ textTransform: 'uppercase' }}>
                    ФОРМАТ: А4 • 300 Т/Д • РЕЖИМ: {isColor ? 'ПОЛНОЦВЕТ' : 'ЧЕРНО-БЕЛЫЙ'}
                  </div>
                </div>
              </div>

              {/* ОСНОВНАЯ ЧАСТЬ */}
              <div style={{ display: 'flex', gap: '20px', margin: '14px 0', flex: 1 }}>
                
                {/* ЛЕВАЯ КОЛОНКА */}
                <div style={{ width: '48%', display: 'flex', flexDirection: 'column' }}>
                  
                  <div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: isColor ? '#093f8e' : '#000000',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        borderBottom: isColor ? '2px solid #2a8bf2' : '2px solid #000000',
                        paddingBottom: '4px',
                      }}
                    >
                      <FileCheck size={14} /> Параметры заказа и изделия
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        {specBlocks.map((block, idx) => {
                          const val = answers[block.id];
                          const displayVal = Array.isArray(val)
                            ? val.join(', ')
                            : val !== undefined && val !== ''
                            ? val.toString()
                            : '—';

                          const rowBg = idx % 2 === 0 ? (isColor ? '#f8fafc' : '#f5f5f5') : '#ffffff';

                          return (
                            <tr key={block.id} style={{ backgroundColor: rowBg, borderBottom: '1px solid #e2e8f0' }}>
                              <td
                                style={{
                                  padding: '6px 8px',
                                  fontSize: '10px',
                                  fontWeight: 800,
                                  color: isColor ? '#475569' : '#222222',
                                  textTransform: 'uppercase',
                                  width: '45%',
                                }}
                              >
                                {block.title}
                              </td>
                              <td
                                style={{
                                  padding: '6px 8px',
                                  fontSize: '11px',
                                  fontWeight: 900,
                                  color: isColor ? '#0f172a' : '#000000',
                                  textAlign: 'right',
                                  width: '55%',
                                  wordBreak: 'break-word',
                                }}
                              >
                                {displayVal}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Ссылка на диск */}
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '10px 12px',
                      borderRadius: isColor ? '10px' : '4px',
                      border: isColor ? '1.5px solid #2a8bf2' : '1.5px solid #000000',
                      backgroundColor: isColor ? '#e6f6fb' : '#ffffff',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '9px',
                        fontFamily: 'monospace',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        color: isColor ? '#093f8e' : '#000000',
                        marginBottom: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <ExternalLink size={10} /> Файлы макета (Облачный диск):
                    </div>
                    <div
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '10.5px',
                        fontWeight: 800,
                        color: isColor ? '#093f8e' : '#000000',
                        wordBreak: 'break-all',
                      }}
                    >
                      {linkBlock && answers[linkBlock.id] ? answers[linkBlock.id] : '— Ссылка не прикреплена —'}
                    </div>
                  </div>

                </div>

                {/* ПРАВАЯ КОЛОНКА */}
                <div style={{ width: '52%', display: 'flex', flexDirection: 'column' }}>
                  
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: isColor ? '#093f8e' : '#000000',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: isColor ? '2px solid #2a8bf2' : '2px solid #000000',
                      paddingBottom: '4px',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={14} /> Зона проверки макета
                    </span>
                    <span style={{ fontSize: '9px', fontFamily: 'monospace' }}>ПРЕДПРОСМОТР 1:1</span>
                  </div>

                  <div
                    style={{
                      flex: 1,
                      border: isColor ? '2px dashed #2a8bf2' : '2px solid #000000',
                      borderRadius: isColor ? '14px' : '4px',
                      backgroundColor: '#ffffff',
                      backgroundImage: isColor
                        ? 'radial-gradient(#94a3b8 1px, transparent 1px)'
                        : 'radial-gradient(#555555 1px, transparent 1px)',
                      backgroundSize: '14px 14px',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '16px',
                      minHeight: '380px',
                    }}
                  >
                    <div style={{ position: 'absolute', top: '6px', left: '8px', fontSize: '9px', fontFamily: 'monospace', fontWeight: 900, color: isColor ? '#64748b' : '#000000' }}>┌ 1:1</div>
                    <div style={{ position: 'absolute', top: '6px', right: '8px', fontSize: '9px', fontFamily: 'monospace', fontWeight: 900, color: isColor ? '#64748b' : '#000000' }}>1:1 ┐</div>
                    <div style={{ position: 'absolute', bottom: '6px', left: '8px', fontSize: '9px', fontFamily: 'monospace', fontWeight: 900, color: isColor ? '#64748b' : '#000000' }}>└ 100%</div>
                    <div style={{ position: 'absolute', bottom: '6px', right: '8px', fontSize: '9px', fontFamily: 'monospace', fontWeight: 900, color: isColor ? '#64748b' : '#000000' }}>300 Т/Д ┘</div>

                    {imageBlocks.length > 0 && imageBlocks.some((b) => answers[b.id]) ? (
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', zIndex: 2 }}>
                        {imageBlocks.map((b) => {
                          const src = answers[b.id];
                          if (!src) return null;
                          return (
                            <div
                              key={b.id}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                maxHeight: '220px',
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '9px',
                                  fontFamily: 'monospace',
                                  fontWeight: 900,
                                  backgroundColor: isColor ? '#093f8e' : '#000000',
                                  color: '#ffffff',
                                  padding: '2px 8px',
                                  borderRadius: isColor ? '4px' : '0px',
                                  marginBottom: '6px',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {b.title}
                              </span>
                              <div
                                style={{
                                  border: isColor ? '2px solid #093f8e' : '2px solid #000000',
                                  borderRadius: isColor ? '8px' : '0px',
                                  padding: '6px',
                                  backgroundColor: '#ffffff',
                                  boxShadow: isColor ? '4px 4px 0px rgba(42,139,242,0.2)' : '4px 4px 0px #000000',
                                }}
                              >
                                <img
                                  src={src}
                                  alt={b.title}
                                  style={{
                                    maxWidth: '240px',
                                    maxHeight: '170px',
                                    objectFit: 'contain',
                                    display: 'block',
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '16px 20px',
                          backgroundColor: '#ffffff',
                          border: isColor ? '1.5px solid #2a8bf2' : '1.5px solid #000000',
                          borderRadius: isColor ? '12px' : '4px',
                          maxWidth: '240px',
                          boxShadow: isColor ? '3px 3px 0px rgba(42,139,242,0.2)' : '3px 3px 0px #000000',
                        }}
                      >
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            border: isColor ? '2px dashed #2a8bf2' : '2px dashed #000000',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 8px auto',
                            fontSize: '11px',
                            fontWeight: 900,
                            color: isColor ? '#2a8bf2' : '#000000',
                          }}
                        >
                          М
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: isColor ? '#093f8e' : '#000000' }}>
                          Макет не загружен
                        </div>
                        <div style={{ fontSize: '9px', color: isColor ? '#64748b' : '#555555', marginTop: '4px', lineHeight: 1.2 }}>
                          Прикрепите превью в колонке слева для визуализации
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      marginTop: '10px',
                      padding: '10px 12px',
                      borderRadius: isColor ? '10px' : '4px',
                      border: isColor ? '1.5px solid #2a8bf2' : '1.5px solid #000000',
                      backgroundColor: isColor ? '#e6f6fb' : '#ffffff',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '9px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        color: isColor ? '#093f8e' : '#000000',
                        marginBottom: '2px',
                      }}
                    >
                      💬 Пожелания автора / Примечания к тиражу:
                    </div>
                    <div
                      style={{
                        fontSize: '10px',
                        color: isColor ? '#0f172a' : '#222222',
                        lineHeight: 1.3,
                        fontWeight: 600,
                      }}
                    >
                      {commentBlock && answers[commentBlock.id]
                        ? answers[commentBlock.id]
                        : 'Без дополнительных правок и комментариев.'}
                    </div>
                  </div>

                </div>

              </div>

              {/* ПОДВАЛ */}
              <div style={{ borderTop: isColor ? '2.5px solid #2a8bf2' : '2.5px solid #000000', paddingTop: '10px', marginTop: 'auto' }}>
                
                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                  {[
                    'РАЗРЕШЕНИЕ 300 Т/Д',
                    'ЦВЕТОВАЯ МОДЕЛЬ ВЕРНА',
                    'КОНТУРЫ ЗАМКНУТЫ',
                    'ВЫЛЕТЫ 2 ММ',
                  ].map((rule, idx) => (
                    <div
                      key={idx}
                      style={{
                        flex: 1,
                        padding: '4px 6px',
                        textAlign: 'center',
                        fontSize: '8px',
                        fontWeight: 900,
                        backgroundColor: isColor ? '#e6f6fb' : '#ffffff',
                        border: isColor ? '1.5px solid #2a8bf2' : '1.5px solid #000000',
                        borderRadius: isColor ? '6px' : '0px',
                        color: isColor ? '#093f8e' : '#000000',
                        letterSpacing: '0.3px',
                      }}
                    >
                      {isColor ? '✔ ' : '[X] '}
                      {rule}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: isColor ? '#64748b' : '#333333' }}>
                    ТИПОГРАФИЯ «РИФ» • ГАВАНЬ МЕРЧА ДЛЯ АВТОРОВ И ИЛЛЮСТРАТОРОВ<br />
                    СТРАНИЦА 1 ИЗ 1 • СФОРМИРОВАНО НА САЙТЕ
                  </div>

                  <div
                    style={{
                      border: isColor ? '1.5px dashed #093f8e' : '2px solid #000000',
                      borderRadius: isColor ? '6px' : '0px',
                      padding: '4px 12px',
                      backgroundColor: '#ffffff',
                      textAlign: 'left',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '8px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        color: isColor ? '#093f8e' : '#000000',
                      }}
                    >
                      В ПЕЧАТЬ ПРИНЯТО / ОТК:
                    </div>
                    <div
                      style={{
                        fontSize: '9.5px',
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        color: '#000000',
                        marginTop: '2px',
                      }}
                    >
                      Дизайнер макетов: ______________
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}