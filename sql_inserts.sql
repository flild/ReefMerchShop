-- 1. Pricing Tiers
-- Keychains
INSERT OR REPLACE INTO pricing_tiers (id, product_type, max_dimension_mm, material_name, price, updated_at) VALUES
('t_kc_30_tr', 'keychain', 30, 'Прозрачный 3 мм', 45, strftime('%s','now') * 1000),
('t_kc_30_pe', 'keychain', 30, 'Жемчужный 3 мм', 95, strftime('%s','now') * 1000),
('t_kc_30_co', 'keychain', 30, 'Цветной 3 мм', 76, strftime('%s','now') * 1000),
('t_kc_60_tr', 'keychain', 60, 'Прозрачный 3 мм', 72, strftime('%s','now') * 1000),
('t_kc_60_pe', 'keychain', 60, 'Жемчужный 3 мм', 142, strftime('%s','now') * 1000),
('t_kc_60_co', 'keychain', 60, 'Цветной 3 мм', 121, strftime('%s','now') * 1000),
('t_kc_80_tr', 'keychain', 80, 'Прозрачный 3 мм', 86, strftime('%s','now') * 1000),
('t_kc_80_pe', 'keychain', 80, 'Жемчужный 3 мм', 218, strftime('%s','now') * 1000),
('t_kc_80_co', 'keychain', 80, 'Цветной 3 мм', 185, strftime('%s','now') * 1000);

-- Stands
INSERT OR REPLACE INTO pricing_tiers (id, product_type, max_dimension_mm, material_name, price, updated_at) VALUES
('t_st_40_tr3', 'stand', 40, 'Прозрачный 3 мм', 85, strftime('%s','now') * 1000),
('t_st_40_pe3', 'stand', 40, 'Жемчужный 3 мм', 123, strftime('%s','now') * 1000),
('t_st_40_co3', 'stand', 40, 'Цветной 3 мм', 114, strftime('%s','now') * 1000),
('t_st_40_tr8', 'stand', 40, 'Прозрачный 8 мм', 171, strftime('%s','now') * 1000),
('t_st_40_pe8', 'stand', 40, 'Жемчужный 8 мм', 209, strftime('%s','now') * 1000),
('t_st_60_tr3', 'stand', 60, 'Прозрачный 3 мм', 109, strftime('%s','now') * 1000),
('t_st_60_pe3', 'stand', 60, 'Жемчужный 3 мм', 161, strftime('%s','now') * 1000),
('t_st_60_co3', 'stand', 60, 'Цветной 3 мм', 147, strftime('%s','now') * 1000),
('t_st_60_tr8', 'stand', 60, 'Прозрачный 8 мм', 218, strftime('%s','now') * 1000),
('t_st_60_pe8', 'stand', 60, 'Жемчужный 8 мм', 305, strftime('%s','now') * 1000),
('t_st_80_tr3', 'stand', 80, 'Прозрачный 3 мм', 142, strftime('%s','now') * 1000),
('t_st_80_pe3', 'stand', 80, 'Жемчужный 3 мм', 389, strftime('%s','now') * 1000),
('t_st_80_co3', 'stand', 80, 'Цветной 3 мм', 275, strftime('%s','now') * 1000),
('t_st_80_tr8', 'stand', 80, 'Прозрачный 8 мм', 304, strftime('%s','now') * 1000),
('t_st_80_pe8', 'stand', 80, 'Жемчужный 8 мм', 478, strftime('%s','now') * 1000),
('t_st_100_tr3', 'stand', 100, 'Прозрачный 3 мм', 147, strftime('%s','now') * 1000),
('t_st_100_pe3', 'stand', 100, 'Жемчужный 3 мм', 408, strftime('%s','now') * 1000),
('t_st_100_co3', 'stand', 100, 'Цветной 3 мм', 294, strftime('%s','now') * 1000),
('t_st_100_tr8', 'stand', 100, 'Прозрачный 8 мм', 465, strftime('%s','now') * 1000),
('t_st_100_pe8', 'stand', 100, 'Жемчужный 8 мм', 769, strftime('%s','now') * 1000),
('t_st_150_tr3', 'stand', 150, 'Прозрачный 3 мм', 351, strftime('%s','now') * 1000),
('t_st_150_pe3', 'stand', 150, 'Жемчужный 3 мм', 779, strftime('%s','now') * 1000),
('t_st_150_co3', 'stand', 150, 'Цветной 3 мм', 427, strftime('%s','now') * 1000),
('t_st_150_tr8', 'stand', 150, 'Прозрачный 8 мм', 722, strftime('%s','now') * 1000),
('t_st_150_pe8', 'stand', 150, 'Жемчужный 8 мм', 1345, strftime('%s','now') * 1000),
('t_st_200_tr3', 'stand', 200, 'Прозрачный 3 мм', 674, strftime('%s','now') * 1000),
('t_st_200_pe3', 'stand', 200, 'Жемчужный 3 мм', 1377, strftime('%s','now') * 1000),
('t_st_200_co3', 'stand', 200, 'Цветной 3 мм', 750, strftime('%s','now') * 1000),
('t_st_200_tr8', 'stand', 200, 'Прозрачный 8 мм', 1586, strftime('%s','now') * 1000),
('t_st_200_pe8', 'stand', 200, 'Жемчужный 8 мм', 2768, strftime('%s','now') * 1000);

-- 2. Special Products
INSERT OR REPLACE INTO pricing_special_products (id, code, name, min_wholesale_qty, piece_price, wholesale_price) VALUES
('sp_icecream', 'icecream_keychain', 'Брелок-мороженка', 5, 300, 90),
('sp_nfc', 'nfc_card', 'NFC-карточка', 10, 350, 200);

-- 3. Small Batch Rules
INSERT OR REPLACE INTO pricing_small_batch_rules (id, product_type, max_dimension_mm, price) VALUES
('sb_kc_100', 'keychain', 100, 600),
('sb_st_100', 'stand', 100, 800),
('sb_st_200', 'stand', 200, 1500);

-- 4. Modifiers
INSERT OR REPLACE INTO pricing_modifiers (id, code, name, price) VALUES
('mod_kc_2side', 'print_double_sided_keychain', 'Двусторонняя печать (Брелок)', 40),
('mod_st_2side', 'print_double_sided_stand', 'Двусторонняя печать (Стенд)', 70);

-- 5. Accessories (Updates / Inserts)
INSERT OR REPLACE INTO accessories (id, name, price, stock, min_stock) VALUES
('acc_u_carab', 'U-карабин', 30, 1000, 50),
('acc_heart', 'Сердце', 38, 1000, 50),
('acc_star', 'Звезда', 38, 1000, 50),
('acc_thread', 'Нить', 15, 1000, 50),
('acc_ring', 'Кольца', 2, 1000, 50);
