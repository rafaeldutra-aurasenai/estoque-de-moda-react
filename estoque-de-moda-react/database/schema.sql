
-- ============================================================
-- ESTOQUE DE MODA
-- BANCO MULTI-LOJA / MULTIUSUÁRIO
-- ============================================================

DROP DATABASE IF EXISTS estoque_moda;

CREATE DATABASE estoque_moda
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE estoque_moda;


-- ============================================================
-- LOJAS
-- Cada cliente possui uma loja própria.
-- ============================================================

CREATE TABLE lojas (
    id INT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(120) NOT NULL,

    codigo_acesso VARCHAR(20) NOT NULL UNIQUE,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP

) ENGINE=InnoDB;


-- ============================================================
-- USUÁRIOS
-- Cada usuário pertence a uma loja.
-- ============================================================

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,

    loja_id INT NOT NULL,

    nome VARCHAR(80) NOT NULL,

    sobrenome VARCHAR(80),

    email VARCHAR(150) NOT NULL UNIQUE,

    telefone VARCHAR(20),

    cargo VARCHAR(120),

    empresa VARCHAR(120),

    foto VARCHAR(255),

    senha VARCHAR(255) NOT NULL,

    papel ENUM('dono', 'funcionario') NOT NULL DEFAULT 'funcionario',

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario_loja
        FOREIGN KEY (loja_id)
        REFERENCES lojas(id)
        ON DELETE CASCADE,

    INDEX idx_usuario_loja (loja_id)

) ENGINE=InnoDB;


-- ============================================================
-- CONFIGURAÇÕES
-- Uma configuração pertence a uma loja.
-- ============================================================

CREATE TABLE configuracoes (
    loja_id INT PRIMARY KEY,

    nome_marca VARCHAR(120) NOT NULL DEFAULT 'Minha Loja',

    alerta_estoque TINYINT(1) NOT NULL DEFAULT 1,

    email_pedidos TINYINT(1) NOT NULL DEFAULT 1,

    FOREIGN KEY (loja_id)
        REFERENCES lojas(id)
        ON DELETE CASCADE

) ENGINE=InnoDB;


-- ============================================================
-- CATEGORIAS
-- ============================================================

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,

    loja_id INT NOT NULL,

    nome VARCHAR(100) NOT NULL,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (loja_id)
        REFERENCES lojas(id)
        ON DELETE CASCADE,

    UNIQUE KEY uk_categoria_loja (loja_id, nome),

    INDEX idx_categoria_loja (loja_id)

) ENGINE=InnoDB;


-- ============================================================
-- FORNECEDORES
-- ============================================================

CREATE TABLE fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY,

    loja_id INT NOT NULL,

    nome VARCHAR(150) NOT NULL,

    contato VARCHAR(150),

    telefone VARCHAR(30),

    email VARCHAR(150),

    endereco VARCHAR(255),

    cidade VARCHAR(100),

    observacoes TEXT,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (loja_id)
        REFERENCES lojas(id)
        ON DELETE CASCADE,

    INDEX idx_fornecedor_loja (loja_id)

) ENGINE=InnoDB;


-- ============================================================
-- PRODUTOS
-- Cada produto pertence a uma loja.
-- ============================================================

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,

    loja_id INT NOT NULL,

    sku VARCHAR(50) NOT NULL,

    name VARCHAR(150) NOT NULL,

    cat VARCHAR(100),

    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    stock INT NOT NULL DEFAULT 0,

    min_stock INT NOT NULL DEFAULT 0,

    emoji VARCHAR(20) DEFAULT '👗',

    color VARCHAR(30) DEFAULT '#EFEAE2',

    supplier VARCHAR(150),

    location VARCHAR(120),

    entry_date DATE,

    colors JSON,

    sizes JSON,

    descricao TEXT,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (loja_id)
        REFERENCES lojas(id)
        ON DELETE CASCADE,

    UNIQUE KEY uk_produto_loja_sku (loja_id, sku),

    INDEX idx_produto_loja (loja_id),

    INDEX idx_produto_categoria (loja_id, cat),

    INDEX idx_produto_estoque (loja_id, stock)

) ENGINE=InnoDB;


-- ============================================================
-- MOVIMENTAÇÕES
-- Entrada e saída de produtos.
-- ============================================================

CREATE TABLE movimentacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,

    loja_id INT NOT NULL,

    produto_id INT NOT NULL,

    usuario_id INT NOT NULL,

    tipo ENUM('entrada', 'saida') NOT NULL,

    quantidade INT NOT NULL,

    observacao VARCHAR(255),

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (loja_id)
        REFERENCES lojas(id)
        ON DELETE CASCADE,

    FOREIGN KEY (produto_id)
        REFERENCES produtos(id)
        ON DELETE CASCADE,

    FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    INDEX idx_movimentacao_loja (loja_id),

    INDEX idx_movimentacao_produto (produto_id)

) ENGINE=InnoDB;


-- ============================================================
-- PEDIDOS
-- ============================================================

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,

    loja_id INT NOT NULL,

    client_name VARCHAR(150),

    client_email VARCHAR(150),

    city VARCHAR(100),

    freight DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    status ENUM(
        'pendente',
        'processando',
        'enviado',
        'entregue',
        'cancelado'
    ) NOT NULL DEFAULT 'pendente',

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (loja_id)
        REFERENCES lojas(id)
        ON DELETE CASCADE,

    INDEX idx_pedido_loja (loja_id),

    INDEX idx_pedido_status (loja_id, status)

) ENGINE=InnoDB;


-- ============================================================
-- ITENS DOS PEDIDOS
-- ============================================================

CREATE TABLE pedido_itens (
    id INT AUTO_INCREMENT PRIMARY KEY,

    pedido_id INT NOT NULL,

    produto_id INT NOT NULL,

    quantidade INT NOT NULL,

    preco_unitario DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    FOREIGN KEY (pedido_id)
        REFERENCES pedidos(id)
        ON DELETE CASCADE,

    FOREIGN KEY (produto_id)
        REFERENCES produtos(id)
        ON DELETE CASCADE,

    INDEX idx_item_pedido (pedido_id),

    INDEX idx_item_produto (produto_id)

) ENGINE=InnoDB;


-- ============================================================
-- O BANCO TERMINA VAZIO.
--
-- Não existe usuário pronto.
-- Não existe produto pronto.
-- Não existe fornecedor pronto.
-- Não existe pedido pronto.
--
-- A primeira pessoa que se cadastrar como DONO
-- criará a primeira loja.
-- ============================================================
