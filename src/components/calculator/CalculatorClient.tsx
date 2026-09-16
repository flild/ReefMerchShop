'use client';

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calculator, ShoppingBag, ArrowRight, AlertCircle } from 'lucide-react';

interface Material {
  id: string;
  name: string;
  pricePerCm2: number;
}

interface Accessory {
  id: string;
  name: string;
  price: number;
}

interface CalculatorClientProps {
  dbMaterials: any[];
  dbAccessories: any[];
  dbPricingTiers: any[];
  dbSpecialProducts: any[];
  dbSmallBatchRules: any[];
  dbModifiers: any[];
}

function stripEmojis(str: string) {
  return str.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
}

export function CalculatorClient({
  dbMaterials,
  dbAccessories,
  dbPricingTiers,
  dbSpecialProducts,
  dbSmallBatchRules,
  dbModifiers
}: CalculatorClientProps) {
  const [productType, setProductType] = useState<any>('keychain');
  const [materialId, setMaterialId] = useState<string>(dbMaterials[0]?.id || '');
  const [accessoryId, setAccessoryId] = useState<string>(dbAccessories[0]?.id || '');
  const [size, setSize] = useState<number | string>(50);
  const [quantity, setQuantity] = useState<number | string>(10);
  const [isDoubleSided, setIsDoubleSided] = useState<boolean>(false);

  const { unitPrice, materialCost, accessoryCost, total, isIndividual, isSmallBatch, smallBatchMsg } = useMemo(() => {
    const numSize = Number(size) || 0;
    const numQuantity = Number(quantity) || 0;
    
    let isIndividual = false;
    let isSmallBatch = false;
    let smallBatchMsg = '';

    let mCost = 0;
    let aCost = 0;
    let uPrice = 0;
    let tPrice = 0;

    const selectedMat = dbMaterials.find(m => m.id === materialId) || dbMaterials[0];
    const selectedAcc = dbAccessories.find(a => a.id === accessoryId);

    // Double sided logic
    let doubleSidedMarkup = 0;
    if (isDoubleSided) {
       if (productType === 'keychain') {
          doubleSidedMarkup = dbModifiers.find((m: any) => m.code === 'print_double_sided_keychain')?.price || 40;
       } else if (productType === 'stand') {
          doubleSidedMarkup = dbModifiers.find((m: any) => m.code === 'print_double_sided_stand')?.price || 70;
       }
    }

    if (productType === 'icecream_keychain') {
      const sp = dbSpecialProducts.find((p: any) => p.code === 'icecream_keychain');
      if (sp) {
        if (numQuantity < sp.minWholesaleQty) {
          isSmallBatch = true;
          smallBatchMsg = `При заказе от ${sp.minWholesaleQty} шт цена будет ${sp.wholesalePrice} ₽/шт!`;
          uPrice = sp.piecePrice;
        } else {
          uPrice = sp.wholesalePrice;
        }
        mCost = uPrice;
      }
    } else if (productType === 'nfc_card') {
      const sp = dbSpecialProducts.find((p: any) => p.code === 'nfc_card');
      if (sp) {
        if (numQuantity < sp.minWholesaleQty) {
          isSmallBatch = true;
          uPrice = sp.piecePrice;
        } else {
          uPrice = sp.wholesalePrice;
        }
        mCost = uPrice;
      }
    } else {
      // keychain and stand
      const maxSize = productType === 'keychain' ? 80 : 200;
      if (numSize > maxSize) {
        isIndividual = true;
      } else {
        if (numQuantity < 10) {
          isSmallBatch = true;
          smallBatchMsg = 'При заказе до 10 шт. действует штучный тариф. От 10 шт. цена за единицу значительно выгоднее!';

          // Small batch rules
          const rule = dbSmallBatchRules
            .filter((r: any) => r.productType === productType && r.maxDimensionMm >= numSize)
            .sort((a: any, b: any) => a.maxDimensionMm - b.maxDimensionMm)[0];

          if (rule) {
             mCost = rule.price;
          } else {
             // Fallback
             mCost = productType === 'keychain' ? 600 : (numSize <= 100 ? 800 : 1500);
          }

          if (productType === 'keychain') {
             aCost = 0; // free accessory
          } else {
             aCost = selectedAcc ? selectedAcc.price : 0;
          }
        } else {
          // Wholesale pricing tiers
          const matName = selectedMat ? stripEmojis(selectedMat.name) : '';
          const tier = dbPricingTiers
            .filter((t: any) => t.productType === productType && t.materialName === matName && t.maxDimensionMm >= numSize)
            .sort((a: any, b: any) => a.maxDimensionMm - b.maxDimensionMm)[0];

          if (tier) {
             mCost = tier.price;
          } else {
             // Fallback area calc
             let areaCm2 = (numSize * numSize) / 100;
             if (productType === 'stand') areaCm2 *= 1.5;
             mCost = areaCm2 * (selectedMat?.pricePerCm2 || 0);
          }
          aCost = (productType === 'keychain' && selectedAcc) ? selectedAcc.price : 0;
        }
        uPrice = mCost + aCost + doubleSidedMarkup;
      }
    }

    tPrice = uPrice * numQuantity;

    return {
      materialCost: Math.round(mCost),
      accessoryCost: aCost,
      unitPrice: Math.round(uPrice),
      total: Math.round(tPrice),
      isIndividual,
      isSmallBatch,
      smallBatchMsg
    };
  }, [productType, materialId, accessoryId, size, quantity, isDoubleSided, dbMaterials, dbAccessories, dbPricingTiers, dbSpecialProducts, dbSmallBatchRules, dbModifiers]);


  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      {/* Левая колонка: Настройки */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 bg-theme-surface rounded-[40px] p-8 md:p-10 anime-border anime-shadow relative"
      >
        <div className="flex items-center gap-4 mb-10 text-theme-text">
          <div className="p-4 bg-theme-bg rounded-3xl anime-border text-theme-highlight">
            <Calculator size={36} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-display font-black">Сборка заказа</h1>
        </div>

        <div className="mb-10 p-6 bg-theme-highlight/10 border-2 border-theme-highlight/30 rounded-[24px] text-theme-text font-medium leading-relaxed flex gap-4 items-start">
          <AlertCircle className="text-theme-highlight shrink-0 mt-1" size={24} />
          <p>
            <span className="font-bold">Обратите внимание:</span> составные изделия (например, брелок с дополнительной подвеской) рассчитываются как два независимых макета по их фактическому размеру.
          </p>
        </div>

        <div className="space-y-10">
          {/* Тип изделия */}
          <div>
            <h3 className="font-display font-black text-xl text-theme-text mb-4">Тип изделия</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'keychain', name: 'Брелок' },
                { id: 'stand', name: 'Стенд' },
                { id: 'icecream_keychain', name: 'Мороженка' },
                { id: 'nfc_card', name: 'NFC' }
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => setProductType(type.id as any)}
                  className={`p-5 rounded-[24px] border-2 text-center transition-all font-bold text-lg shadow-sm ${
                    productType === type.id 
                      ? 'border-theme-accent bg-theme-accent/10 text-theme-accent shadow-[0_4px_0_0_var(--theme-btn-shadow)] -translate-y-1' 
                      : 'border-theme-border text-theme-muted hover:border-theme-highlight/50 hover:bg-theme-bg hover:-translate-y-1'
                  }`}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>

          {/* Материал */}
          {(productType === 'keychain' || productType === 'stand') && (
            <div>
              <h3 className="font-display font-black text-xl text-theme-text mb-4">Материал (Акрил)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dbMaterials.map(mat => (
                  <button
                    key={mat.id}
                    onClick={() => setMaterialId(mat.id)}
                    className={`p-5 rounded-[24px] border-2 text-left transition-all font-bold text-lg shadow-sm flex justify-between items-center ${
                      materialId === mat.id
                        ? 'border-theme-accent bg-theme-accent/10 text-theme-accent shadow-[0_4px_0_0_var(--theme-btn-shadow)] -translate-y-1'
                        : 'border-theme-border text-theme-muted hover:border-theme-highlight/50 hover:bg-theme-bg hover:-translate-y-1'
                    }`}
                  >
                    <span>{stripEmojis(mat.name)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Фурнитура (Только для брелоков) */}
          <motion.div 
            animate={{ height: productType === 'keychain' ? 'auto' : 0, opacity: productType === 'keychain' ? 1 : 0 }}
            className="overflow-hidden"
          >
            <h3 className="font-display font-black text-xl text-theme-text mb-4">Фурнитура</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {dbAccessories.map(acc => (
                <button
                  key={acc.id}
                  onClick={() => setAccessoryId(acc.id)}
                  className={`p-4 rounded-[20px] border-2 text-center transition-all font-bold text-sm shadow-sm flex flex-col items-center gap-2 ${
                    accessoryId === acc.id 
                      ? 'border-theme-accent bg-theme-accent/10 text-theme-accent shadow-[0_4px_0_0_var(--theme-btn-shadow)] -translate-y-1' 
                      : 'border-theme-border text-theme-muted hover:border-theme-highlight/50 hover:bg-theme-bg hover:-translate-y-1'
                  }`}
                >
                  <span>{stripEmojis(acc.name)}</span>
                  <span className="text-xs opacity-70">{acc.price} ₽</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Double Sided */}
          {(productType === 'keychain' || productType === 'stand') && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={isDoubleSided} onChange={(e) => setIsDoubleSided(e.target.checked)} className="w-5 h-5 accent-theme-accent" />
              <span className="font-bold text-theme-text">Двусторонняя печать (+{productType === 'keychain' ? 40 : 70} ₽)</span>
            </label>
          )}

          {/* Ползунки и инпуты */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-theme-bg p-8 rounded-[32px] anime-border">
            
            {/* Гибридный контрол Размера */}
            {(productType === 'keychain' || productType === 'stand') ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-black text-xl text-theme-text">Размер</h3>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    min="10" max="300" step="1"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-20 p-2 rounded-xl border-2 border-theme-border focus:border-theme-accent focus:outline-none text-center font-bold text-theme-text bg-theme-surface shadow-inner"
                  />
                  <span className="font-bold text-theme-muted">мм</span>
                </div>
              </div>
              <input 
                type="range" 
                min="10" max="150" step="1"
                value={Number(size) || 30}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-theme-accent h-3 bg-theme-surface rounded-full appearance-none outline-none anime-border shadow-sm cursor-pointer mt-2"
              />
            </div>
            ) : <div />}

            {/* Тираж */}
            <div>
              <h3 className="font-display font-black text-xl text-theme-text mb-4">Тираж (шт)</h3>
              <input 
                type="number" 
                min="1" max="5000" step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-4 rounded-2xl border-2 border-theme-border focus:border-theme-accent focus:outline-none transition-colors text-center font-black text-2xl text-theme-text bg-theme-surface shadow-inner"
              />
            </div>
            
          </div>
        </div>
      </motion.div>

      {/* Правая колонка: Смета */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-[400px]"
      >
        <div className="sticky top-28 bg-theme-surface rounded-[40px] p-8 md:p-10 anime-border anime-shadow">
          <h3 className="text-2xl font-display font-black mb-8 flex items-center gap-3 text-theme-text">
            <div className="p-3 bg-theme-bg rounded-2xl anime-border text-theme-highlight">
              <ShoppingBag size={28} />
            </div>
            Предварительная смета
          </h3>

          {isSmallBatch && smallBatchMsg && (
            <div className="mb-6 p-4 bg-theme-yellow-bg border-2 border-theme-yellow-text/30 rounded-2xl text-theme-yellow-text font-bold text-sm">
              <AlertCircle className="inline-block mr-2 mb-1" size={18} />
              {smallBatchMsg}
            </div>
          )}

          {isIndividual ? (
             <div className="mb-6 p-4 bg-theme-accent/10 border-2 border-theme-accent/30 rounded-2xl text-theme-accent font-bold text-sm text-center">
               Указан индивидуальный размер. Автоматический расчет недоступен — оставьте заявку, и менеджер рассчитает точную стоимость вручную.
             </div>
          ) : (
            <div className="space-y-6 mb-10 text-lg font-bold text-theme-text">
              <div className="flex justify-between border-b-2 border-theme-border pb-4">
                <span className="text-theme-muted">Материал (за шт.)</span>
                <span>{materialCost} ₽</span>
              </div>
              {productType === 'keychain' && (
                <div className="flex justify-between border-b-2 border-theme-border pb-4">
                  <span className="text-theme-muted">Фурнитура</span>
                  <span>{accessoryCost > 0 ? `${accessoryCost} ₽` : 'Бесплатно в штучном тарифе'}</span>
                </div>
              )}
              {isDoubleSided && (productType === 'keychain' || productType === 'stand') && (
                <div className="flex justify-between border-b-2 border-theme-border pb-4">
                  <span className="text-theme-muted">Двусторонняя печать</span>
                  <span>+{productType === 'keychain' ? 40 : 70} ₽</span>
                </div>
              )}
              <div className="flex justify-between border-b-2 border-theme-border pb-4">
                <span className="text-theme-muted">За одну штуку</span>
                <span className="text-xl text-theme-accent">{unitPrice} ₽</span>
              </div>

              <div className="flex justify-between pt-4 items-end">
                <span className="text-xl text-theme-muted mb-1">Итого</span>
                <span className="text-4xl md:text-5xl font-display font-black text-theme-text drop-shadow-sm">
                  {total.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </div>
          )}

          <button className="anime-button w-full py-5 text-xl flex items-center justify-center gap-3 active:scale-95">
            {isIndividual ? 'Отправить на расчет менеджеру' : 'Перейти к оформлению'} <ArrowRight size={24} strokeWidth={3} />
          </button>

          <p className="mt-6 text-center font-bold text-theme-muted text-sm leading-relaxed">
            * Итоговая сумма может измениться после проверки макетов менеджером.
          </p>
        </div>
      </motion.div>
    </div>
  );
}