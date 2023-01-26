const router = require("express").Router();

const Product = require("../models/Products");

const User = require("../models/User");

//get products

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

//create product
router.post("/", async (req, res) => {
  try {
    const { name, description, price, category, images: pictures } = req.body;
    const product = await Product.create({
      name,
      description,
      price,
      category,
      pictures,
    });

    const products = await Product.find();
    res.status(201).json(products);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

//update Prouct

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { name, description, price, category, images: pictures } = req.body;
    const products = await Product.findByIdAndUpdate(id, {
      name,
      description,
      price,
      category,
      pictures,
    });
    res.status(200).json(products);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

//delete Product

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  try {
    const user = await User.findById(user_id);
    if (!user.isAdmin) return res.status(401).json("You Dont have Permission");
    await Product.findByIdAndDelete(id);
    const products = await Product.find();
    res.status(200).json(products);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

//get single product by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    const similar = await Product.find({ category: product.category }).limit(5);
    res.status(200).json({ product, similar });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//get by category
router.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  console.log(category);
  try {
    let products;
    if (category == "all") {
      products = await Product.find().sort([["date", -1]]);
      console.log(" all", products);
    } else {
      products = await Product.find({ category });
      console.log("products", products);
    }
    res.status(200).json(products);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//cart Routes

router.post("/add-to-cart", async (req, res) => {
  const { userId, productId, price } = req.body;
  try {
    const user = await User.findById(userId);
    const userCart = user.cart;
    if (user.cart[productId]) {
      userCart[productId] += 1;
    } else {
      userCart[productId] = 1;
    }
    userCart.count += 1;
    userCart.total = Number(userCart.total) + Number(price);
    user.cart = userCart;
    user.markModified("cart");
    res.status(200).json(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//Increase Cart
router.post("/increase-cart", async (req, res) => {
  const { userId, productId, price } = req.body;
  try {
    const user = await User.findById(userId);
    const userCart = user.cart;
    userCart.total += Number(price);
    userCart.count += 1;
    user.cart[productId] += 1;

    user.cart = userCart;
    user.markModified("cart");
    res.status(200).json(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//Decrease Cart
router.post("/decrease-cart", async (req, res) => {
  const { userId, productId, price } = req.body;
  try {
    const user = await User.findById(userId);
    const userCart = user.cart;
    userCart.total -= Number(price);
    userCart.count -= 1;
    user.cart[productId] -= 1;

    user.cart = userCart;
    user.markModified("cart");
    res.status(200).json(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//Remove From Cart
router.post("/remove-from-cart", async (req, res) => {
  const { userId, productId, price } = req.body;
  try {
    const user = await User.findById(userId);
    const userCart = user.cart;
    userCart.total -= Number(userCart[productId] * Number(price));
    userCart.count -= userCart[productId];
    delete userCart[productId];

    user.cart = userCart;
    user.markModified("cart");
    res.status(200).json(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
