'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Check, Save, Plus, Trash2 } from 'lucide-react';
import {
  updatePricingTierAction,
  updateSpecialProductPriceAction,
  updateSmallBatchRuleAction,
  updateModifierPriceAction,
  updateAccessoryPriceAction,
  createPricingTierAction,
  deletePricingTierAction,
  createSpecialProductAction,
  deleteSpecialProductAction,
  createSmallBatchRuleAction,
  deleteSmallBatchRuleAction,
  createModifierAction,
  deleteModifierAction,
  createAccessoryAction,
  deleteAccessoryAction
} from '@/actions/admin/pricing';

function EditablePriceInput({
  initialValue,
  onSave
}: {
  initialValue: number;
  onSave: (value: string) => Promise<void>;
}) {
  const [value, setValue] = useState(initialValue.toString());
  const [isPending, startTransition] = useTransition();
  const [isSaved, setIsSaved] = useState(false);

  const handleBlur = () => {
    if (value === initialValue.toString()) return;

    startTransition(async () => {
      await onSave(value);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    });
  };

  return (
    <div className="relative flex items-center">
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        disabled={isPending}
        className={`w-full p-2 pr-8 rounded-lg border-2 bg-theme-bg font-bold transition-colors ${
          isSaved
            ? 'border-green-500/50 focus:border-green-500 text-green-600'
            : 'border-theme-border focus:border-theme-accent text-theme-text'
        } ${isPending ? 'opacity-50' : ''}`}
      />
      <div className="absolute right-2 flex items-center pointer-events-none">
        {isPending ? (
          <div className="w-4 h-4 rounded-full border-2 border-theme-accent border-t-transparent animate-spin" />
        ) : isSaved ? (
          <Check size={16} className="text-green-500" strokeWidth={3} />
        ) : (
          value !== initialValue.toString() && <Save size={16} className="text-theme-accent opacity-50" />
        )}
      </div>
    </div>
  );
}

export function PricingClient({
  initialPricingTiers,
  initialSpecialProducts,
  initialSmallBatchRules,
  initialModifiers,
  initialAccessories,
}: any) {

  const handleUpdateTier = async (id: string, value: string) => {
    const price = parseInt(value, 10);
    if (isNaN(price)) return;
    try {
      await updatePricingTierAction(id, price);
      toast.success('Цена обновлена');
    } catch (error) {
      toast.error('Ошибка при обновлении цены');
      throw error;
    }
  };

  const handleUpdateSpecialProduct = async (id: string, piecePrice: string, wholesalePrice: string) => {
    const pPrice = parseInt(piecePrice, 10);
    const wPrice = parseInt(wholesalePrice, 10);
    if (isNaN(pPrice) || isNaN(wPrice)) return;
    try {
      await updateSpecialProductPriceAction(id, { piecePrice: pPrice, wholesalePrice: wPrice });
      toast.success('Цены спец-изделия обновлены');
    } catch (error) {
      toast.error('Ошибка при обновлении');
      throw error;
    }
  };

  const handleUpdateSmallBatchRule = async (id: string, value: string) => {
    const price = parseInt(value, 10);
    if (isNaN(price)) return;
    try {
      await updateSmallBatchRuleAction(id, price);
      toast.success('Цена штучного тарифа обновлена');
    } catch (error) {
      toast.error('Ошибка при обновлении');
      throw error;
    }
  };

  const handleUpdateModifier = async (id: string, value: string) => {
    const price = parseInt(value, 10);
    if (isNaN(price)) return;
    try {
      await updateModifierPriceAction(id, price);
      toast.success('Цена опции обновлена');
    } catch (error) {
      toast.error('Ошибка при обновлении');
      throw error;
    }
  };

  const handleUpdateAccessory = async (id: string, value: string) => {
    const price = parseInt(value, 10);
    if (isNaN(price)) return;
    try {
      await updateAccessoryPriceAction(id, price);
      toast.success('Цена фурнитуры обновлена');
    } catch (error) {
      toast.error('Ошибка при обновлении');
      throw error;
    }
  };

  const handleDelete = async (action: (id: string) => Promise<void>, id: string, name: string) => {
    if (!confirm(`Удалить ${name}?`)) return;
    try {
      await action(id);
      toast.success('Удалено');
    } catch (error) {
      toast.error('Ошибка при удалении');
    }
  };

  const handleAddTier = async (e: React.FormEvent<HTMLFormElement>, productType: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const maxDimensionMm = parseInt(formData.get('maxDimensionMm') as string, 10);
    const materialName = formData.get('materialName') as string;
    const price = parseInt(formData.get('price') as string, 10);
    if (isNaN(maxDimensionMm) || !materialName || isNaN(price)) return;
    try {
      await createPricingTierAction({ productType, maxDimensionMm, materialName, price });
      toast.success('Добавлено');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error('Ошибка при добавлении');
    }
  };

  const handleAddSpecialProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const code = formData.get('code') as string;
    const name = formData.get('name') as string;
    const minWholesaleQty = parseInt(formData.get('minWholesaleQty') as string, 10);
    const piecePrice = parseInt(formData.get('piecePrice') as string, 10);
    const wholesalePrice = parseInt(formData.get('wholesalePrice') as string, 10);
    if (!code || !name || isNaN(minWholesaleQty) || isNaN(piecePrice) || isNaN(wholesalePrice)) return;
    try {
      await createSpecialProductAction({ code, name, minWholesaleQty, piecePrice, wholesalePrice });
      toast.success('Добавлено');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error('Ошибка при добавлении');
    }
  };

  const handleAddSmallBatchRule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productType = formData.get('productType') as string;
    const maxDimensionMm = parseInt(formData.get('maxDimensionMm') as string, 10);
    const price = parseInt(formData.get('price') as string, 10);
    if (!productType || isNaN(maxDimensionMm) || isNaN(price)) return;
    try {
      await createSmallBatchRuleAction({ productType, maxDimensionMm, price });
      toast.success('Добавлено');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error('Ошибка при добавлении');
    }
  };

  const handleAddModifier = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const code = formData.get('code') as string;
    const name = formData.get('name') as string;
    const price = parseInt(formData.get('price') as string, 10);
    if (!code || !name || isNaN(price)) return;
    try {
      await createModifierAction({ code, name, price });
      toast.success('Добавлено');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error('Ошибка при добавлении');
    }
  };

  const handleAddAccessory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const price = parseInt(formData.get('price') as string, 10);
    if (!name || isNaN(price)) return;
    try {
      await createAccessoryAction({ name, price });
      toast.success('Добавлено');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error('Ошибка при добавлении');
    }
  };

  const renderTierTable = (productType: string, title: string) => {
    const tiers = initialPricingTiers.filter((t: any) => t.productType === productType);
    const dimensions = Array.from(new Set(tiers.map((t: any) => t.maxDimensionMm))).sort((a: any, b: any) => (a as number) - (b as number));
    const materials = Array.from(new Set(tiers.map((t: any) => t.materialName)));

    return (
      <div className="mb-10 bg-theme-surface p-6 rounded-3xl anime-border anime-shadow">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-3 border-b-2 border-theme-border font-bold">Размер до (мм)</th>
                {materials.map((m: any) => (
                  <th key={m as string} className="p-3 border-b-2 border-theme-border font-bold">{m as string}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dimensions.map((dim: any) => (
                <tr key={dim as number} className="border-b-2 border-theme-border last:border-0 hover:bg-theme-bg/50">
                  <td className="p-3 font-bold flex items-center gap-2">
                    {dim as number}
                    <button
                      onClick={() => {
                        const rule = tiers.find((t: any) => t.maxDimensionMm === dim);
                        if (rule) handleDelete(deletePricingTierAction, rule.id, `размер ${dim}`);
                      }}
                      className="text-red-500 hover:text-red-600 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                  {materials.map((m: any) => {
                    const tier = tiers.find((t: any) => t.maxDimensionMm === dim && t.materialName === m);
                    return (
                      <td key={m as string} className="p-2 relative group">
                        {tier ? (
                          <div className="flex items-center gap-2">
                            <EditablePriceInput
                              initialValue={tier.price}
                              onSave={async (val) => await handleUpdateTier(tier.id, val)}
                            />
                            <button onClick={() => handleDelete(deletePricingTierAction, tier.id, `ячейку`)} className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition-opacity">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form onSubmit={(e) => handleAddTier(e, productType)} className="flex flex-wrap md:flex-nowrap items-end gap-4 bg-theme-bg p-4 rounded-2xl border-2 border-theme-border">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-bold text-theme-muted mb-1">Размер до (мм)</label>
            <input name="maxDimensionMm" type="number" required className="w-full p-2 rounded-lg border-2 border-theme-border bg-theme-surface" />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-bold text-theme-muted mb-1">Материал</label>
            <input name="materialName" type="text" required className="w-full p-2 rounded-lg border-2 border-theme-border bg-theme-surface" />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-bold text-theme-muted mb-1">Цена (₽)</label>
            <input name="price" type="number" required className="w-full p-2 rounded-lg border-2 border-theme-border bg-theme-surface" />
          </div>
          <button type="submit" className="anime-button px-4 py-2 h-[44px] flex items-center justify-center gap-2">
            <Plus size={20} /> Добавить
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {renderTierTable('keychain', 'Брелоки (Оптовые цены)')}
      {renderTierTable('stand', 'Стенды (Оптовые цены)')}

      <div className="mb-10 bg-theme-surface p-6 rounded-3xl anime-border anime-shadow">
        <h2 className="text-2xl font-bold mb-4">Специальные изделия</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {initialSpecialProducts.map((p: any) => (
            <div key={p.id} className="p-4 border-2 border-theme-border rounded-xl relative group">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{p.name} <span className="text-sm font-normal text-theme-muted">({p.code})</span></h3>
                <button onClick={() => handleDelete(deleteSpecialProductAction, p.id, p.name)} className="text-red-500 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm text-theme-muted block mb-1">Штучно</label>
                  <EditablePriceInput
                    initialValue={p.piecePrice}
                    onSave={async (val) => await handleUpdateSpecialProduct(p.id, val, p.wholesalePrice.toString())}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-theme-muted block mb-1">Опт (от {p.minWholesaleQty} шт)</label>
                  <EditablePriceInput
                    initialValue={p.wholesalePrice}
                    onSave={async (val) => await handleUpdateSpecialProduct(p.id, p.piecePrice.toString(), val)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleAddSpecialProduct} className="flex flex-wrap md:flex-nowrap items-end gap-4 bg-theme-bg p-4 rounded-2xl border-2 border-theme-border">
           <div className="flex-1 min-w-[120px]">
             <label className="block text-xs font-bold text-theme-muted mb-1">Код</label>
             <input name="code" type="text" required placeholder="nfc_card" className="w-full p-2 rounded-lg border-2 border-theme-border bg-theme-surface" />
           </div>
           <div className="flex-1 min-w-[120px]">
             <label className="block text-xs font-bold text-theme-muted mb-1">Название</label>
             <input name="name" type="text" required placeholder="NFC-карточка" className="w-full p-2 rounded-lg border-2 border-theme-border bg-theme-surface" />
           </div>
           <div className="flex-[0.5] min-w-[80px]">
             <label className="block text-xs font-bold text-theme-muted mb-1">От (шт)</label>
             <input name="minWholesaleQty" type="number" required defaultValue="10" className="w-full p-2 rounded-lg border-2 border-theme-border bg-theme-surface" />
           </div>
           <div className="flex-[0.8] min-w-[100px]">
             <label className="block text-xs font-bold text-theme-muted mb-1">Штучно (₽)</label>
             <input name="piecePrice" type="number" required className="w-full p-2 rounded-lg border-2 border-theme-border bg-theme-surface" />
           </div>
           <div className="flex-[0.8] min-w-[100px]">
             <label className="block text-xs font-bold text-theme-muted mb-1">Опт (₽)</label>
             <input name="wholesalePrice" type="number" required className="w-full p-2 rounded-lg border-2 border-theme-border bg-theme-surface" />
           </div>
           <button type="submit" className="anime-button px-4 py-2 h-[44px] flex items-center justify-center">
             <Plus size={20} />
           </button>
        </form>
      </div>

      <div className="mb-10 bg-theme-surface p-6 rounded-3xl anime-border anime-shadow">
        <h2 className="text-2xl font-bold mb-4">Штучные тарифы (&lt; 10 шт)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {initialSmallBatchRules.map((rule: any) => (
            <div key={rule.id} className="p-4 border-2 border-theme-border rounded-xl relative group">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">{rule.productType === 'keychain' ? 'Брелок' : 'Стенд'} до {rule.maxDimensionMm} мм</h3>
                <button onClick={() => handleDelete(deleteSmallBatchRuleAction, rule.id, 'правило')} className="text-red-500 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={16} />
                </button>
              </div>
              <EditablePriceInput
                initialValue={rule.price}
                onSave={async (val) => await handleUpdateSmallBatchRule(rule.id, val)}
              />
            </div>
          ))}
        </div>
        <form onSubmit={handleAddSmallBatchRule} className="flex flex-wrap md:flex-nowrap items-end gap-4 bg-theme-bg p-4 rounded-2xl border-2 border-theme-border">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-bold text-theme-muted mb-1">Тип изделия</label>
            <select name="productType" className="w-full p-2.5 rounded-lg border-2 border-theme-border bg-theme-surface font-bold">
              <option value="keychain">Брелок</option>
              <option value="stand">Стенд</option>
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-bold text-theme-muted mb-1">Размер до (мм)</label>
            <input name="maxDimensionMm" type="number" required className="w-full p-2 rounded-lg border-2 border-theme-border bg-theme-surface" />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-bold text-theme-muted mb-1">Цена (₽)</label>
            <input name="price" type="number" required className="w-full p-2 rounded-lg border-2 border-theme-border bg-theme-surface" />
          </div>
          <button type="submit" className="anime-button px-4 py-2 h-[44px] flex items-center justify-center gap-2">
            <Plus size={20} /> Добавить
          </button>
        </form>
      </div>

      <div className="mb-10 bg-theme-surface p-6 rounded-3xl anime-border anime-shadow">
        <h2 className="text-2xl font-bold mb-4">Наценки за услуги</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {initialModifiers.map((mod: any) => (
            <div key={mod.id} className="p-4 border-2 border-theme-border rounded-xl relative group">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">{mod.name}</h3>
                <button onClick={() => handleDelete(deleteModifierAction, mod.id, mod.name)} className="text-red-500 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={16} />
                </button>
              </div>
              <EditablePriceInput
                initialValue={mod.price}
                onSave={async (val) => await handleUpdateModifier(mod.id, val)}
              />
            </div>
          ))}
        </div>
        <form onSubmit={handleAddModifier} className="flex flex-wrap md:flex-nowrap items-end gap-4 bg-theme-bg p-4 rounded-2xl border-2 border-theme-border">
           <div className="flex-[0.8] min-w-[120px]">
             <label className="block text-xs font-bold text-theme-muted mb-1">Код</label>
             <input name="code" type="text" required placeholder="print_double_sided_keychain" className="w-full p-2 rounded-lg border-2 border-theme-border bg-theme-surface" />
           </div>
           <div className="flex-1 min-w-[150px]">
             <label className="block text-xs font-bold text-theme-muted mb-1">Название</label>
             <input name="name" type="text" required placeholder="Двусторонняя печать" className="w-full p-2 rounded-lg border-2 border-theme-border bg-theme-surface" />
           </div>
           <div className="flex-[0.5] min-w-[100px]">
             <label className="block text-xs font-bold text-theme-muted mb-1">Цена (₽)</label>
             <input name="price" type="number" required className="w-full p-2 rounded-lg border-2 border-theme-border bg-theme-surface" />
           </div>
           <button type="submit" className="anime-button px-4 py-2 h-[44px] flex items-center justify-center gap-2">
             <Plus size={20} /> Добавить
           </button>
        </form>
      </div>

      <div className="mb-10 bg-theme-surface p-6 rounded-3xl anime-border anime-shadow">
        <h2 className="text-2xl font-bold mb-4">Фурнитура</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          {initialAccessories.map((acc: any) => (
            <div key={acc.id} className="p-4 border-2 border-theme-border rounded-xl relative group">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-sm truncate" title={acc.name}>{acc.name}</h3>
                <button onClick={() => handleDelete(deleteAccessoryAction, acc.id, acc.name)} className="text-red-500 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={16} />
                </button>
              </div>
              <EditablePriceInput
                initialValue={acc.price}
                onSave={async (val) => await handleUpdateAccessory(acc.id, val)}
              />
            </div>
          ))}
        </div>
        <form onSubmit={handleAddAccessory} className="flex flex-wrap md:flex-nowrap items-end gap-4 bg-theme-bg p-4 rounded-2xl border-2 border-theme-border">
           <div className="flex-1 min-w-[150px]">
             <label className="block text-xs font-bold text-theme-muted mb-1">Название</label>
             <input name="name" type="text" required placeholder="Карабин-звезда" className="w-full p-2 rounded-lg border-2 border-theme-border bg-theme-surface" />
           </div>
           <div className="flex-[0.5] min-w-[100px]">
             <label className="block text-xs font-bold text-theme-muted mb-1">Цена (₽)</label>
             <input name="price" type="number" required className="w-full p-2 rounded-lg border-2 border-theme-border bg-theme-surface" />
           </div>
           <button type="submit" className="anime-button px-4 py-2 h-[44px] flex items-center justify-center gap-2">
             <Plus size={20} /> Добавить
           </button>
        </form>
      </div>
    </div>
  );
}
