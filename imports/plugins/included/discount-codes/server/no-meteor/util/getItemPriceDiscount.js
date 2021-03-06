import ReactionError from "@reactioncommerce/reaction-error";

/**
 * @name discounts/codes/sale
 * @method
 * @memberof Discounts/Codes/Methods
 * @summary calculates a new price for an item
 * @param  {String} cartId cartId
 * @param  {String} discountId discountId
 * @param {Object} collections Map of MongoDB collections
 * @return {Number} returns discount total
 */
export default async function getItemPriceDiscount(cartId, discountId, collections) {
  const { Cart, Discounts } = collections;

  const discountMethod = await Discounts.findOne({ _id: discountId });
  if (!discountMethod) throw new ReactionError("not-found", "Discount not found");

  const cart = await Cart.findOne({ _id: cartId });
  if (!cart) throw new ReactionError("not-found", "Cart not found");

  // TODO add item specific conditions to sale calculations.
  let discount = 0;
  for (const item of cart.items) {
    const preDiscountItemTotal = item.quantity * item.priceWhenAdded.amount;
    const salePriceItemTotal = item.quantity * discountMethod.discount;
    // we if the sale is below 0, we won't discount at all. that's invalid.
    discount += Math.max(0, preDiscountItemTotal - salePriceItemTotal);
  }

  return discount;
}
