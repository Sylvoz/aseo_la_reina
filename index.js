import express from "express";
import aseo_la_reina from "./aseo_la_reina.js";

const app = express();

app.use(express.json());
app.disable("x-powered-by");

// Route
app.get ("/extractor", async (req, res) => {
      const data = req.query.id;
      const rol = data.substring(0, data.indexOf("-"));
      const dv = data.substring(data.indexOf("-") + 1, data.length);        
      if (rol == "" || dv == "") {
        return res.status(400).send({ id: "Error en rol" });
      }
      const total = await aseo_la_reina(rol, dv);
      const { invoice_amount } = total.data;
      if (invoice_amount == "Error al cargar página") {
        res.status(500).json(total);
      } else {
        res.status(200).json(total);
      }
  }
);





// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server hosted on:${PORT}`);
});
