'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
  updatePricingTierAction,
  updateSpecialProductPriceAction,
  updateSmallBatchRuleAction,
  updateModifierPriceAction,
  updateAccessoryPriceAction
} from '@/actions/admin/pricing';

export function PricingClient({
  initialPricingTiers,
  initialSpecialProducts,
  initialSmallBatchRules,
  initialModifiers,
  initialAccessories,
}: any) {
  const [isPending, startTransition] = useTransition();

  const handleUpdateTier = (id: string, value: string) => {
    const price = parseInt(value, 10);
    if (isNaN(price)) return;
    startTransition(async () => {
      try {
        await updatePricingTierAction(id, price);
        toast.success('Цена обновлена');
      } catch (error) {
        toast.error('Ошибка при обновлении цены');
      }
    });
  };

  const handleUpdateSpecialProduct = (id: string, piecePrice: string, wholesalePrice: string) => {
    const pPrice = parseInt(piecePrice, 10);
    const wPrice = parseInt(wholesalePrice, 10);
    if (isNaN(pPrice) || isNaN(wPrice)) return;

    startTransition(async () => {
      try {
        await updateSpecialProductPriceAction(id, { piecePrice: pPrice, wholesalePrice: wPrice });
        toast.success('Цены спец-изделия обновлены');
      } catch (error) {
        toast.error('Ошибка при обновлении');
      }
    });
  };

  const handleUpdateSmallBatchRule = (id: string, value: string) => {
    const price = parseInt(value, 10);
    if (isNaN(price)) return;
    startTransition(async () => {
      try {
        await updateSmallBatchRuleAction(id, price);
        toast.success('Цена штучного тарифа обновлена');
      } catch (error) {
        toast.error('Ошибка при обновлении');
      }
    });
  };

  const handleUpdateModifier = (id: string, value: string) => {
    const price = parseInt(value, 10);
    if (isNaN(price)) return;
    startTransition(async () => {
      try {
        await updateModifierPriceAction(id, price);
        toast.success('Цена опции обновлена');
      } catch (error) {
        toast.error('Ошибка при обновлении');
      }
    });
  };

  const handleUpdateAccessory = (id: string, value: string) => {
    const price = parseInt(value, 10);
    if (isNaN(price)) return;
    startTransition(async () => {
      try {
        await updateAccessoryPriceAction(id, price);
        toast.success('Цена фурнитуры обновлена');
      } catch (error) {
        toast.error('Ошибка при обновлении');
      }
    });
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
                          <input
                            type="number"
                            defaultValue={tier.price}
                            onBlur={(e) => handleUpdateTier(tier.id, e.target.value)}
                            className="w-24 p-2 rounded-lg border-2 border-theme-border bg-theme-bg text-theme-text font-bold"
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
                  <input
                    type="number"
                    defaultValue={p.piecePrice}
                    onBlur={(e) => handleUpdateSpecialProduct(p.id, e.target.value, p.wholesalePrice.toString())}
                    className="w-full p-2 rounded-lg border-2 border-theme-border bg-theme-bg font-bold"
                  />
                </div>
                <div>
                  <label className="text-sm text-theme-muted block mb-1">Опт (от {p.minWholesaleQty} шт)</label>
                  <input
                    type="number"
                    defaultValue={p.wholesalePrice}
                    onBlur={(e) => handleUpdateSpecialProduct(p.id, p.piecePrice.toString(), e.target.value)}
                    className="w-full p-2 rounded-lg border-2 border-theme-border bg-theme-bg font-bold"
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
              <input
                type="number"
                defaultValue={rule.price}
                onBlur={(e) => handleUpdateSmallBatchRule(rule.id, e.target.value)}
                className="w-full mt-2 p-2 rounded-lg border-2 border-theme-border bg-theme-bg font-bold"
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
              <input
                type="number"
                defaultValue={mod.price}
                onBlur={(e) => handleUpdateModifier(mod.id, e.target.value)}
                className="w-full mt-2 p-2 rounded-lg border-2 border-theme-border bg-theme-bg font-bold"
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
              <input
                type="number"
                defaultValue={acc.price}
                onBlur={(e) => handleUpdateAccessory(acc.id, e.target.value)}
                className="w-full mt-2 p-2 rounded-lg border-2 border-theme-border bg-theme-bg font-bold"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
