export const ASSETS = Object.freeze({
  "environment.forest.base": {
    "src": "./assets/forest-base.webp",
    "type": "ENVIRONMENT",
    "size": [
      1024,
      1536
    ],
    "frame": [
      0,
      0,
      1024,
      1536
    ],
    "anchor": [
      0.5,
      0.5
    ],
    "alpha": false,
    "format": "single-sprite",
    "sha256": "ba6eac570ee4fc3a58a96639bb1b2320a6bef77e874426f26c80eb535eadc64f",
    "bytes": 208500
  },
  "character.moki.idle": {
    "src": "./assets/moki-idle.webp",
    "type": "CHARACTER",
    "size": [
      1254,
      1254
    ],
    "frame": [
      116,
      19,
      1098,
      1220
    ],
    "anchor": [
      0.5,
      1
    ],
    "alpha": true,
    "format": "single-sprite",
    "sha256": "164a6c044e7e3f23b851e2345782724cd895ecca82f63fcd762151897aaae900",
    "bytes": 122722
  },
  "prop.backpack": {
    "src": "./assets/backpack.webp",
    "type": "WORLD_PROP",
    "size": [
      1254,
      1254
    ],
    "frame": [
      110,
      70,
      1078,
      1111
    ],
    "anchor": [
      0.5,
      1
    ],
    "alpha": true,
    "format": "single-sprite",
    "sha256": "82ad924ee09e63be77264f807d6d7158a548707cdd098bdad3223c3cb0c2a95d",
    "bytes": 149950
  },
  "prop.chest.closed": {
    "src": "./assets/chest-closed.webp",
    "type": "WORLD_PROP",
    "size": [
      1254,
      1254
    ],
    "frame": [
      99,
      201,
      1055,
      912
    ],
    "anchor": [
      0.5,
      1
    ],
    "alpha": true,
    "format": "single-sprite",
    "sha256": "7d291c3da9bd7dae8ccd3c888d1370ec054a8371d530dbfba5b8b5f1724e2da4",
    "bytes": 129938
  }
});
export function asset(id,requiredType){const entry=ASSETS[id];if(!entry||entry.type!==requiredType)throw new TypeError(`Invalid asset role: ${id}; expected ${requiredType}`);return entry;}
