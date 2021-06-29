import { useState } from "react";
import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import * as Products from "../repositories/Products";
import * as Orders from "../repositories/Orders";

const colors = {
  red: "crimson",
  yellow: "gold",
  blue: "blue",
  green: "darkgreen",
};

export async function getStaticProps() {
  const products = await Products.getAll();

  return {
    props: {
      products,
    },
  };
}

export default function Home({ products }) {
  const router = useRouter();

  const [cart, setCart] = useState([]);

  const initialSelections = products.reduce((acc, curr) => {
    acc[curr.id] = {
      quantity: 0,
      color: {
        triangle: "red",
        square: "yellow",
        circle: "blue",
      }[curr.id],
    };

    return acc;
  }, {});

  const [selections, setSelections] = useState(initialSelections);

  const dismissPopUp = () => {
    router.push("/");
  };

  const updateSelectionColor = (id, color) => {
    setSelections((prev) => ({ ...prev, [id]: { ...prev[id], color } }));
  };

  const updateSelectionQuantity = (id, quantity) => {
    setSelections((prev) => ({
      ...prev,
      [id]: { ...prev[id], quantity },
    }));
  };

  const updateCart = (id) => {
    setCart((prev) => [
      ...prev,
      {
        ...selections[id],
        productId: id,
        uniqueProductId: `${selections[id].color}-${id}`,
      },
    ]);
    setSelections((prev) => ({
      ...prev,
      [id]: { ...prev[id], quantity: 0 },
    }));
  };

  const checkout = async () => {
    const uniqueProducts = cart.reduce((acc, curr) => {
      const uniqueProduct = acc[`${curr.color}-${curr.id}`];
      acc[curr.uniqueProductId] = {
        ...curr,
        quantity: acc[curr.uniqueProductId]
          ? acc[curr.uniqueProductId].quantity + curr.quantity
          : curr.quantity,
      };
      return acc;
    }, {});

    const items = Object.keys(uniqueProducts).map((uniqueProductId) => {
      const product = products.find(
        ({ id }) => id === uniqueProducts[uniqueProductId].productId
      );
      return {
        ...uniqueProducts[uniqueProductId],
        unit_price: product.price,
      };
    });

    const { init_point } = await Orders.create(items);

    window.location.href = init_point;

    setCart([]);
  };

  return (
    <>
      <Head>
        <title>Primary Elements Shop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script
        strategy="beforeInteractive"
        src="https://www.mercadopago.com/v2/security.js"
        view="home"
      />
      {router.query.state && (
        <div
          className={[styles["pop-up"], styles[router.query.state]].join(" ")}
        >
          <div className={styles["pop-up-actions"]}>
            <button
              type="button"
              className={styles["pop-up-button"]}
              onClick={dismissPopUp}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={
                  {
                    success: colors.green,
                    pending: colors.yellow,
                    failure: colors.red,
                  }[router.query.state]
                }
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-x"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div>
            {router.query.state === "success" ? (
              <ul>
                <li>collection_id: {router.query.collection_id}</li>
                <li>collection_status: {router.query.collection_status}</li>
                <li>payment_id: {router.query.payment_id}</li>
                <li>status: {router.query.status}</li>
                <li>external_reference: {router.query.external_reference}</li>
                <li>payment_type: {router.query.payment_type}</li>
                <li>merchant_order_id: {router.query.merchant_order_id}</li>
                <li>preference_id: {router.query.preference_id}</li>
                <li>site_id: {router.query.site_id}</li>
                <li>processing_mode: {router.query.processing_mode}</li>
                <li>merchant_account_id: {router.query.merchant_account_id}</li>
              </ul>
            ) : (
              <p>{router.query.state.toUpperCase()}</p>
            )}
          </div>
        </div>
      )}
      <header className={styles["header"]}>
        <div className={styles["logo"]}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            viewBox="0 0 90.89 90.89"
          >
            <g transform="translate(-23.82 -137.63) scale(.77019)">
              <circle
                cx="89.93"
                cy="237.7"
                r="43.44"
                fill="none"
                stroke="#000"
                strokeWidth="4"
              />
              <path
                d="M99.14 196.02v54.67"
                fill="none"
                stroke="#000"
                strokeWidth="4.05"
              />
              <path d="M75.88 208.85h12.73v12.73H75.88z" />
              <path
                d="M78.22 210.35h-8.03M87.1 219.26v8.38M98.6 249v0h-7.72"
                fill="none"
                stroke="#000"
                strokeWidth="3"
              />
              <path
                d="M95.8 249v24.05"
                fill="none"
                stroke="#000"
                strokeWidth="2.87"
              />
              <path
                d="M95.8 271.54H82.05"
                fill="none"
                stroke="#000"
                strokeWidth="3"
              />
              <path
                d="M95.52 259.9h-4.95"
                fill="none"
                stroke="#000"
                strokeWidth="6"
              />
              <path
                d="M89.2 271.9v7.62"
                fill="none"
                stroke="#000"
                strokeWidth="10"
              />
            </g>
          </svg>
          <span className={styles["shop-name"]}>Primary Elements Shop</span>
        </div>
        <div className={styles["cart"]}>
          <button
            className={styles["checkout-button"]}
            onClick={checkout}
            type="button"
            disabled={cart.length === 0}
          >
            <span>checkout</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-shopping-cart"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>{`(${cart.length})`}</span>
          </button>
        </div>
      </header>
      <div className={styles["product-list"]}>
        {products.map(({ id, name, price }) => {
          const quantity = selections[id].quantity;
          const color = selections[id].color;

          return (
            <div key={`product-${id}`} className={styles["product-list-item"]}>
              {id === "circle" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="65mm"
                  height="65mm"
                  viewBox="0 0 65 65"
                >
                  <circle
                    fill={colors[color]}
                    cx="163.33"
                    cy="115.33"
                    r="32.5"
                    transform="translate(-130.83 -82.83)"
                  />
                </svg>
              )}
              {id === "square" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="225.71"
                  height="225.71"
                  viewBox="0 0 59.72 59.72"
                >
                  <path fill={colors[color]} d="M0 0h59.72v59.72H0z" />
                </svg>
              )}
              {id === "triangle" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="67mm"
                  height="219.3"
                  viewBox="0 0 67 58.02"
                >
                  <path
                    fill={colors[color]}
                    d="M67 58.02H0l16.75-29L33.5 0l16.75 29.01z"
                  />
                </svg>
              )}
              <form>
                <p>{`$${price}`}</p>
                <label htmlFor="quantity">Quantity: </label>
                <input
                  onChange={(e) => {
                    const value = parseInt(
                      e.target.value.length ? e.target.value : "0"
                    );
                    updateSelectionQuantity(id, value < 0 ? 0 : value);
                  }}
                  id="quantity"
                  type="number"
                  placeholder="0"
                  value={quantity > 0 ? quantity : ""}
                />
                <br />
                <label htmlFor="color">Color: </label>
                <select
                  onChange={(e) => updateSelectionColor(id, e.target.value)}
                  defaultValue={color}
                  id="color"
                >
                  <option value="red">red</option>
                  <option value="yellow">yellow</option>
                  <option value="blue">blue</option>
                </select>
                <br />
                <button
                  className={styles["add-selection-button"]}
                  type="button"
                  disabled={quantity === 0}
                  onClick={() => updateCart(id)}
                >
                  Add to cart
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </>
  );
}
