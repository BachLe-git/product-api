const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// GET tất cả sản phẩm
router.get('/', async(req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi lấy danh sách sản phẩm',
            error: error.message
        });
    }
});

// GET sản phẩm theo pid
router.get('/:pid', async(req, res) => {
    try {
        const product = await Product.findOne({
            pid: req.params.pid
        });

        if (!product) {
            return res.status(404).json({
                message: 'Không tìm thấy sản phẩm'
            });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi lấy sản phẩm',
            error: error.message
        });
    }
});

// POST - thêm sản phẩm
router.post('/', async(req, res) => {
    try {
        const { pid, pname, price, quantity } = req.body;

        const existed = await Product.findOne({ pid });

        if (existed) {
            return res.status(409).json({
                message: 'pid đã tồn tại'
            });
        }

        const product = await Product.create({
            pid,
            pname,
            price,
            quantity
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({
            message: 'Lỗi thêm sản phẩm',
            error: error.message
        });
    }
});

// PUT - cập nhật sản phẩm
router.put('/:pid', async(req, res) => {
    try {
        const { pname, price, quantity } = req.body;

        const product = await Product.findOneAndUpdate({ pid: req.params.pid }, {
            pname,
            price,
            quantity
        }, {
            new: true,
            runValidators: true
        });

        if (!product) {
            return res.status(404).json({
                message: 'Không tìm thấy sản phẩm'
            });
        }

        res.json(product);
    } catch (error) {
        res.status(400).json({
            message: 'Lỗi cập nhật sản phẩm',
            error: error.message
        });
    }
});

// DELETE - xóa sản phẩm
router.delete('/:pid', async(req, res) => {
    try {
        const product = await Product.findOneAndDelete({
            pid: req.params.pid
        });

        if (!product) {
            return res.status(404).json({
                message: 'Không tìm thấy sản phẩm'
            });
        }

        res.json({
            message: 'Xóa sản phẩm thành công',
            product
        });
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi xóa sản phẩm',
            error: error.message
        });
    }
});

module.exports = router;