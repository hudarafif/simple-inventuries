import express from 'express';
import {getProducts, addProducts, updateProduct, deleteProduct} from '../controllers/productController.js';

const router = express.Router();
router.get('/', getProducts);
router.post('/', addProducts);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
