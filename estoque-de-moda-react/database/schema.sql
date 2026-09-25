-- ============================================================
-- BANCO DE DADOS - ESTOQUE DE MODA
-- VERSÃO VAZIA PARA O CLIENTE COMEÇAR DO ZERO
-- Compatível com o backend atual do projeto React + Node/Express
-- + MySQL
--
-- O banco começa sem produtos, fornecedores, movimentações ou
-- pedidos. O cliente cadastra tudo pelo painel.
-- ============================================================

DROP DATABASE IF EXISTS estoque_moda;

CREATE DATABASE estoque_moda
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE estoque_moda;

-- ============================================================
-- USUARIOS
-- Mantém somente o usuário inicial necessário para o painel.
-- ============================================================

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(80) NOT NULL,
    sobrenome VARCHAR(80),
    email VARCHAR(150) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    cargo VARCHAR(120),
    empresa VARCHAR(120),
    foto VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO usuarios (
    nome,
    email,
    cargo,
    empresa
) VALUES (
    'Administrador',
    'admin@estoquemoda.com',
    'Administrador',
    'Minha Loja'
);

-- ============================================================
-- CONFIGURACOES
-- Configuração inicial necessária para o painel.
-- ============================================================

CREATE TABLE configuracoes (
    usuario_id INT PRIMARY KEY,

    nome_marca VARCHAR(120) NOT NULL DEFAULT 'Minha Loja',
    alerta_estoque TINYINT(1) NOT NULL DEFAULT 1,
    email_pedidos TINYINT(1) NOT NULL DEFAULT 1,
    modo_escuro TINYINT(1) NOT NULL DEFAULT 0,
    moeda VARCHAR(10) NOT NULL DEFAULT 'BRL',

    atualizado_em TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_configuracoes_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO configuracoes (usuario_id, nome_marca)
VALUES (1, 'Minha Loja');

-- ============================================================
-- FORNECEDORES
-- VAZIA: o cliente cadastra os próprios fornecedores.
-- ============================================================

CREATE TABLE fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(150) NOT NULL,
    cnpj VARCHAR(18),
    cat VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(150),
    products VARCHAR(255),

    status ENUM('Ativo', 'Inativo', 'Pendente')
        NOT NULL DEFAULT 'Ativo',

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- PRODUTOS
-- VAZIA: o cliente cadastra os próprios produtos.
-- ============================================================

CREATE TABLE produtos (
    sku VARCHAR(20) PRIMARY KEY,

    name VARCHAR(150) NOT NULL,
    cat VARCHAR(50) NOT NULL,

    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    stock INT NOT NULL DEFAULT 0,
    min_stock INT NOT NULL DEFAULT 0,

    emoji VARCHAR(10) DEFAULT '👗',
    color VARCHAR(30) DEFAULT '#EFEAE2',

    supplier VARCHAR(120),
    location VARCHAR(120),

    entry_date DATE,

    colors JSON,
    sizes JSON,

    descricao TEXT,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_produtos_cat (cat),
    INDEX idx_produtos_stock (stock),
    INDEX idx_produtos_criado_em (criado_em)
) ENGINE=InnoDB;

-- ============================================================
-- MOVIMENTACOES
-- VAZIA: será preenchida conforme o cliente movimentar estoque.
-- ============================================================

CREATE TABLE movimentacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,

    sku VARCHAR(20) NOT NULL,

    type ENUM('in', 'out') NOT NULL,

    qty INT NOT NULL,
    reason VARCHAR(150),

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_movimentacoes_produto
        FOREIGN KEY (sku)
        REFERENCES produtos(sku)
        ON DELETE CASCADE,

    INDEX idx_movimentacoes_sku (sku),
    INDEX idx_movimentacoes_criado_em (criado_em)
) ENGINE=InnoDB;

-- ============================================================
-- PEDIDOS
-- VAZIA: o cliente cria os próprios pedidos.
-- ============================================================

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,

    client_name VARCHAR(150) NOT NULL,
    client_email VARCHAR(150),
    city VARCHAR(150),

    freight DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    status ENUM(
        'Pendente',
        'Enviado',
        'Entregue',
        'Cancelado'
    ) NOT NULL DEFAULT 'Pendente',

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_pedidos_status (status),
    INDEX idx_pedidos_criado_em (criado_em)
) ENGINE=InnoDB;

-- ============================================================
-- PEDIDO_ITENS
-- VAZIA: itens são criados junto com os pedidos.
-- ============================================================

CREATE TABLE pedido_itens (
    id INT AUTO_INCREMENT PRIMARY KEY,

    pedido_id INT NOT NULL,
    sku VARCHAR(20) NOT NULL,

    variant VARCHAR(50),

    qty INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_pedido_itens_pedido
        FOREIGN KEY (pedido_id)
        REFERENCES pedidos(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_pedido_itens_produto
        FOREIGN KEY (sku)
        REFERENCES produtos(sku)
        ON DELETE RESTRICT,

    INDEX idx_pedido_itens_pedido (pedido_id),
    INDEX idx_pedido_itens_sku (sku)
) ENGINE=InnoDB;

-- ============================================================
-- VERIFICAÇÃO
-- Deve mostrar:
-- usuarios       = 1
-- configuracoes  = 1
-- fornecedores   = 0
-- produtos       = 0
-- movimentacoes  = 0
-- pedidos        = 0
-- pedido_itens   = 0
-- ============================================================

SELECT 'Banco estoque_moda criado com sucesso!' AS mensagem;

SELECT
    'usuarios' AS tabela,
    COUNT(*) AS registros
FROM usuarios
UNION ALL
SELECT 'configuracoes', COUNT(*) FROM configuracoes
UNION ALL
SELECT 'fornecedores', COUNT(*) FROM fornecedores
UNION ALL
SELECT 'produtos', COUNT(*) FROM produtos
UNION ALL
SELECT 'movimentacoes', COUNT(*) FROM movimentacoes
UNION ALL
SELECT 'pedidos', COUNT(*) FROM pedidos
UNION ALL
SELECT 'pedido_itens', COUNT(*) FROM pedido_itens;
