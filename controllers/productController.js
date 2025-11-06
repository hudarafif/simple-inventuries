import Product from "../models/Product.js";

// Get all products
export const getProducts = async (req, res) => {
    try{
        const products = await Product.find();
        res.json(products);
    } catch (err){
        res.status(500).json({message: err.massage});
    }
};

// Create a new product
export const addProducts = async (req, res) => {
    // 1. Dapatkan seluruh array dari body. JANGAN di-destructuring.
    const productsData = req.body; 

    // 2. (Opsional) Cek apakah datanya benar-benar array
    if (!Array.isArray(productsData) || productsData.length === 0) {
        return res.status(400).json({ message: "Request body must be a non-empty array." });
    }

    try {
        // 3. Gunakan Product.insertMany() untuk menyimpan semua data di array
        const savedProducts = await Product.insertMany(productsData);
        
        // 4. Kirim kembali SEMUA produk yang berhasil disimpan
        res.status(201).json(savedProducts); 
    } catch (err) {
        // 5. Kirim error jika gagal (saya juga perbaiki typo err.message)
        res.status(400).json({ message: err.message }); 
    }
};

export const updateProduct = async (req, res) => {
    const {id} = req.params;
    const {name, price, description} = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {name, price, description},
            {new: true}
        );
        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(updatedProduct);

    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

export const deleteProduct = async (req, res) => {
    const {id} = req.params;
    try {
        await Product.findByIdAndDelete(id);
        res.json({message: 'Product deleted successfully'});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};
