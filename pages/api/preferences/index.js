const mp = require("mercadopago");

mp.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
  integrator_id: process.env.MP_INTEGRATOR_ID,
});

const uniqueProductTitles = {
  "red-triangle": "Red Triangle",
  "blue-triangle": "Blue Triangle",
  "yellow-triangle": "Yellow Triangle",
  "red-square": "Red Square",
  "blue-square": "Blue Square",
  "yellow-square": "Yellow Square",
  "red-circle": "Red Circle",
  "blue-circle": "Blue Circle",
  "yellow-circle": "Yellow Circle",
};

export default async (req, res) => {
  if (req.method === "POST") {
    const items = req.body.items.map(
      ({ uniqueProductId, unit_price, quantity }) => ({
        title: uniqueProductTitles[uniqueProductId],
        description: `Original ${uniqueProductTitles[uniqueProductId]}`,
        unit_price,
        quantity,
        id: uniqueProductId,
      })
    );
    const preference = await mp.preferences.create({
      external_reference: process.env.MP_EXTERNAL_REFERENCE,
      items,
      notification_url: `${req.body.base_url}/api/notification`,
      back_urls: {
        success: `${req.body.base_url}/?state=success`,
        pending: `${req.body.base_url}/?state=pending`,
        failure: `${req.body.base_url}/?state=failure`,
      },
      auto_return: "approved",
      payment_methods: {
        excluded_payment_methods: [{ id: "amex" }],
        excluded_payment_types: [{ id: "atm" }],
        installments: 6,
      },
      payer: {
        name: "Lalo",
        surname: "Landa",
        email: "test_user_63274575@testuser.com",
        phone: {
          area_code: "11",
          number: 22223333,
        },
        address: {
          zip_code: "1111",
          street_name: "Falsa",
          street_number: 123,
        },
      },
    });
    res.status(200).json(preference);
  } else {
    res.status(405).json(new Error("Method not allowed"));
  }
};
