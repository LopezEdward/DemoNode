const express = require("express");
const router = express.Router();
const { MAX_ITEMS, test_db_conn, pool} = require("../db");

router.get("/data", async (req, res) => {
  let { from, limit } = req.query;

  console.log(from, " ", limit);

  from  = parseInt(from);
  limit = parseInt(limit);

  if (from < 0) {res.status(400).send("Need send the query 'from' with a number."); return;}
  if (!from || from < 0) from = 0;
  if (!limit || limit > MAX_ITEMS) limit = MAX_ITEMS;


  let result = await pool.query("CALL sp_lisven2(?, ?)", [from, from + limit]);

  res.status(200).json(result[0][0]);
})

router.get("/id/:id", async (req, res) => {
  if (!await test_db_conn()) {
      res.status(500).send("Internal Error! Try more later...");
      return;
  }

  const id = req.params.id;

  let result = await pool.query("CALLsp_busven($1)", [id]);

  if (result.rowCount == 0) {
      res.send("Error! The vendedor with id " + id + " doesn't exists!").status(404);
      return;
  }

  res.json(result.rows[0]).status(200);
});

router.post("/add", async (req, res) => {
  const {name, surname, celPhone, districtId} = req.body;

  if (!name || !surname || (districtId < 0 || !districtId)) {
      res.send("Error! Need the 'name', 'surname' and 'districtId'!").status(404);
      return;
  }

  if (!max_len(name, 25)) {
      res.send("Error! 'name' field is too long. Max 25 chars.");
      return;
  } else if (!max_len(surname, 25)) {
      res.send("Error! 'surname' field is too long. Max 25 chars.");
      return;
  } else if (!max_len(celPhone, 9)) {
      res.send("Error! 'surname' field is too long. Max 9 chars.");
  }

  let result = await pool.query("CALL sp_ingven2(?, ?, ?, ?)", [name, surname, celPhone, districtId]);

  if (result.rowCount == 0) {
      res.send("Error! Can't save!").send(500);
      return;
  }

  res.json(result[0]);
});

router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const {name, surname, celPhone} = req.body;

  if (!name || !surname) {
      res.send("Error! Need the 'name' and 'surname'!").status(404);
      return;
  }

  if (!max_len(name, 25)) {
      res.send("Error! 'name' field is too long. Max 25 chars.");
      return;
  } else if (!max_len(surname, 25)) {
      res.send("Error! 'surname' field is too long. Max 25 chars.");
      return;
  }
  
  let result = await pool.query("CALL sp_modven(?, ?, ?, ?)", [id, name, surname, celPhone]);

  if (result.rowCount == 0) {
      res.send("Error! Can't update!\nHint: Check the ID.").send(500);
      return;
  }

  res.send("Updated register with id " + id);
}); 

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
      let result = await pool.query("CALL sp_eliven(?)", [id]);

      console.log(result);
  } catch (e) {
      console.log("Error: " + e);
      res.status(500).send("Error! Can't delete the vendedor!");
      return;
  }

  res.json({success: true});
});

function max_len (val, max) {
  if (val.length > max) {
      return false;
  }

  return true;
}


module.exports = router;
