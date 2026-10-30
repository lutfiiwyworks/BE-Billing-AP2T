import getCekSelisihRpTagModel from "./cek_selisih_rptag.models.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekSelisihRpTag = async ({ thblrek, idpel, unitupi, limit }) => {
  if (!thblrek && !idpel && !unitupi) {
    throw createBadRequest(
      "Minimal isi salah satu parameter: thblrek / idpel / unitupi"
    );
  }

  const rows = await getCekSelisihRpTagModel.getCekSelisihRpTag({
    thblrek,
    idpel,
    unitupi,
  });

  return rows;
};

export default { getCekSelisihRpTag };
