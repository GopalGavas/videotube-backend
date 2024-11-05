import { Router } from "express";

const router = Router();

router.route("/").get((_, res) => {
  return res.render("index.ejs");
});

export default router;
