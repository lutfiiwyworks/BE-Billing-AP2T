import cekPlgCKvarhModel from "./cek_plg_c_kvarh.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const cekPlgCKvarh = async ({ thblrek, idpel, unitupi, limit }) => {
  if (!thblrek && !idpel && !unitupi) {
    throw createBadRequest(
      "Minimal isi salah satu parameter: thblrek / idpel / unitupi"
    );
  }

  const rows = await cekPlgCKvarhModel.cekPlgCKvarh({
    thblrek,
    idpel,
    unitupi,
  });

  return rows;
};

export default { cekPlgCKvarh };
