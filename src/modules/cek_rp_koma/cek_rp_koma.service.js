import getCekKomaModel from "./cek_rp_koma.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekKoma = async ({ thblrek, idpel, limit }) => {
  if (!thblrek && !idpel) {
    throw createBadRequest(
      "Minimal isi salah satu parameter: thblrek / idpel"
    );
  }

  const rows = await getCekKomaModel.getCekKoma({
    thblrek,
    idpel,
  });

  return rows;
};

export default { getCekKoma };
