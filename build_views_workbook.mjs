import fs from "node:fs/promises";
import path from "node:path";
import ExcelJS from "exceljs";

const root = process.cwd();
const modulesRoot = path.join(root, "src", "modules");
const outputDir = path.join(root, "outputs");
const outputPath = path.join(outputDir, "daftar-view-model-billing.xlsx");

const endpointByModule = {
  cek_anomali_jn_lwbp: "/api/cek-anomali-jn-lwbp",
  cek_anomali_kelebihan_kvarh: "/api/cek-anomali-kelebihan-kvarh",
  cek_anomali_koreksi: "/api/cek-anomali-koreksi-billing",
  cek_anomali_pemkwh: "/api/cek-anomali-pemkwh",
  cek_anomali_stan: "/api/cek-anomali-stan",
  cek_dibawah40jn: "/api/cek-dibawah40jn",
  cek_emulsion: "/api/cek-emulsion",
  cek_lebih_stimulus: "/api/cek-reduksi-stimulus",
  cek_lp_kurangdari: "/api/cek-lp-kurangdari",
  cek_lp_lebihdari: "/api/cek-lp-lebihdari",
  cek_materai: "/api/cek-materai",
  cek_pb_pks: "/api/cek-pb-pks",
  cek_pecah_tdl: "/api/cek-pecah-tdl",
  cek_pemkwh0: "/api/cek-pemkwh0",
  cek_pemkwhtgl_non_abonemen: "(tidak di-mount di app.js)",
  cek_pks_trflwbp_2000: "/api/cek-pks-trflwbp-2000",
  cek_plg_bts: "/api/cek-plg-bts",
  cek_plg_bts_mut: "/api/cek-plg-bts-mut",
  cek_plg_c_kvarh: "/api/cek-plgc-kvarh",
  cek_ppj: "/api/cek-ppj",
  cek_ppn_view: "/api/cek-ppn/*",
  cek_reduksi_rp0: "/api/cek-reduksi-rp0",
  cek_rpbeban: "/api/cek-rpbeban",
  cek_rppn_lebih0: "/api/cek-rppn-lebih0",
  cek_rppn_r3: "/api/cek-rppn-r3",
  cek_rptag_0: "/api/cek-rptag-0",
  cek_rp_koma: "/api/cek-rp-koma",
  cek_saldo_pasca: "/api/cek-saldo-pasca",
  cek_saldo_stimulus: "/api/cek-saldo-stimulus",
  cek_selisih_stimulus: "/api/cek-stimulus",
  cek_selisih_unsur_ptl: "/api/cek-selisih-unsur-ptl",
  cek_spel: "/api/cek-spel",
  cek_stanmundur: "/api/cek-stanmundur",
  cek_stanmundur_a: "/api/cek-stan-nomut",
  detil_anomali_haribaca_ap2t: "/api/detil-anomali-haribaca-ap2t",
  trans101: "/apis/trans101",
  users: "/apis/users/login",
  vwbilling_720jn: "/api/vwbilling-720jn",
};

const readModelEntries = async () => {
  const moduleDirs = await fs.readdir(modulesRoot, { withFileTypes: true });
  const rows = [];
  for (const dir of moduleDirs.filter((entry) => entry.isDirectory())) {
    const files = await fs.readdir(path.join(modulesRoot, dir.name));
    const modelFile = files.find((file) => /^.+\.models?\.js$/.test(file));
    if (!modelFile) continue;
    const filePath = path.join(modulesRoot, dir.name, modelFile);
    const sql = await fs.readFile(filePath, "utf8");
    const sourceRegex = /\b(dtks|kunabakti|bill52|secman)\.([a-z0-9_]+)/gi;
    const sources = new Set();
    for (const match of sql.matchAll(sourceRegex)) {
      const schema = match[1].toLowerCase();
      const objectName = match[2].toLowerCase();
      if (!["all_tab_columns", "columns"].includes(objectName)) {
        sources.add(`${schema}.${objectName}`);
      }
    }
    for (const source of sources) {
      const [schema, objectName] = source.split(".");
      const isViewNamed = objectName.startsWith("vw") || objectName.includes("view");
      rows.push({
        module: dir.name,
        modelFile,
        endpoint: endpointByModule[dir.name] ?? "(belum dipetakan)",
        database: schema === "kunabakti" ? "PostgreSQL" : schema === "bill52" || schema === "dtks" || schema === "secman" ? "Oracle" : schema,
        schema,
        objectName,
        sourceObject: source,
        namedAsView: isViewNamed ? "Ya" : "Tidak / object lain",
        note: dir.name === "cek_anomali_koreksi" || dir.name === "cek_pecah_tdl" ? "Oracle only" : "Dipakai oleh query model",
      });
    }
  }
  return rows.sort((a, b) => a.sourceObject.localeCompare(b.sourceObject) || a.module.localeCompare(b.module));
};

const styleSheet = (sheet, widths) => {
  sheet.views = [{ state: "frozen", ySplit: 4 }];
  sheet.showGridLines = false;
  sheet.getRow(1).height = 28;
  sheet.getRow(2).height = 20;
  sheet.getRow(4).height = 32;
  sheet.getRow(1).font = { name: "Aptos Display", size: 16, bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF17365D" } };
  sheet.getRow(2).font = { name: "Aptos", size: 10, italic: true, color: { argb: "FF44546A" } };
  sheet.getRow(4).font = { name: "Aptos", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getRow(4).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };
  sheet.getRow(4).alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  sheet.autoFilter = { from: "A4", to: `${String.fromCharCode(64 + widths.length)}4` };
  widths.forEach((width, index) => { sheet.getColumn(index + 1).width = width; });
  for (let row = 5; row <= sheet.rowCount; row += 1) {
    sheet.getRow(row).alignment = { vertical: "top", wrapText: true };
    if (row % 2 === 0) sheet.getRow(row).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3F6FA" } };
  }
};

const rows = await readModelEntries();
await fs.mkdir(outputDir, { recursive: true });

const workbook = new ExcelJS.Workbook();
workbook.creator = "Billing Backend";
workbook.created = new Date();

const summary = workbook.addWorksheet("Ringkasan");
summary.views = [{ showGridLines: false }];
summary.mergeCells("A1:F1");
summary.getCell("A1").value = "Inventaris View / Source Object pada Model Billing";
summary.getCell("A1").font = { name: "Aptos Display", size: 16, bold: true, color: { argb: "FFFFFFFF" } };
summary.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF17365D" } };
summary.getRow(1).height = 30;
summary.mergeCells("A2:F2");
summary.getCell("A2").value = "Dibuat dari source SQL pada file model di src/modules. Nama object ditulis sesuai yang ditemukan di code.";
summary.getCell("A2").font = { italic: true, color: { argb: "FF44546A" } };
summary.addRows([
  ["Metrik", "Nilai"],
  ["Jumlah baris pemakaian source", rows.length],
  ["Jumlah source object unik", new Set(rows.map((row) => row.sourceObject)).size],
  ["Jumlah module model", new Set(rows.map((row) => row.module)).size],
]);
summary.getRow(4).font = { bold: true, color: { argb: "FFFFFFFF" } };
summary.getRow(4).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };
summary.getColumn(1).width = 34;
summary.getColumn(2).width = 18;
summary.mergeCells("A10:F10");
summary.getCell("A10").font = { bold: true, color: { argb: "FFFFFFFF" } };
summary.getCell("A10").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF70AD47" } };
summary.mergeCells("A11:F12");
summary.getCell("A11").value = "Sheet Daftar Source berisi seluruh object yang direferensikan dari model, termasuk object yang namanya tidak diawali VW karena code mengaksesnya langsung sebagai source query. Sheet Endpoint-Model membantu tracing route ke model.";
summary.getCell("A11").alignment = { wrapText: true, vertical: "top" };
summary.getColumn(3).width = 14; summary.getColumn(4).width = 14; summary.getColumn(5).width = 14; summary.getColumn(6).width = 14;

const sourceSheet = workbook.addWorksheet("Daftar Source");
sourceSheet.mergeCells("A1:I1");
sourceSheet.getCell("A1").value = "Daftar View / Source Object yang Dipakai Model";
sourceSheet.mergeCells("A2:I2");
sourceSheet.getCell("A2").value = "Satu baris = satu kombinasi module model dan source database.";
sourceSheet.getRow(4).values = ["Module", "File Model", "Endpoint", "Database", "Schema", "Object", "Source Lengkap", "Nama VW?", "Catatan"];
rows.forEach((row) => sourceSheet.addRow([row.module, row.modelFile, row.endpoint, row.database, row.schema, row.objectName, row.sourceObject, row.namedAsView, row.note]));
styleSheet(sourceSheet, [28, 34, 38, 14, 14, 34, 34, 18, 24]);
sourceSheet.autoFilter = { from: "A4", to: "I4" };

const endpointSheet = workbook.addWorksheet("Endpoint-Model");
endpointSheet.mergeCells("A1:D1");
endpointSheet.getCell("A1").value = "Mapping Endpoint ke Model";
endpointSheet.mergeCells("A2:D2");
endpointSheet.getCell("A2").value = "Endpoint disimpulkan dari route mount pada src/app.js dan nama module model.";
endpointSheet.getRow(4).values = ["Endpoint", "Module", "File Model", "Jumlah Source"];
const moduleGroups = new Map();
for (const row of rows) {
  if (!moduleGroups.has(row.module)) moduleGroups.set(row.module, row);
}
for (const [module, row] of [...moduleGroups.entries()].sort()) {
  endpointSheet.addRow([row.endpoint, module, row.modelFile, rows.filter((item) => item.module === module).length]);
}
styleSheet(endpointSheet, [42, 32, 38, 16]);
endpointSheet.autoFilter = { from: "A4", to: "D4" };

const notes = workbook.addWorksheet("Catatan");
notes.mergeCells("A1:B1");
notes.getCell("A1").value = "Catatan Inventaris";
notes.mergeCells("A2:B2");
notes.getCell("A2").value = "Batasan pembacaan: inventaris diambil dari referensi schema.object pada file model JavaScript.";
notes.addRows([
  ["Item", "Keterangan"],
  ["Source Oracle", "Umumnya schema DTKS; query di model memakai koneksi Oracle."],
  ["Source PostgreSQL", "Umumnya schema kunabakti; query di model memakai pgPool."],
  ["Named as View?", "Ya jika nama object diawali vw atau mengandung view; object lain tetap dicantumkan agar tidak ada source model yang terlewat."],
  ["Endpoint wildcard", "cek_ppn_view memiliki tiga route: /api/cek-ppn/sewatrafo, /bptrafo, dan /sewakap."],
]);
notes.getRow(4).font = { bold: true, color: { argb: "FFFFFFFF" } };
notes.getRow(4).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };
notes.getColumn(1).width = 24; notes.getColumn(2).width = 100;
notes.getColumn(2).alignment = { wrapText: true, vertical: "top" };
notes.views = [{ state: "frozen", ySplit: 4 }];
notes.showGridLines = false;

await workbook.xlsx.writeFile(outputPath);
console.log(JSON.stringify({ outputPath, sourceRows: rows.length, uniqueSources: new Set(rows.map((row) => row.sourceObject)).size, modules: moduleGroups.size }));
