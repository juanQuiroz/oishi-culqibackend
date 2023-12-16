const express = require("express");

const request = require("request");

const app = express();

//  "https://www.oishi.pe",

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use(express.json());

app.get("*/createcharge", (req, res) => {
  res.json({
    message: "it works fine !",
  });
});

// =================== CREAR CARGO y CAPTURAR =====================
app.post("*/createcharge", async (req, res) => {
  const options = {
    method: "POST",
    url: "https://api.culqi.com/v2/charges",
    headers: {
      Authorization: "Bearer sk_live_d95b86b4a9b8bd30",
      "content-type": "application/json",
    },
    body: req.body,
    json: true,
  };

  await request(options, async function (error, response, body) {
    if (error) throw new Error(error);
    // res.status(200).send(response);

    const options1 = {
      method: "POST",
      url: `https://api.culqi.com/v2/charges/${body.id}/capture`,
      headers: { Authorization: "Bearer sk_live_d95b86b4a9b8bd30" },
    };

    await request(options1, function (error1, resp, body1) {
      if (error1) throw new Error(error1);
      res.status(200).json({ response, resp });

      console.log("capture =>", body1);
    });

    console.log("Charge =>", body);
  });
});

// =================== CREAR SOLO CARGO  =====================
app.post("*/createonlycharge", async (req, res) => {
  const options = {
    method: "POST",
    url: "https://api.culqi.com/v2/charges",
    headers: {
      Authorization: "Bearer sk_live_d95b86b4a9b8bd30",
      "content-type": "application/json",
    },
    body: req.body,
    json: true,
  };

  await request(options, async function (error, response, body) {
    if (error) throw new Error(error);
    // res.status(200).send(response);

    res.status(200).json({ response });
    console.log("Charge =>", body);
  });
});

// =================== CREAR SOLO CARGO  TEST =====================
app.post("*/createonlychargeTest", async (req, res) => {
  const options = {
    method: "POST",
    url: "https://api.culqi.com/v2/charges",
    headers: {
      Authorization:
        req.body.localId === 1
          ? "Bearer sk_test_bef6111abb321579"
          : req.body.localId === 2
          ? "Bearer sk_test_7a9a824409744b49"
          : "Bearer sk_test_075992eb6c1d1fb1",
      "content-type": "application/json",
    },
    body: req.body,
    json: true,
  };

  await request(options, async function (error, response, body) {
    if (error) throw new Error(error);
    // res.status(200).send(response);

    res.status(200).json({ response });
    console.log("Charge =>", body);
  });
});

//configure port
app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"));
console.log("server listen on port", app.get("port"));
