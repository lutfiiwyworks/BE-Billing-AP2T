import cekPpnViewModel from "./cek_ppn_view.model.js";

const VALID_KEYS = new Set(["sewatrafo", "bptrafo", "sewakap"]);

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekPpnView = async ({ key, thblrek, unitupi, idpel, limit }) => {
  if (!VALID_KEYS.has(key)) {
    throw createBadRequest("Jenis cek PPN tidak dikenali");
  }

  const finalThblrek = String(thblrek || "").trim();

  if (!finalThblrek) {
    throw createBadRequest("Parameter thblrek wajib diisi");
  }

  if (!/^\d{6}$/.test(finalThblrek)) {
    throw createBadRequest("Parameter thblrek harus format YYYYMM, contoh: 202606");
  }

  return cekPpnViewModel.getCekPpnView({
    key,
    thblrek: finalThblrek,
    unitupi,
    idpel,
  });
};

export default { getCekPpnView };
