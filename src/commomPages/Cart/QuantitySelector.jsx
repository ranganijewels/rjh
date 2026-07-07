import { MinusIcon, PlusIcon } from "@/components/Icons/common";
import { useState } from "react";

const QuantitySelector = ({ item, handleQuantities }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const increment = async () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    await handleQuantities(item.cart_item_id, newQuantity);
  };

  const decrement = async () => {
    const newQuantity = quantity - 1;

    setQuantity(newQuantity < 0 ? 0 : newQuantity);

    await handleQuantities(
      item.cart_item_id,
      newQuantity < 0 ? 0 : newQuantity
    );
  };

  return (
    <div className="w-[120px] flex justify-between items-center border rounded-[4px] border-[var(--grey-1)]">
      {/* 40px tap targets (icon stays 16px) for comfortable touch use */}
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={decrement}
        className="w-[40px] h-[40px] flex items-center justify-center text-[var(--grey-2)] hover:text-[var(--teal-1)]"
      >
        <MinusIcon />
      </button>
      <output className="min-w-[20px] text-center" aria-live="polite" aria-atomic="true">{quantity}</output>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={increment}
        className="w-[40px] h-[40px] flex items-center justify-center text-[var(--grey-2)] hover:text-[var(--teal-1)]"
      >
        <PlusIcon />
      </button>
    </div>
  );
};

export default QuantitySelector;
