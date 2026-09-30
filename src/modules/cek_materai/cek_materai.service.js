import cekMateraiModel, { MATERAI_RULES } from "./cek_materai.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekMaterai = async ({ thblrek, idpel, unitupi, rule, limit }) => {
  const finalRule = String(rule || "").trim().toUpperCase();

  if (!finalRule) {
    throw createBadRequest(
      `Parameter rule wajib diisi. Gunakan: ${Object.keys(MATERAI_RULES).join(", ")}`
    );
  }

  if (!MATERAI_RULES[finalRule]) {
    throw createBadRequest(
      `Parameter rule tidak valid. Gunakan: ${Object.keys(MATERAI_RULES).join(", ")}`
    );
  }

  return cekMateraiModel.getCekMaterai({
    thblrek,
    idpel,
    unitupi,
    rule: finalRule,
  });
};

export default { getCekMaterai };
