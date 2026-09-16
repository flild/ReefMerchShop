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
  Lock,
  PlusCircle,
  RotateCcw,
  CheckCheck
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

interface ChecklistItem {
  id: string;
  templateId: string;
  answers: Record<string, any>;
}

export function ChecklistConstructorClient({ templates }: { templates: ChecklistTemplate[] }) {
  const [checklists, setChecklists] = useState<ChecklistItem[]>([
    { id: 'item-1', templateId: templates[0]?.id || '', answers: {} },
  ]);
  const [activeChecklistIndex, setActiveChecklistIndex] = useState<number>(0);
  const [zoomScale, setZoomScale] = useState<number>(0.85);
  const [isGenerating, setIsGenerating] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const currentChecklist = checklists[activeChecklistIndex] || checklists[0];
  const selectedTemplate = templates.find((t) => t.id === currentChecklist.templateId) || templates[0];
  const answers = currentChecklist.answers;

  const handleAnswerChange = (blockId: string, value: any) => {
    setChecklists((prev) =>
      prev.map((item, idx) =>
        idx === activeChecklistIndex
          ? { ...item, answers: { ...item.answers, [blockId]: value } }
          : item
      )
    );
  };

  const handleTemplateChange = (templateId: string) => {
    setChecklists((prev) =>
      prev.map((item, idx) =>
        idx === activeChecklistIndex
          ? { ...item, templateId, answers: {} }
          : item
      )
    );
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

  // Определение односторонней печати
  const isSingleSidedPrint = (): boolean => {
    if (!selectedTemplate) return false;
    return selectedTemplate.blocks.some((b) => {
      const t = b.title.toLowerCase();
      const isSideField =
        t.includes('сторон') ||
        t.includes('печать') ||
        t.includes('вид');
      if (!isSideField) return false;
      const val = String(answers[b.id] || '').toLowerCase();
      return (
        val.includes('односторон') ||
        val.includes('1+') ||
        val.includes('4+0') ||
        val.includes('1 сторона') ||
        val.includes('одна') ||
        val.includes('с одной') ||
        val.includes('только оборот')
      );
    });
  };

  // Проверка, является ли блок превью лицевой стороной
  const isFrontSideImageBlock = (block: ChecklistBlock): boolean => {
    if (block.type !== 'image' && block.type !== 'file') return false;
    const title = block.title.toLowerCase();
    const isFront = title.includes('лиц') || title.includes('передн') || title.includes('front');
    const isBack = title.includes('оборот') || title.includes('шершав') || title.includes('back');
    return isFront && !isBack;
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

  // Добавление ещё одного чек-листа в заказ
  const handleAddChecklist = () => {
    const newItem: ChecklistItem = {
      id: `item-${Date.now()}`,
      templateId: selectedTemplate?.id || templates[0]?.id || '',
      answers: {},
    };
    setChecklists((prev) => [...prev, newItem]);
    setActiveChecklistIndex(checklists.length);
    toast.success(`Чек-лист №${checklists.length} сохранён. Создан лист №${checklists.length + 1}!`);
  };

  // Сброс всех чек-листов
  const handleResetAll = () => {
    if (confirm('Начать заново? Все заполненные чек-листы будут удалены.')) {
      setChecklists([
        { id: `item-${Date.now()}`, templateId: templates[0]?.id || '', answers: {} },
      ]);
      setActiveChecklistIndex(0);
      toast.info('Форма сброшена.');
    }
  };

  // Удаление страницы
  const handleDeleteChecklist = (indexToDelete: number) => {
    if (checklists.length <= 1) return;
    setChecklists((prev) => prev.filter((_, idx) => idx !== indexToDelete));
    setActiveChecklistIndex((prev) => Math.max(0, prev >= indexToDelete ? prev - 1 : prev));
    toast.info('Лист удалён.');
  };

  // Генерация PDF (одиночного или многостраничного)
  const generatePDF = async () => {
    if (!previewRef.current) return;

    // Валидация текущей страницы
    if (selectedTemplate) {
      for (const block of selectedTemplate.blocks) {
        if (block.isRequired && !answers[block.id]) {
          toast.error(`На странице ${activeChecklistIndex + 1} не заполнено: "${block.title}"`);
          return;
        }
      }
    }

    setIsGenerating(true);
    const initialIndex = activeChecklistIndex;

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      for (let i = 0; i < checklists.length; i++) {
        setActiveChecklistIndex(i);
        // Небольшая задержка для обновления DOM
        await new Promise((resolve) => setTimeout(resolve, 220));

        if (!previewRef.current) continue;

        const imgData = await toJpeg(previewRef.current, {
          quality: 0.98,
          backgroundColor: '#ffffff',
          pixelRatio: 2,
          width: 794,
          height: 1123,
        });

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }

      setActiveChecklistIndex(initialIndex);

      const fileName =
        checklists.length > 1
          ? `reef_checklists_${checklists.length}_стр.pdf`
          : `reef_checklist_${selectedTemplate?.title?.replace(/\s+/g, '_') || 'order'}.pdf`;

      pdf.save(fileName);
      toast.success(
        checklists.length > 1
          ? `Готово! Все ${checklists.length} чек-листа успешно скачаны.`
          : `Чек-лист успешно скачан!`
      );
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

  const isSingle = isSingleSidedPrint();

  return (
    <div className="space-y-6">
      {/* ПАНЕЛЬ НАВИГАЦИИ ПО ЧЕК-ЛИСТАМ */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-theme-surface p-4 rounded-2xl anime-border anime-shadow">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-xs font-black uppercase tracking-wider text-theme-muted mr-1">
            Листы заказа:
          </span>
          {checklists.map((item, idx) => {
            const tmpl = templates.find((t) => t.id === item.templateId);
            return (
              <div
                key={item.id}
                onClick={() => setActiveChecklistIndex(idx)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                  activeChecklistIndex === idx
                    ? 'bg-theme-highlight text-[var(--theme-btn-text)] shadow-sm'
                    : 'bg-theme-bg border border-theme-border text-theme-text hover:border-theme-highlight'
                }`}
              >
                <span>{idx + 1}. {tmpl?.title || 'Чек-лист'}</span>
                {checklists.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChecklist(idx);
                    }}
                    className="hover:text-red-500 font-bold p-0.5"
                    title="Удалить лист"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddChecklist}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-theme-highlight bg-theme-highlight/10 text-theme-highlight text-xs font-black hover:bg-theme-highlight hover:text-[var(--theme-btn-text)] transition-all cursor-pointer"
          >
            <PlusCircle size={14} /> Сгенерировать ещё
          </button>
          <button
            type="button"
            onClick={handleResetAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-theme-border bg-theme-bg text-theme-muted hover:text-red-500 hover:border-red-500 text-xs font-black transition-all cursor-pointer"
          >
            <RotateCcw size={14} /> Начать заново
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ЛЕВАЯ КОЛОНКА: Конструктор параметров */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-3 [overscroll-behavior:contain]">
          
          <div className="bg-theme-surface p-6 rounded-[28px] anime-border anime-shadow">
            <div className="flex items-center gap-2 mb-4 text-theme-highlight font-black text-xs uppercase tracking-widest">
              <Layers size={16} /> Тип продукции для листа №{activeChecklistIndex + 1}
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTemplateChange(t.id)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all text-left cursor-pointer ${
                    currentChecklist.templateId === t.id
                      ? 'border-theme-highlight bg-theme-highlight/10 shadow-sm font-black'
                      : 'border-theme-border bg-theme-bg hover:border-theme-highlight/50 font-bold'
                  }`}
                >
                  <span className="text-theme-text text-base">{t.title}</span>
                  {currentChecklist.templateId === t.id && <ChevronRight className="text-theme-highlight" size={18} />}
                </button>
              ))}
            </div>
          </div>

          {selectedTemplate && selectedTemplate.blocks.length > 0 && (
            <div className="bg-theme-surface p-6 sm:p-8 rounded-[28px] anime-border anime-shadow space-y-6">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-theme-highlight bg-theme-highlight/10 px-3 py-1 rounded-full border border-theme-highlight/30">
                  Параметры чек-листа (Стр. {activeChecklistIndex + 1} из {checklists.length})
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

                  const isFrontBlock = isFrontSideImageBlock(block);
                  const isBlockedFront = isSingle && isFrontBlock;

                  return (
                    <div key={block.id} className="space-y-2">
                      <label className="block text-xs font-black text-theme-muted uppercase tracking-wider">
                        {block.title} {block.isRequired && !isBlockedFront && <span className="text-red-500">*</span>}
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
                                name={`block-${block.id}-${activeChecklistIndex}`}
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
                          {isBlockedFront ? (
                            <div className="p-4 rounded-2xl border-2 border-dashed border-amber-500/40 bg-amber-500/10 flex items-start gap-3">
                              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 shrink-0 mt-0.5">
                                <Lock size={16} />
                              </div>
                              <div className="space-y-1">
                                <div className="text-xs font-black text-theme-text uppercase tracking-wider">
                                  Загрузка лица заблокирована
                                </div>
                                <p className="text-xs text-theme-muted font-medium leading-relaxed">
                                  Выбрана односторонняя печать. По стандарту макет наносится исключительно на шершавую сторону (оборот).
                                </p>
                              </div>
                            </div>
                          ) : !answers[block.id] ? (
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
                                type="button"
                                onClick={() => handleAnswerChange(block.id, null)}
                                className="p-2 text-theme-muted hover:bg-theme-surface rounded-lg transition-colors cursor-pointer"
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

        {/* ПРАВАЯ КОЛОНКА: Предпросмотр A4 */}
        <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pl-1 [overscroll-behavior:contain] flex flex-col">
          
          <div className="flex flex-wrap items-center justify-between gap-4 bg-theme-surface p-4 sm:p-5 rounded-[24px] anime-border anime-shadow shrink-0">
            <div>
              <h2 className="text-lg font-black text-theme-text flex items-center gap-2">
                Чек-лист заказа
              </h2>
              <p className="text-xs font-bold text-theme-muted">
                Страница {activeChecklistIndex + 1} из {checklists.length} • Формат А4
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden sm:flex items-center bg-theme-bg border border-theme-border rounded-xl p-1 gap-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setZoomScale((z) => Math.max(0.65, Number((z - 0.1).toFixed(2))))}
                  className="p-1.5 hover:bg-theme-surface rounded-lg text-theme-text transition-colors cursor-pointer"
                >
                  <ZoomOut size={14} />
                </button>
                <span className="px-2 text-theme-muted">{Math.round(zoomScale * 100)}%</span>
                <button
                  type="button"
                  onClick={() => setZoomScale((z) => Math.min(1.1, Number((z + 0.1).toFixed(2))))}
                  className="p-1.5 hover:bg-theme-surface rounded-lg text-theme-text transition-colors cursor-pointer"
                >
                  <ZoomIn size={14} />
                </button>
              </div>

              <button
                type="button"
                onClick={generatePDF}
                disabled={isGenerating || !selectedTemplate}
                className="flex items-center gap-2 px-5 py-2.5 bg-theme-highlight text-[var(--theme-btn-text)] rounded-xl font-black text-sm hover:-translate-y-0.5 transition-transform shadow-[2px_2px_0_0_var(--theme-border)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isGenerating ? (
                  'Рендеринг...'
                ) : (
                  <>
                    <CheckCheck size={16} /> Готово ({checklists.length > 1 ? `все ${checklists.length} стр.` : 'скачать'})
                  </>
                )}
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
                  color: '#0f172a',
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
                      border: '2.5px solid #2a8bf2',
                      borderRadius: '18px',
                      padding: '14px 18px',
                      backgroundColor: '#e6f6fb',
                      boxShadow: '4px 4px 0px #2a8bf2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            backgroundColor: '#093f8e',
                            color: '#ffffff',
                            fontWeight: 900,
                            fontSize: '11px',
                            letterSpacing: '1.5px',
                            padding: '3px 10px',
                            borderRadius: '6px',
                            textTransform: 'uppercase',
                          }}
                        >
                          РИФ
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            color: '#093f8e',
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
                          color: '#093f8e',
                          textTransform: 'uppercase',
                          letterSpacing: '-0.5px',
                          margin: '6px 0 2px 0',
                          lineHeight: 1.1,
                        }}
                      >
                        {selectedTemplate?.title || 'ЧЕК-ЛИСТ ИЗДЕЛИЯ'}
                      </h1>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          border: '2px solid #2a8bf2',
                          borderRadius: '12px',
                          padding: '8px 12px',
                          backgroundColor: '#ffffff',
                          boxShadow: '2px 2px 0px rgba(42,139,242,0.3)',
                          textAlign: 'left',
                          display: 'inline-block',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '8px',
                            fontFamily: 'monospace',
                            color: '#64748b',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                          }}
                        >
                          Дата формирования
                        </div>
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: 900,
                            fontFamily: 'monospace',
                            color: '#093f8e',
                          }}
                        >
                          {new Date().toLocaleDateString('ru-RU')}
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
                      color: '#475569',
                      borderBottom: '1px solid #cbd5e1',
                      paddingBottom: '6px',
                      fontWeight: 700,
                    }}
                  >
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
                          color: '#093f8e',
                          marginBottom: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          borderBottom: '2px solid #2a8bf2',
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

                            const rowBg = idx % 2 === 0 ? '#f8fafc' : '#ffffff';

                            return (
                              <tr key={block.id} style={{ backgroundColor: rowBg, borderBottom: '1px solid #e2e8f0' }}>
                                <td
                                  style={{
                                    padding: '6px 8px',
                                    fontSize: '10px',
                                    fontWeight: 800,
                                    color: '#475569',
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
                                    color: '#0f172a',
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
                        borderRadius: '10px',
                        border: '1.5px solid #2a8bf2',
                        backgroundColor: '#e6f6fb',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '9px',
                          fontFamily: 'monospace',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          color: '#093f8e',
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
                          color: '#093f8e',
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
                        color: '#093f8e',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '2px solid #2a8bf2',
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
                        border: '2px dashed #2a8bf2',
                        borderRadius: '14px',
                        backgroundColor: '#ffffff',
                        backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
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
                      <div style={{ position: 'absolute', top: '6px', left: '8px', fontSize: '9px', fontFamily: 'monospace', fontWeight: 900, color: '#64748b' }}>┌ 1:1</div>
                      <div style={{ position: 'absolute', top: '6px', right: '8px', fontSize: '9px', fontFamily: 'monospace', fontWeight: 900, color: '#64748b' }}>1:1 ┐</div>
                      <div style={{ position: 'absolute', bottom: '6px', left: '8px', fontSize: '9px', fontFamily: 'monospace', fontWeight: 900, color: '#64748b' }}>└ 100%</div>
                      <div style={{ position: 'absolute', bottom: '6px', right: '8px', fontSize: '9px', fontFamily: 'monospace', fontWeight: 900, color: '#64748b' }}>300 Т/Д ┘</div>

                      {imageBlocks.length > 0 &&
                      imageBlocks.some((b) => {
                        if (isSingle && isFrontSideImageBlock(b)) return false;
                        return !!answers[b.id];
                      }) ? (
                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', zIndex: 2 }}>
                          {imageBlocks.map((b) => {
                            // Если односторонняя печать, не показываем лицо
                            if (isSingle && isFrontSideImageBlock(b)) return null;

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
                                    backgroundColor: '#093f8e',
                                    color: '#ffffff',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    marginBottom: '6px',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  {isSingle ? 'ШЕРШАВАЯ СТОРОНА (ОБОРОТ)' : b.title}
                                </span>
                                <div
                                  style={{
                                    border: '2px solid #093f8e',
                                    borderRadius: '8px',
                                    padding: '6px',
                                    backgroundColor: '#ffffff',
                                    boxShadow: '4px 4px 0px rgba(42,139,242,0.2)',
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
                            border: '1.5px solid #2a8bf2',
                            borderRadius: '12px',
                            maxWidth: '240px',
                            boxShadow: '3px 3px 0px rgba(42,139,242,0.2)',
                          }}
                        >
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              border: '2px dashed #2a8bf2',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto 8px auto',
                              fontSize: '11px',
                              fontWeight: 900,
                              color: '#2a8bf2',
                            }}
                          >
                            М
                          </div>
                          <div style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: '#093f8e' }}>
                            Макет не загружен
                          </div>
                          <div style={{ fontSize: '9px', color: '#64748b', marginTop: '4px', lineHeight: 1.2 }}>
                            {isSingle
                              ? 'Загрузите превью для шершавой стороны (оборота)'
                              : 'Прикрепите превью в колонке слева для визуализации'}
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        marginTop: '10px',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid #2a8bf2',
                        backgroundColor: '#e6f6fb',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '9px',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          color: '#093f8e',
                          marginBottom: '2px',
                        }}
                      >
                        💬 Пожелания автора / Примечания к тиражу:
                      </div>
                      <div
                        style={{
                          fontSize: '10px',
                          color: '#0f172a',
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

                {/* ПОДВАЛ: ТОЛЬКО СТРАНИЦА Х ИЗ Y */}
                <div
                  style={{
                    borderTop: '2px solid #2a8bf2',
                    paddingTop: '12px',
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      color: '#093f8e',
                      fontFamily: 'monospace',
                    }}
                  >
                    СТРАНИЦА {activeChecklistIndex + 1} ИЗ {checklists.length}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* НИЖНЯЯ ПАНЕЛЬ ДЕЙСТВИЙ */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-theme-surface p-4 rounded-2xl anime-border anime-shadow">
            <button
              type="button"
              onClick={handleAddChecklist}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-theme-highlight bg-theme-highlight/10 text-theme-highlight font-black text-xs hover:bg-theme-highlight hover:text-[var(--theme-btn-text)] transition-all cursor-pointer"
            >
              <PlusCircle size={16} /> Сгенерировать ещё чек-лист с сохранением этого
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetAll}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-theme-border bg-theme-bg text-theme-muted hover:text-red-500 hover:border-red-500 font-black text-xs transition-all cursor-pointer"
              >
                <RotateCcw size={16} /> Начать заново
              </button>
              <button
                type="button"
                onClick={generatePDF}
                disabled={isGenerating || !selectedTemplate}
                className="flex items-center gap-2 px-5 py-2.5 bg-theme-highlight text-[var(--theme-btn-text)] rounded-xl font-black text-xs hover:-translate-y-0.5 transition-transform shadow-[2px_2px_0_0_var(--theme-border)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <CheckCheck size={16} /> Готово ({checklists.length > 1 ? `скачать ${checklists.length} стр.` : 'скачать'})
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}