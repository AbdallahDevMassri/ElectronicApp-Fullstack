import axios from "axios";
import { useState, useEffect, createContext } from "react";
import type { ReactNode, FC } from "react";
import type { ProductType } from "./productTypes";

type AppContextType = {
  data: ProductType[];
  isError: string;
  cart: ProductType[];
  addToCart: (product: ProductType) => void;
  removeFromCart: (productId: number) => void;
  refreshData: () => void;
  clearCart: () => void;
};

const AppContext = createContext<AppContextType>({
  data: [],
  isError: "",
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  refreshData: () => {},
  clearCart: () => {},
});

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const [data, setData] = useState<ProductType[]>([]);
  const [isError, setIsError] = useState<string>("");
  const [cart, setCart] = useState<ProductType[]>(
    JSON.parse(localStorage.getItem("cart") || "[]")
  );

  const addToCart = (product: ProductType) => {
    const existingProductIndex = cart.findIndex(
      (item) => item.id === product.id
    );
    if (existingProductIndex !== -1) {
      const updatedCart = cart.map((item, index) =>
        index === existingProductIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
    }
  };

  const removeFromCart = (productId: number) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
  };

  const refreshData = async () => {
    try {
      const response = await axios.get("/products");
      setData(response.data);
    } catch (error: any) {
      setIsError(error.message);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <AppContext.Provider
      value={{
        data,
        isError,
        cart,
        addToCart,
        removeFromCart,
        refreshData,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
