import getCekStimulusModel from "./cek_selisih_stimulus.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekStimulus = async ({ thblrek, idpel, unitupi, limit }) => {
  if (!thblrek && !idpel && !unitupi) {
    throw createBadRequest(
      "Minimal isi salah satu parameter: thblrek / idpel / unitupi"
    );
  }

  const rows = await getCekStimulusModel.getCekStimulus({
    thblrek,
    idpel,
    unitupi,
  });

  return rows;
};

export default { getCekStimulus };
