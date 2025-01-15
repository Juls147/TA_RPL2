export const getBestSellersFromCategories = (categories) => {
  const allProducts = categories.flatMap((category) => category.products);
  const sortedProducts = allProducts.sort((a, b) => b.sold - a.sold);
  return sortedProducts.slice(0, 5);
};

export const formatPrice = (price) => {
  const priceStr = price.toString();
  const priceArr = priceStr.split("");
  const reversedArr = priceArr.reverse();
  const formattedPriceArr = [];
  reversedArr.forEach((char, index) => {
    formattedPriceArr.push(char);
    if ((index + 1) % 3 === 0 && index !== reversedArr.length - 1) {
      formattedPriceArr.push(".");
    }
  });
  return formattedPriceArr.reverse().join("");
};

export const formatDateTime = (dateTimeString) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  const dateTime = new Date(dateTimeString);
  const formattedDate = dateTime
    .toLocaleDateString("id-ID", options)
    .replace(/\./g, ":");
  return `${formattedDate}`;
};
