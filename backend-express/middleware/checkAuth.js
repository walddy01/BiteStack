const { supabase } = require("../lib/supabase.js");

async function checkAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }
  const token = header.split(" ")[1];
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return res.status(401).json({ error: "Token inválido" });
  }
  req.user = data.user; // { id, email, user_metadata… }
  next();
}

module.exports = checkAuth;
