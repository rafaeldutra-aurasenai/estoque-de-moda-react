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


USE estoque_moda;

CREATE TABLE IF NOT EXISTS fornecedores (
  id           INT           AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(150)  NOT NULL,
  cat          VARCHAR(50)   NOT NULL,
  contact      VARCHAR(150),
  products     VARCHAR(255),
  status       ENUM('Ativo','Inativo','Pendente') NOT NULL DEFAULT 'Ativo',
  criado_em    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Usando os mesmos fornecedores já citados na tabela produtos
INSERT INTO fornecedores (name, cat, contact, products, status) VALUES
('Textura Confecções', 'Vestidos', 'contato@texturaconfeccoes.com.br · (11) 4002-8922', 'Vestidos, Saias', 'Ativo'),
('Malharia Fio Nobre', 'Blusas', 'vendas@fionobre.com.br · (11) 3555-7810', 'Blusas, Blazers', 'Ativo'),
('Denim Studio', 'Calças', 'comercial@denimstudio.com.br · (11) 2871-4420', 'Calças', 'Pendente'),
('Couros do Vale', 'Acessórios', 'atendimento@courosdovale.com.br · (11) 3990-1122', 'Bolsas, Brincos', 'Ativo');



USE estoque_moda;

DROP TABLE IF EXISTS fornecedores;

CREATE TABLE fornecedores (
  id           INT           AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(150)  NOT NULL,
  cnpj         VARCHAR(18),
  cat          VARCHAR(50)   NOT NULL,
  phone        VARCHAR(20),
  email        VARCHAR(150),
  products     VARCHAR(255),
  status       ENUM('Ativo','Inativo','Pendente') NOT NULL DEFAULT 'Ativo',
  criado_em    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO fornecedores (name, cnpj, cat, phone, email, products, status) VALUES
('Textura Confecções', '12.345.678/0001-90', 'Vestidos', '(11) 4002-8922', 'contato@texturaconfeccoes.com.br', 'Vestidos, Saias', 'Ativo'),
('Malharia Fio Nobre', '23.456.789/0001-01', 'Blusas', '(11) 3555-7810', 'vendas@fionobre.com.br', 'Blusas, Blazers', 'Ativo'),
('Denim Studio', '34.567.890/0001-12', 'Calças', '(11) 2871-4420', 'comercial@denimstudio.com.br', 'Calças', 'Pendente'),
('Couros do Vale', '45.678.901/0001-23', 'Acessórios', '(11) 3990-1122', 'atendimento@courosdovale.com.br', 'Bolsas, Brincos', 'Ativo');


USE estoque_moda;

-- ============================================
-- Tabela: movimentacoes
-- ============================================
CREATE TABLE IF NOT EXISTS movimentacoes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  sku         VARCHAR(20) NOT NULL,
  type        ENUM('in','out') NOT NULL,
  qty         INT NOT NULL,
  reason      VARCHAR(150),
  criado_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sku) REFERENCES produtos(sku)
);

INSERT INTO movimentacoes (sku, type, qty, reason) VALUES
('VM-0472-VN', 'in', 30, 'Compra de fornecedor'),
('CP-0299-PT', 'out', 4, 'Venda'),
('BR-0093-DR', 'in', 50, 'Compra de fornecedor'),
('BO-0410-PT', 'out', 2, 'Venda');

-- ============================================
-- Tabelas: pedidos e pedido_itens
-- ============================================
CREATE TABLE IF NOT EXISTS pedidos (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  client_name   VARCHAR(150) NOT NULL,
  client_email  VARCHAR(150),
  city          VARCHAR(150),
  freight       DECIMAL(10,2) NOT NULL DEFAULT 0,
  status        ENUM('Pendente','Enviado','Entregue','Cancelado') NOT NULL DEFAULT 'Pendente',
  criado_em     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pedido_itens (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id   INT NOT NULL,
  sku         VARCHAR(20) NOT NULL,
  variant     VARCHAR(50),
  qty         INT NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (sku) REFERENCES produtos(sku)
);

INSERT INTO pedidos (client_name, client_email, city, freight, status) VALUES
('Beatriz Nogueira', 'bia.nog@email.com', 'São Paulo, SP', 24.90, 'Pendente'),
('Carla Mendes', 'carla.mendes@email.com', 'Curitiba, PR', 19.90, 'Entregue'),
('Renata Silva', 'renata.silva@email.com', 'Belo Horizonte, MG', 22.00, 'Enviado'),
('Juliana Prado', 'ju.prado@email.com', 'Porto Alegre, RS', 21.50, 'Cancelado');

INSERT INTO pedido_itens (pedido_id, sku, variant, qty, price) VALUES
(1, 'VM-0472-VN', 'M · Vinho', 2, 349.90),
(1, 'BT-0087-CR', 'Único · Caramelo', 1, 289.00),
(2, 'VM-0472-VN', 'G · Vinho', 1, 349.90),
(3, 'SM-0356-MT', 'M · Mostarda', 2, 179.90),
(3, 'BR-0093-DR', 'Único · Dourado', 1, 69.90),
(4, 'CP-0299-PT', '40 · Preto', 1, 219.00);