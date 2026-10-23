'use client';

import { useState, useRef } from 'react';
import { 
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
    const files = e.target.files;
    if (files && files.length > 0) {
      const currentList: string[] = Array.isArray(answers[blockId]) ? [...answers[blockId]] : (answers[blockId] ? [answers[blockId]] : []);
      const readPromises = Array.from(files).map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve(event.target?.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readPromises).then((newImages) => {
        handleAnswerChange(blockId, [...currentList, ...newImages]);
      });
    }
  };

  const handleRemoveImage = (blockId: string, indexToRemove: number) => {
    const currentList: string[] = Array.isArray(answers[blockId]) ? [...answers[blockId]] : (answers[blockId] ? [answers[blockId]] : []);
    const updated = currentList.filter((_, idx) => idx !== indexToRemove);
    handleAnswerChange(blockId, updated.length > 0 ? updated : null);
  };

  const checkIsSingleSided = (tmpl: ChecklistTemplate, ans: Record<string, any>): boolean => {
    return tmpl.blocks.some((b) => {
      const t = b.title.toLowerCase();
      const isSideField = t.includes('сторон') || t.includes('печать') || t.includes('вид');
      if (!isSideField) return false;
      const val = String(ans[b.id] || '').toLowerCase();
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

  const handleEnableDoubleSided = () => {
    if (!selectedTemplate) return;
    const sideBlock = selectedTemplate.blocks.find((b) => {
      const t = b.title.toLowerCase();
      return t.includes('сторон') || t.includes('печать') || t.includes('вид');
    });

    if (sideBlock) {
      let options: any[] = [];
      try {
        options = sideBlock.optionsJson ? JSON.parse(sideBlock.optionsJson) : [];
      } catch {}

      const doubleOption = options.find((opt: any) => {
        const label = String(opt.label || opt || '').toLowerCase();
        return label.includes('двусторон') || label.includes('4+4') || label.includes('2') || label.includes('обе');
      });

      const newValue = doubleOption ? (doubleOption.label || doubleOption) : (options[0]?.label || options[0] || '4+4 (Двусторонняя печать)');
      handleAnswerChange(sideBlock.id, newValue);
      toast.success('Переключено на двустороннюю печать. Лицевая сторона разблокирована!');
    } else {
      toast.info('Лицевая сторона разблокирована.');
    }
  };

  const isFrontSideImageBlock = (block: ChecklistBlock): boolean => {
    if (block.type !== 'image' && block.type !== 'file') return false;
    const title = block.title.toLowerCase();
    const isFront = title.includes('лиц') || title.includes('передн') || title.includes('front');
    const isBack = title.includes('оборот') || title.includes('шершав') || title.includes('back');
    return isFront && !isBack;
  };

  const handleAddChecklist = () => {
    const newItem: ChecklistItem = {
      id: `item-${Date.now()}`,
      templateId: selectedTemplate?.id || templates[0]?.id || '',
      answers: {},
    };
    setChecklists((prev) => [...prev, newItem]);
    setActiveChecklistIndex(checklists.length);
    toast.success(`Лист №${checklists.length + 1} добавлен. Заполните параметры!`);
  };

  const handleResetAll = () => {
    if (confirm('Начать заново? Все созданные чек-листы будут очищены.')) {
      setChecklists([
        { id: `item-${Date.now()}`, templateId: templates[0]?.id || '', answers: {} },
      ]);
      setActiveChecklistIndex(0);
      toast.info('Все чек-листы сброшены.');
    }
  };

  const handleDeleteChecklist = (indexToDelete: number) => {
    if (checklists.length <= 1) return;
    setChecklists((prev) => prev.filter((_, idx) => idx !== indexToDelete));
    setActiveChecklistIndex((prev) => Math.max(0, prev >= indexToDelete ? prev - 1 : prev));
    toast.info('Лист удалён.');
  };

  const generatePDF = async () => {
    // 1. Честная валидация всех листов перед скачиванием
    for (let i = 0; i < checklists.length; i++) {
      const item = checklists[i];
      const tmpl = templates.find((t) => t.id === item.templateId) || templates[0];
      const isSingle = checkIsSingleSided(tmpl, item.answers);

      for (const block of tmpl.blocks) {
        // Пропускаем лицо при односторонней печати
        if (isSingle && isFrontSideImageBlock(block)) continue;

        if (block.isRequired) {
          const val = item.answers[block.id];
          const isEmpty = val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0);
          if (isEmpty) {
            toast.error(`Лист ${i + 1} («${tmpl.title}»): заполните поле «${block.title}»`);
            setActiveChecklistIndex(i);
            return;
          }
        }
      }
    }

    setIsGenerating(true);
    const toastId = toast.loading('Формирование документа...');

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      let pdfPageCount = 0;

      for (let i = 0; i < checklists.length; i++) {
        // Получаем все сгенерированные DOM-элементы страниц для листа i
        let pIndex = 0;
        while (true) {
          const pageEl = document.getElementById(`printable-sheet-${i}-page-${pIndex}`);
          if (!pageEl) break;

          const imgData = await toJpeg(pageEl, {
            quality: 0.96,
            backgroundColor: '#ffffff',
            pixelRatio: 2,
            width: 794,
            height: 1123,
            fontEmbedCSS: '', // Отключает падение из-за Google Fonts
            cacheBust: false,
          });

          if (pdfPageCount > 0) pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
          pdfPageCount++;
          pIndex++;
        }
      }

      const fileName =
        pdfPageCount > 1
          ? `reef_checklists_${pdfPageCount}_стр.pdf`
          : `reef_checklist_${selectedTemplate?.title?.replace(/\s+/g, '_') || 'order'}.pdf`;

      pdf.save(fileName);
      toast.success(
        pdfPageCount > 1
          ? `Успешно скачано страниц: ${pdfPageCount}`
          : 'Чек-лист успешно скачан!',
        { id: toastId }
      );
    } catch (err: any) {
      console.error('PDF Generation Error:', err);
      toast.error(`Ошибка генерации: ${err?.message || 'сбой экспорта'}`, { id: toastId });
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

  const currentIsSingle = checkIsSingleSided(selectedTemplate, answers);

  return (
    <div className="space-y-6">

      {/* НАВИГАЦИЯ ПО ЛИСТАМ */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-theme-surface p-4 rounded-2xl anime-border anime-shadow">
        <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
          <span className="text-xs font-black uppercase tracking-wider text-theme-muted mr-1 shrink-0">
            Листы заказа:
          </span>
          {checklists.map((item, idx) => {
            const tmpl = templates.find((t) => t.id === item.templateId);
            return (
              <div
                key={item.id}
                onClick={() => setActiveChecklistIndex(idx)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all shrink-0 ${
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

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleAddChecklist}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-theme-highlight bg-theme-highlight/10 text-theme-highlight text-xs font-black hover:bg-theme-highlight hover:text-[var(--theme-btn-text)] transition-all cursor-pointer"
          >
            <PlusCircle size={14} /> Добавить лист
          </button>
          <button
            type="button"
            onClick={handleResetAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-theme-border bg-theme-bg text-theme-muted hover:text-red-500 hover:border-red-500 text-xs font-black transition-all cursor-pointer"
          >
            <RotateCcw size={14} /> Сбросить
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ЛЕВАЯ КОЛОНКА: Редактор */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-3">
          
          <div className="bg-theme-surface p-6 rounded-[28px] anime-border anime-shadow">
            <div className="flex items-center gap-2 mb-4 text-theme-highlight font-black text-xs uppercase tracking-widest">
              <Layers size={16} /> Тип изделия для листа №{activeChecklistIndex + 1}
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
                  Параметры листа {activeChecklistIndex + 1} из {checklists.length}
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
                  const isBlockedFront = currentIsSingle && isFrontBlock;

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
                            <div className="p-4 rounded-2xl border-2 border-dashed border-amber-500/40 bg-amber-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 shrink-0 mt-0.5">
                                  <Lock size={16} />
                                </div>
                                <div className="space-y-1">
                                  <div className="text-xs font-black text-theme-text uppercase tracking-wider">
                                    Лицевая сторона заблокирована
                                  </div>
                                  <p className="text-xs text-theme-muted font-medium leading-relaxed">
                                    Выбрана односторонняя печать. По стандарту изображение наносится только на оборот.
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={handleEnableDoubleSided}
                                className="px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/20 text-amber-800 font-bold text-xs hover:bg-amber-500 hover:text-white transition-all cursor-pointer shrink-0"
                              >
                                Включить двустороннюю печать
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {/* Список уже загруженных макетов */}
                              {(() => {
                                const imgs: string[] = Array.isArray(answers[block.id])
                                  ? answers[block.id]
                                  : answers[block.id]
                                  ? [answers[block.id]]
                                  : [];

                                if (imgs.length === 0) return null;

                                return (
                                  <div className="grid grid-cols-1 gap-2">
                                    {imgs.map((src, idx) => (
                                      <div
                                        key={idx}
                                        className="relative rounded-2xl overflow-hidden border-2 border-theme-border bg-theme-bg p-2 flex items-center justify-between gap-3"
                                      >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                          <img src={src} alt={`Превью ${idx + 1}`} className="w-12 h-12 object-contain rounded-lg border bg-white shrink-0" />
                                          <div className="overflow-hidden">
                                            <div className="text-xs font-bold text-theme-text truncate">
                                              Макет №{idx + 1}
                                            </div>
                                            <div className="text-[10px] text-theme-muted font-semibold">
                                              Загружено
                                            </div>
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveImage(block.id, idx)}
                                          className="p-2 text-theme-muted hover:text-red-500 hover:bg-theme-surface rounded-lg transition-colors cursor-pointer shrink-0"
                                          title="Удалить этот макет"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                );
                              })()}

                              {/* Кнопка загрузки (можно несколько файлов сразу) */}
                              <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-theme-border rounded-2xl bg-theme-bg hover:border-theme-highlight hover:bg-theme-highlight/5 cursor-pointer transition-all">
                                <Upload className="text-theme-muted mb-1.5" size={22} />
                                <span className="font-bold text-theme-text text-xs">
                                  {answers[block.id] && (Array.isArray(answers[block.id]) ? answers[block.id].length > 0 : true)
                                    ? '+ Добавить ещё макет(ы)'
                                    : 'Загрузить превью макетов'}
                                </span>
                                <span className="text-[10px] text-theme-muted mt-0.5">Можно выбрать несколько файлов</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => handleFileUpload(block.id, e)}
                                  className="sr-only"
                                />
                              </label>
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

        {/* ПРАВАЯ КОЛОНКА: Предпросмотр листа */}
        <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pl-1 flex flex-col">
          
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
                disabled={isGenerating}
                className="flex items-center gap-2 px-5 py-2.5 bg-theme-highlight text-[var(--theme-btn-text)] rounded-xl font-black text-sm hover:-translate-y-0.5 transition-transform shadow-[2px_2px_0_0_var(--theme-border)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isGenerating ? (
                  'Экспорт PDF...'
                ) : (
                  <>
                    <CheckCheck size={16} /> Готово ({checklists.length > 1 ? `скачать ${checklists.length} стр.` : 'скачать'})
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Интерактивное превью выбранного листа */}
          <div className="w-full overflow-x-auto rounded-[28px] bg-neutral-900/70 p-4 sm:p-6 border-2 border-theme-border flex justify-center shadow-inner">
            <div
              style={{
                transform: `scale(${zoomScale})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
              }}
            >
              <ChecklistPaper
                template={selectedTemplate}
                answers={answers}
                pageIndex={activeChecklistIndex}
                totalPages={checklists.length}
                isSingle={currentIsSingle}
              />
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
                disabled={isGenerating}
                className="flex items-center gap-2 px-5 py-2.5 bg-theme-highlight text-[var(--theme-btn-text)] rounded-xl font-black text-xs hover:-translate-y-0.5 transition-transform shadow-[2px_2px_0_0_var(--theme-border)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <CheckCheck size={16} /> Готово ({checklists.length > 1 ? `скачать ${checklists.length} стр.` : 'скачать'})
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* СКРЫТЫЙ СЛОЙ ДЛЯ НАДЁЖНОЙ ГЕНЕРАЦИИ PDF БЕЗ МЕРЦАНИЯ И ЗАДЕРЖЕК */}
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: '-99999px', 
          width: '794px', 
          pointerEvents: 'none', 
          opacity: 0, 
          zIndex: -1 
        }} 
        aria-hidden="true"
      >
        {checklists.map((item, idx) => {
          const tmpl = templates.find((t) => t.id === item.templateId) || templates[0];
          const isSingle = checkIsSingleSided(tmpl, item.answers);
          const totalSheetPages = calculateTotalPagesForSheet(tmpl, item.answers, isSingle);

          return Array.from({ length: totalSheetPages }).map((_, pIdx) => (
            <div key={`${item.id}-p-${pIdx}`} id={`printable-sheet-${idx}-page-${pIdx}`}>
              <ChecklistPaper
                template={tmpl}
                answers={item.answers}
                pageIndex={pIdx}
                totalPages={totalSheetPages}
                isSingle={isSingle}
              />
            </div>
          ));
        })}
      </div>

    </div>
  );
}

// Вспомогательные функции для расчёта изображений и страниц
function isFrontSideImageBlock(block: ChecklistBlock): boolean {
  if (block.type !== 'image' && block.type !== 'file') return false;
  const title = block.title.toLowerCase();
  const isFront = title.includes('лиц') || title.includes('передн') || title.includes('front');
  const isBack = title.includes('оборот') || title.includes('шершав') || title.includes('back');
  return isFront && !isBack;
}

function getAllImagesForSheet(
  template: ChecklistTemplate,
  answers: Record<string, any>,
  isSingle: boolean
): { blockTitle: string; src: string; index: number }[] {
  const result: { blockTitle: string; src: string; index: number }[] = [];
  const imageBlocks = template?.blocks.filter(
    (b) => b.type === 'image' || b.type === 'file'
  ) || [];

  imageBlocks.forEach((b) => {
    if (isSingle && isFrontSideImageBlock(b)) return;
    const val = answers[b.id];
    if (!val) return;

    const label = isSingle ? 'ШЕРШАВАЯ СТОРОНА (ОБОРОТ)' : b.title;

    if (Array.isArray(val)) {
      val.forEach((src, idx) => {
        if (src) {
          result.push({
            blockTitle: val.length > 1 ? `${label} (Макет ${idx + 1})` : label,
            src,
            index: result.length + 1,
          });
        }
      });
    } else if (typeof val === 'string') {
      result.push({ blockTitle: label, src: val, index: result.length + 1 });
    }
  });

  return result;
}

function calculateTotalPagesForSheet(
  template: ChecklistTemplate,
  answers: Record<string, any>,
  isSingle: boolean
): number {
  const images = getAllImagesForSheet(template, answers, isSingle);
  if (images.length <= 2) return 1;
  const remaining = images.length - 2;
  const overflowPages = Math.ceil(remaining / 4);
  return 1 + overflowPages;
}

// Компонент одного печатного листа А4
function ChecklistPaper({
  template,
  answers,
  pageIndex,
  totalPages,
  isSingle,
}: {
  template: ChecklistTemplate;
  answers: Record<string, any>;
  pageIndex: number;
  totalPages: number;
  isSingle: boolean;
}) {
  const allImages = getAllImagesForSheet(template, answers, isSingle);

  const linkBlock = template?.blocks.find(
    (b) => b.type === 'text' && b.title.toLowerCase().includes('ссылк')
  );

  const commentBlock = template?.blocks.find(
    (b) => b.type === 'textarea' || b.title.toLowerCase().includes('комментар')
  );

  const specBlocks = template?.blocks.filter(
    (b) =>
      b.type !== 'image' &&
      b.type !== 'file' &&
      b.id !== linkBlock?.id &&
      b.id !== commentBlock?.id
  ) || [];

  // Вычисляем, какие фото попадают на эту страницу
  let currentPageImages: { blockTitle: string; src: string; index: number }[] = [];
  if (pageIndex === 0) {
    currentPageImages = allImages.slice(0, 2);
  } else {
    const startIdx = 2 + (pageIndex - 1) * 4;
    currentPageImages = allImages.slice(startIdx, startIdx + 4);
  }

  return (
    <div
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
      {/* ШАПКА */}
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
              {template?.title || 'ЧЕК-ЛИСТ ИЗДЕЛИЯ'} {pageIndex > 0 ? `(ЛИСТ №2 — МАКЕТЫ)` : ''}
            </h1>

            <div
              style={{
                fontSize: '10px',
                fontWeight: 800,
                color: '#2a8bf2',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
              }}
            >
              Фирменный чек-лист • Готов к печати
            </div>
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
              <div
                style={{
                  fontSize: '8.5px',
                  fontWeight: 800,
                  color: '#2a8bf2',
                  marginTop: '2px',
                }}
              >
                ● ПРОВЕРЕНО
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
          <div>СПЕЦИФИКАЦИЯ МАКЕТА К ПЕЧАТИ • ТВОЯ ГАВАНЬ МЕРЧА</div>
          <div style={{ textTransform: 'uppercase' }}>
            ФОРМАТ: А4 • РЕЖИМ: ФИРМЕННЫЙ ЦВЕТ
          </div>
        </div>
      </div>

      {/* ТЕЛО ЛИСТА */}
      {pageIndex === 0 ? (
        /* СТРАНИЦА 1: Спецификация + Макеты (до 2 штук) */
        <div style={{ display: 'flex', gap: '20px', margin: '14px 0', flex: 1 }}>

          {/* Левая колонка со спецификацией */}
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

          {/* Правая колонка с превью */}
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
                <Sparkles size={14} /> Зона проверки макетов
              </span>
              <span style={{ fontSize: '9px', fontFamily: 'monospace' }}>
                {allImages.length > 0 ? `МАКЕТЫ: ${allImages.length} ШТ.` : 'ПРЕДПРОСМОТР'}
              </span>
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
                padding: '12px',
                minHeight: '380px',
              }}
            >
              <div style={{ position: 'absolute', top: '6px', left: '8px', fontSize: '9px', fontFamily: 'monospace', fontWeight: 900, color: '#64748b' }}>┌ 1:1</div>
              <div style={{ position: 'absolute', top: '6px', right: '8px', fontSize: '9px', fontFamily: 'monospace', fontWeight: 900, color: '#64748b' }}>1:1 ┐</div>
              <div style={{ position: 'absolute', bottom: '6px', left: '8px', fontSize: '9px', fontFamily: 'monospace', fontWeight: 900, color: '#64748b' }}>└ 100%</div>
              <div style={{ position: 'absolute', bottom: '6px', right: '8px', fontSize: '9px', fontFamily: 'monospace', fontWeight: 900, color: '#64748b' }}>300 Т/Д ┘</div>

              {currentPageImages.length > 0 ? (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', zIndex: 2 }}>
                  {currentPageImages.map((imgItem, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        maxHeight: '210px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '8.5px',
                          fontFamily: 'monospace',
                          fontWeight: 900,
                          backgroundColor: '#093f8e',
                          color: '#ffffff',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          marginBottom: '4px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {imgItem.blockTitle}
                      </span>
                      <div
                        style={{
                          border: '2px solid #093f8e',
                          borderRadius: '8px',
                          padding: '4px',
                          backgroundColor: '#ffffff',
                          boxShadow: '3px 3px 0px rgba(42,139,242,0.2)',
                        }}
                      >
                        <img
                          src={imgItem.src}
                          alt={imgItem.blockTitle}
                          style={{
                            maxWidth: '220px',
                            maxHeight: currentPageImages.length > 1 ? '135px' : '220px',
                            objectFit: 'contain',
                            display: 'block',
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  {allImages.length > 2 && (
                    <div
                      style={{
                        fontSize: '9px',
                        fontWeight: 900,
                        backgroundColor: '#e6f6fb',
                        color: '#093f8e',
                        border: '1px solid #2a8bf2',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        marginTop: '2px',
                        textTransform: 'uppercase',
                      }}
                    >
                      + ещё {allImages.length - 2} макет(а) на следующей странице →
                    </div>
                  )}
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
      ) : (
        /* СТРАНИЦА 2+: Дополнительные макеты (Сетка 2x2 на всю ширину) */
        <div style={{ margin: '16px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#093f8e',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '2px solid #2a8bf2',
              paddingBottom: '6px',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} /> Дополнительные макеты к изделию «{template?.title}»
            </span>
            <span style={{ fontSize: '10px', fontFamily: 'monospace' }}>
              МАКЕТЫ {3 + (pageIndex - 1) * 4} - {Math.min(allImages.length, 2 + pageIndex * 4)} ИЗ {allImages.length}
            </span>
          </div>

          <div
            style={{
              flex: 1,
              border: '2px dashed #2a8bf2',
              borderRadius: '16px',
              backgroundColor: '#ffffff',
              backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
              backgroundSize: '16px 16px',
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              alignContent: 'center',
            }}
          >
            {currentPageImages.map((imgItem, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #093f8e',
                  borderRadius: '12px',
                  padding: '12px',
                  backgroundColor: '#ffffff',
                  boxShadow: '4px 4px 0px rgba(42,139,242,0.2)',
                  maxHeight: '340px',
                }}
              >
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    fontWeight: 900,
                    backgroundColor: '#093f8e',
                    color: '#ffffff',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                  }}
                >
                  {imgItem.blockTitle}
                </span>
                <img
                  src={imgItem.src}
                  alt={imgItem.blockTitle}
                  style={{
                    maxWidth: '300px',
                    maxHeight: '260px',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ПОДВАЛ */}
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
          СТРАНИЦА {pageIndex + 1} ИЗ {totalPages}
        </div>
      </div>
    </div>
  );
}