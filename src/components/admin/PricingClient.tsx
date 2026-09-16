'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Check, Save } from 'lucide-react';
import {
  updatePricingTierAction,
  updateSpecialProductPriceAction,
  updateSmallBatchRuleAction,
  updateModifierPriceAction,
  updateAccessoryPriceAction
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

  const renderTierTable = (productType: string, title: string) => {
    const tiers = initialPricingTiers.filter((t: any) => t.productType === productType);
    const dimensions = Array.from(new Set(tiers.map((t: any) => t.maxDimensionMm))).sort((a: any, b: any) => a - b);
    const materials = Array.from(new Set(tiers.map((t: any) => t.materialName)));

    return (
      <div className="mb-10 bg-theme-surface p-6 rounded-3xl anime-border anime-shadow">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-3 border-b-2 border-theme-border font-bold">Размер до (мм)</th>
                {materials.map((m: any) => (
                  <th key={m} className="p-3 border-b-2 border-theme-border font-bold">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dimensions.map((dim: any) => (
                <tr key={dim} className="border-b-2 border-theme-border last:border-0 hover:bg-theme-bg/50">
                  <td className="p-3 font-bold">{dim}</td>
                  {materials.map((m: any) => {
                    const tier = tiers.find((t: any) => t.maxDimensionMm === dim && t.materialName === m);
                    return (
                      <td key={m} className="p-2">
                        {tier ? (
                          <EditablePriceInput
                            initialValue={tier.price}
                            onSave={async (val) => await handleUpdateTier(tier.id, val)}
                          />
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
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {renderTierTable('keychain', 'Брелоки (Оптовые цены)')}
      {renderTierTable('stand', 'Стенды (Оптовые цены)')}

      <div className="mb-10 bg-theme-surface p-6 rounded-3xl anime-border anime-shadow">
        <h2 className="text-2xl font-bold mb-4">Специальные изделия</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {initialSpecialProducts.map((p: any) => (
            <div key={p.id} className="p-4 border-2 border-theme-border rounded-xl">
              <h3 className="font-bold mb-2">{p.name}</h3>
              <div className="flex gap-4">
                <div>
                  <label className="text-sm text-theme-muted block mb-1">Штучно</label>
                  <EditablePriceInput
                    initialValue={p.piecePrice}
                    onSave={async (val) => await handleUpdateSpecialProduct(p.id, val, p.wholesalePrice.toString())}
                  />
                </div>
                <div>
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
      </div>

      <div className="mb-10 bg-theme-surface p-6 rounded-3xl anime-border anime-shadow">
        <h2 className="text-2xl font-bold mb-4">Штучные тарифы (&lt; 10 шт)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {initialSmallBatchRules.map((rule: any) => (
            <div key={rule.id} className="p-4 border-2 border-theme-border rounded-xl">
              <h3 className="font-bold">{rule.productType === 'keychain' ? 'Брелок' : 'Стенд'} до {rule.maxDimensionMm} мм</h3>
              <EditablePriceInput
                initialValue={rule.price}
                onSave={async (val) => await handleUpdateSmallBatchRule(rule.id, val)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10 bg-theme-surface p-6 rounded-3xl anime-border anime-shadow">
        <h2 className="text-2xl font-bold mb-4">Наценки за услуги</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {initialModifiers.map((mod: any) => (
            <div key={mod.id} className="p-4 border-2 border-theme-border rounded-xl">
              <h3 className="font-bold">{mod.name}</h3>
              <EditablePriceInput
                initialValue={mod.price}
                onSave={async (val) => await handleUpdateModifier(mod.id, val)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10 bg-theme-surface p-6 rounded-3xl anime-border anime-shadow">
        <h2 className="text-2xl font-bold mb-4">Фурнитура</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {initialAccessories.map((acc: any) => (
            <div key={acc.id} className="p-4 border-2 border-theme-border rounded-xl">
              <h3 className="font-bold text-sm truncate">{acc.name}</h3>
              <EditablePriceInput
                initialValue={acc.price}
                onSave={async (val) => await handleUpdateAccessory(acc.id, val)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
