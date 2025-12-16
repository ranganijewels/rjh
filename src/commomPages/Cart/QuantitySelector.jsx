import { MinusIcon, PlusIcon } from "@/components/Icons/common";
import Button from "@/components/ui/Button/Button";
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
    <div className="p-[12px_8px] flex gap-[13px] justify-between items-center border rounded-[4px] border-[var(--grey-1)]">
      <Button
        icon={<MinusIcon />}
        iconOnly
        className="w-[16px] h-[16px] !p-0"
        noBackground
        onClick={decrement}
      />
      <label>{quantity}</label>
      <Button
        icon={<PlusIcon />}
        iconOnly
        className="w-[16px] h-[16px] !p-0"
        noBackground
        onClick={increment}
      />
    </div>
  );
};

export default QuantitySelector;
