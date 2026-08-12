-- ============================================
-- Banco de dados: Estoque de Moda
-- ============================================

CREATE DATABASE IF NOT EXISTS estoque_moda
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE estoque_moda;

CREATE TABLE IF NOT EXISTS produtos (
  sku          VARCHAR(20)   PRIMARY KEY,
  name         VARCHAR(150)  NOT NULL,
  cat          VARCHAR(50)   NOT NULL,
  price        DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock        INT           NOT NULL DEFAULT 0,
  min_stock    INT           NOT NULL DEFAULT 0,
  emoji        VARCHAR(10)   DEFAULT '👗',
  color        VARCHAR(30)   DEFAULT '#EFEAE2',
  supplier     VARCHAR(120),
  location     VARCHAR(120),
  entry_date   DATE,
  colors       JSON,
  sizes        JSON,
  descricao    TEXT,
  criado_em    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Os mesmos produtos que já existiam mockados na tela, agora no banco
INSERT INTO produtos (sku, name, cat, price, stock, min_stock, emoji, color, supplier, location, entry_date, colors, sizes, descricao) VALUES
('VM-0472-VN', 'Vestido Midi Alfaiataria Vinho', 'Vestidos', 349.90, 42, 10, '👗', 'var(--accent-soft)', 'Textura Confecções', 'Depósito A · Prateleira 12', '2026-07-18', '["#5C222B","#23201D","#B8863A"]', '["P","M","G","GG"]', 'Vestido midi em alfaiataria com corte reto, cinto de amarrar e forro interno.'),
('BC-0118-AR', 'Blusa Cropped Linho Areia', 'Blusas', 129.90, 8, 12, '👚', '#F5E9D3', 'Malharia Fio Nobre', 'Depósito A · Prateleira 4', '2026-07-22', '["#E8D9BE","#23201D"]', '["P","M","G"]', 'Blusa cropped em linho leve, ideal para composições de verão.'),
('CP-0299-PT', 'Calça Pantalona Alfaiataria', 'Calças', 219.00, 0, 8, '👖', '#EFEAE2', 'Denim Studio', 'Depósito B · Prateleira 9', '2026-07-05', '["#23201D","#6B6259"]', '["36","38","40","42"]', 'Calça pantalona de alfaiataria com cintura alta e caimento fluido.'),
('SM-0356-MT', 'Saia Midi Plissada Mostarda', 'Saias', 179.90, 26, 10, '🩱', '#F5E9D3', 'Textura Confecções', 'Depósito A · Prateleira 15', '2026-07-20', '["#9C6B24","#5C222B"]', '["P","M","G"]', 'Saia midi plissada em tecido leve com caimento fluido.'),
('BT-0087-CR', 'Bolsa Tote Trança Caramelo', 'Acessórios', 289.00, 15, 6, '👜', '#EFEAE2', 'Couros do Vale', 'Depósito C · Prateleira 2', '2026-07-14', '["#9C6B24","#23201D"]', '["Único"]', 'Bolsa tote em couro trançado à mão, acabamento artesanal.'),
('BO-0410-PT', 'Blazer Oversized Preto', 'Blusas', 399.00, 6, 10, '🧥', '#EFEAE2', 'Malharia Fio Nobre', 'Depósito A · Prateleira 6', '2026-07-11', '["#23201D"]', '["P","M","G","GG"]', 'Blazer oversized de alfaiataria, forro completo e ombreira estruturada.'),
('VL-0521-TR', 'Vestido Longo Seda Terracota', 'Vestidos', 459.90, 19, 8, '👗', 'var(--accent-soft)', 'Textura Confecções', 'Depósito A · Prateleira 13', '2026-07-24', '["#B8863A","#7A2E3A"]', '["P","M","G"]', 'Vestido longo em seda fluida, fenda lateral e alça fina ajustável.'),
('BR-0093-DR', 'Brinco Argola Dourado', 'Acessórios', 69.90, 54, 15, '💍', '#F5E9D3', 'Couros do Vale', 'Depósito C · Prateleira 5', '2026-07-27', '["#B8863A"]', '["Único"]', 'Brinco argola folheado a ouro 18k, fecho de pressão.');
