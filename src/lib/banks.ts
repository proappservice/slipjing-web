/** ธนาคารไทยหลัก + รหัส BOT 3 หลัก (ใช้ทั้ง dropdown และแปลงรหัส→ชื่อ) */
export const THAI_BANKS = [
  { code: "002", name: "ธนาคารกรุงเทพ (BBL)" },
  { code: "004", name: "ธนาคารกสิกรไทย (KBank)" },
  { code: "006", name: "ธนาคารกรุงไทย (KTB)" },
  { code: "011", name: "ธนาคารทหารไทยธนชาต (ttb)" },
  { code: "014", name: "ธนาคารไทยพาณิชย์ (SCB)" },
  { code: "025", name: "ธนาคารกรุงศรีอยุธยา (BAY)" },
  { code: "030", name: "ธนาคารออมสิน (GSB)" },
  { code: "069", name: "ธนาคารเกียรตินาคินภัทร (KKP)" },
  { code: "022", name: "ธนาคารซีไอเอ็มบีไทย (CIMBT)" },
  { code: "067", name: "ธนาคารทิสโก้ (TISCO)" },
  { code: "024", name: "ธนาคารยูโอบี (UOB)" },
  { code: "033", name: "ธนาคารอาคารสงเคราะห์ (GHB)" },
  { code: "034", name: "ธ.ก.ส. (BAAC)" },
  { code: "073", name: "ธนาคารแลนด์ แอนด์ เฮ้าส์ (LH Bank)" },
] as const;

export const bankName = (code: string): string =>
  THAI_BANKS.find((b) => b.code === code)?.name ?? `ธนาคารรหัส ${code}`;
