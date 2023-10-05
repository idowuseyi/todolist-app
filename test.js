const runRestaurant = async (customerId) => {
    if (!!!customerId) throw new Error("invalid CustomerId!")
    try {
const customer = await meetCustomer(customerId);

const order = await getOrder(customer.customerId);

await notifyWaiter(order. customerId);

serveCustomer(order.customerId);
} catch (err) {
    console.log("Error: ", err.message);
}
}

runRestaurant(1).then(() => console.log("Order of customer fulfilled..."))

.catch((error) => console.log(error));