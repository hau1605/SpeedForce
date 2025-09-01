import fs from "fs";
import path from "path";

const storagePath = path.join(process.cwd(), "storage/result");

const ensureStoragePathExists = () => {
  if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath, { recursive: true });
  }
};

export const saveJson = (filename, data) => {
  ensureStoragePathExists();
  const filePath = path.join(storagePath, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return filePath;
};

export const getJson = (filename) => {
  console.log(`Retrieving JSON from ${filename}`);
  const filePath = path.join(storagePath, filename+".json");
  console.log(`Full file path: ${filePath}`);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  }
  throw new Error("File not found");
};

export const existsJson = (filename) => {
  const filePath = path.join(storagePath, filename + ".json");
  return fs.existsSync(filePath);
};
