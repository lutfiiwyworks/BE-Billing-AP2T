import getCekReduksiRp0Model from "./cek_reduksi_rp0.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekReduksiRp0 = async ({ thblrek, idpel, unitupi, limit }) => {
  if (!thblrek && !idpel && !unitupi) {
    throw createBadRequest(
      "Minimal isi salah satu parameter: thblrek / idpel / unitupi"
    );
  }

  const rows = await getCekReduksiRp0Model.getCekReduksiRp0({
    thblrek,
    idpel,
    unitupi,
  });

  return rows;
};

export default { getCekReduksiRp0 };
