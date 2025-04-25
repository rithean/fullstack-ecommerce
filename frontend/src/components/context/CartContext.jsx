import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartData));
  }, [cartData]);

  const addToCart = (product) => {
    let updatedCart = [...cartData];
    const exists = updatedCart.find((item) => item.product_id === product.id);

    if (exists) {
      exists.qty += 1;
    } else {
      updatedCart.push({
        id: `${product.id}-${Math.floor(Math.random() * 10000000)}`,
        product_id: product.id,
        name: product.name,
        price: product.price,
        qty: 1,
        image: product.image,
      });
    }

    setCartData(updatedCart);
    setShowCart(true);
  };

  const incrementQty = (cartItemId) => {
    const updated = cartData.map((item) =>
      item.id === cartItemId ? { ...item, qty: item.qty + 1 } : item
    );
    setCartData(updated);
  };

  const decrementQty = (cartItemId) => {
    const updated = cartData
      .map((item) =>
        item.id === cartItemId && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
      .filter((item) => item.qty > 0);
    setCartData(updated);
  };

  const removeFromCart = (cartItemId) => {
    const updated = cartData.filter((item) => item.id !== cartItemId);
    setCartData(updated);
  };

  const clearCart = () => {
    setCartData([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cartData,
        addToCart,
        incrementQty,
        decrementQty,
        removeFromCart,
        showCart,
        setShowCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
