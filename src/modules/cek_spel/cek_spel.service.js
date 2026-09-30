import cekPlgSpelModel from "./cek_spel.model.js"

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCurrentThblrek = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;

  return `${year}${month}`;
};

const getCekPlgSpel = async ({ thblrek, excludeRptl53950 }) => {
  const finalThblrek = String(thblrek || getCurrentThblrek()).trim();

  if (!/^\d{6}$/.test(finalThblrek)) {
    throw createBadRequest("Parameter thblrek harus format YYYYMM, contoh: 202605");
  }

  return cekPlgSpelModel.getCekPlgSpel({
    thblrek: finalThblrek,
    excludeRptl53950,
  });
};

export default { getCekPlgSpel };
