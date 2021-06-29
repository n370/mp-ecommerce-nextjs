export default async (req, res) => {
  if (req.method === "POST") {
    console.log(req.body);
    res.status(200).send("ok");
  } else {
    res.status(405).json(new Error("Method not allowed"));
  }
};
