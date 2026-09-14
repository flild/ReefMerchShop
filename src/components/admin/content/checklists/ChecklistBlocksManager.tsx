"use client";

import { useState } from "react";
import {
  createChecklistBlock,
  updateChecklistBlock,
  deleteChecklistBlock,
} from "@/actions/admin/checklists";
import { Trash2, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { toast } from "sonner";

export function ChecklistBlocksManager({
  templateId,
  initialBlocks,
}: {
  templateId: string;
  initialBlocks: any[];
}) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [editingBlock, setEditingBlock] = useState<any>(null);

  const moveBlock = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // Swap
    [newBlocks[index], newBlocks[targetIndex]] = [
      newBlocks[targetIndex],
      newBlocks[index],
    ];

    // Update orderIndex
    newBlocks.forEach((b, i) => (b.orderIndex = i));
    setBlocks(newBlocks);

    // Save to DB
    try {
      await Promise.all([
        updateChecklistBlock(newBlocks[index].id, templateId, newBlocks[index]),
        updateChecklistBlock(
          newBlocks[targetIndex].id,
          templateId,
          newBlocks[targetIndex],
        ),
      ]);
    } catch (e) {
      toast.error("Ошибка сохранения порядка");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* List of blocks */}
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            className="bg-theme-surface border-2 border-theme-border rounded-[24px] p-4 flex items-center justify-between gap-4 anime-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveBlock(index, "up")}
                  disabled={index === 0}
                  className="text-theme-muted hover:text-theme-text disabled:opacity-30"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  onClick={() => moveBlock(index, "down")}
                  disabled={index === blocks.length - 1}
                  className="text-theme-muted hover:text-theme-text disabled:opacity-30"
                >
                  <ArrowDown size={16} />
                </button>
              </div>
              <div>
                <h4 className="font-extrabold text-theme-text text-lg">
                  {block.title}
                </h4>
                <div className="text-theme-muted font-bold text-sm flex gap-2">
                  <span className="uppercase tracking-wider">{block.type}</span>
                  {block.isRequired && (
                    <span className="text-theme-accent">• Обязательное</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditingBlock(block)}
                className="p-2 text-theme-highlight hover:bg-theme-highlight/10 rounded-xl transition-colors"
              >
                ✎
              </button>
              <button
                onClick={async () => {
                  if (confirm("Удалить блок?")) {
                    await deleteChecklistBlock(block.id, templateId);
                    setBlocks(blocks.filter((b) => b.id !== block.id));
                    toast.success("Блок удален");
                  }
                }}
                className="p-2 text-theme-red-text hover:bg-theme-red-bg rounded-xl transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() =>
          setEditingBlock({
            type: "text",
            title: "",
            isRequired: false,
            optionsJson: "[]",
            orderIndex: blocks.length,
          })
        }
        className="flex items-center justify-center gap-2 py-4 border-2 border-dashed border-theme-border rounded-[24px] text-theme-muted hover:text-theme-highlight hover:border-theme-highlight transition-colors font-bold"
      >
        <Plus size={20} /> Добавить блок
      </button>

      {/* Editor Form Modal or inline */}
      {editingBlock && (
        <div className="fixed inset-0 bg-theme-bg/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-theme-surface border-2 border-theme-border rounded-[32px] p-8 max-w-2xl w-full anime-shadow max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-extrabold mb-6">
              {editingBlock.id ? "Редактировать блок" : "Новый блок"}
            </h3>

            <BlockEditorForm
              block={editingBlock}
              onSave={async (data) => {
                if (editingBlock.id) {
                  await updateChecklistBlock(editingBlock.id, templateId, data);
                  setBlocks(
                    blocks.map((b) =>
                      b.id === editingBlock.id ? { ...b, ...data } : b,
                    ),
                  );
                  toast.success("Блок обновлен");
                } else {
                  const id = await createChecklistBlock(templateId, data);
                  setBlocks([...blocks, { ...data, id }]);
                  toast.success("Блок добавлен");
                }
                setEditingBlock(null);
              }}
              onCancel={() => setEditingBlock(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function BlockEditorForm({
  block,
  onSave,
  onCancel,
}: {
  block: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [type, setType] = useState(block.type);
  const [options, setOptions] = useState<any[]>(() => {
    try {
      return JSON.parse(block.optionsJson) || [];
    } catch {
      return [];
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSave({
      type,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      isRequired: formData.get("isRequired") === "on",
      optionsJson: JSON.stringify(options),
      orderIndex: block.orderIndex,
    });
  };

  const hasOptions = ["select", "checkbox", "radio"].includes(type);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm text-theme-muted">Тип поля</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-theme-bg border-2 border-theme-border rounded-[16px] px-4 py-2 font-bold text-theme-text outline-none focus:border-theme-highlight"
          >
            <option value="text">Текст (короткий)</option>
            <option value="textarea">Текст (длинный)</option>
            <option value="number">Число</option>
            <option value="radio">Один вариант (с картинками)</option>
            <option value="checkbox">Несколько вариантов</option>
            <option value="select">Выпадающий список</option>
            <option value="image">Загрузка изображения</option>
            <option value="file">Загрузка файла</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 justify-center pt-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isRequired"
              defaultChecked={block.isRequired}
              className="w-5 h-5 accent-theme-accent"
            />
            <span className="font-bold text-theme-text">Обязательное поле</span>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-sm text-theme-muted">Заголовок</label>
        <input
          type="text"
          name="title"
          defaultValue={block.title}
          required
          className="bg-theme-bg border-2 border-theme-border rounded-[16px] px-4 py-2 font-bold text-theme-text outline-none focus:border-theme-highlight"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-sm text-theme-muted">
          Описание (опционально)
        </label>
        <textarea
          name="description"
          defaultValue={block.description}
          rows={2}
          className="bg-theme-bg border-2 border-theme-border rounded-[16px] px-4 py-2 font-bold text-theme-text outline-none focus:border-theme-highlight resize-none"
        />
      </div>

      {hasOptions && (
        <div className="flex flex-col gap-4 border-2 border-theme-border p-4 rounded-[16px]">
          <h4 className="font-bold text-theme-text">Варианты ответов</h4>

          {options.map((opt, i) => (
            <div key={i} className="flex gap-2 items-start">
              <input
                type="text"
                value={opt.label}
                onChange={(e) => {
                  const newOpts = [...options];
                  newOpts[i].label = e.target.value;
                  setOptions(newOpts);
                }}
                placeholder="Название"
                className="bg-theme-bg border-2 border-theme-border rounded-[12px] px-3 py-1.5 font-bold flex-1"
              />
              <input
                type="url"
                value={opt.imageUrl || ""}
                onChange={(e) => {
                  const newOpts = [...options];
                  newOpts[i].imageUrl = e.target.value;
                  setOptions(newOpts);
                }}
                placeholder="URL картинки (опционально)"
                className="bg-theme-bg border-2 border-theme-border rounded-[12px] px-3 py-1.5 font-bold flex-1"
              />
              <button
                type="button"
                onClick={() =>
                  setOptions(options.filter((_, idx) => idx !== i))
                }
                className="p-2 text-theme-red-text"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setOptions([...options, { label: "", imageUrl: "" }])
            }
            className="text-theme-highlight font-bold self-start mt-2"
          >
            + Добавить вариант
          </button>
        </div>
      )}

      <div className="flex gap-4 mt-4">
        <button type="submit" className="anime-button px-6 py-2">
          Сохранить блок
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-theme-muted font-bold"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
