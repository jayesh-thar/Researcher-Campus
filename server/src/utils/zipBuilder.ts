/**
 * Minimal ZIP file builder using only Node.js built-ins (no archiver / jszip needed).
 * Produces a valid ZIP archive buffer with STORED (uncompressed) entries —
 * browsers, macOS, and Windows can open these without issues.
 *
 * ZIP format reference: https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT
 */

interface ZipEntry {
  name: string;
  content: string;
}

function uint16LE(n: number): Buffer {
  const b = Buffer.alloc(2);
  b.writeUInt16LE(n, 0);
  return b;
}

function uint32LE(n: number): Buffer {
  const b = Buffer.alloc(4);
  b.writeUInt32LE(n, 0);
  return b;
}

/** CRC-32 table */
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function buildZipBuffer(entries: ZipEntry[]): Buffer {
  const localHeaders: Buffer[] = [];
  const centralDirs: Buffer[] = [];
  let offset = 0;

  const dosDate = (() => {
    const d = new Date();
    return (
      (((d.getFullYear() - 1980) & 0x7f) << 25) |
      (((d.getMonth() + 1) & 0x0f) << 21) |
      ((d.getDate() & 0x1f) << 16) |
      ((d.getHours() & 0x1f) << 11) |
      ((d.getMinutes() & 0x3f) << 5) |
      ((d.getSeconds() >> 1) & 0x1f)
    );
  })();

  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.name, 'utf8');
    const dataBuf = Buffer.from(entry.content, 'utf8');
    const crc = crc32(dataBuf);
    const size = dataBuf.length;

    // Local file header (signature 0x04034b50)
    const localHeader = Buffer.concat([
      Buffer.from([0x50, 0x4b, 0x03, 0x04]), // signature
      uint16LE(20),           // version needed
      uint16LE(0),            // flags
      uint16LE(0),            // compression (STORED)
      uint32LE(dosDate),      // mod time + date
      uint32LE(crc),          // CRC-32
      uint32LE(size),         // compressed size
      uint32LE(size),         // uncompressed size
      uint16LE(nameBuf.length), // filename length
      uint16LE(0),            // extra field length
      nameBuf,
      dataBuf
    ]);

    localHeaders.push(localHeader);

    // Central directory entry (signature 0x02014b50)
    const centralDir = Buffer.concat([
      Buffer.from([0x50, 0x4b, 0x01, 0x02]), // signature
      uint16LE(20),           // version made by
      uint16LE(20),           // version needed
      uint16LE(0),            // flags
      uint16LE(0),            // compression (STORED)
      uint32LE(dosDate),      // mod time + date
      uint32LE(crc),          // CRC-32
      uint32LE(size),         // compressed size
      uint32LE(size),         // uncompressed size
      uint16LE(nameBuf.length), // filename length
      uint16LE(0),            // extra field length
      uint16LE(0),            // comment length
      uint16LE(0),            // disk number start
      uint16LE(0),            // internal attrs
      uint32LE(0),            // external attrs
      uint32LE(offset),       // local header offset
      nameBuf
    ]);

    centralDirs.push(centralDir);
    offset += localHeader.length;
  }

  const centralDirBuf = Buffer.concat(centralDirs);
  const centralDirSize = centralDirBuf.length;
  const centralDirOffset = offset;

  // End of central directory record (signature 0x06054b50)
  const eocd = Buffer.concat([
    Buffer.from([0x50, 0x4b, 0x05, 0x06]), // signature
    uint16LE(0),                    // disk number
    uint16LE(0),                    // disk with central dir
    uint16LE(entries.length),       // entries on disk
    uint16LE(entries.length),       // total entries
    uint32LE(centralDirSize),       // central dir size
    uint32LE(centralDirOffset),     // central dir offset
    uint16LE(0)                     // comment length
  ]);

  return Buffer.concat([...localHeaders, centralDirBuf, eocd]);
}

