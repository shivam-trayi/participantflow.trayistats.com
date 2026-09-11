export const COUNTRY_CODE = {
    6: "IN",
    7: "IN",
    211: "IN",
    225: "IN",
    4: "US",
    57: "US",
    190: "AR",
    9: "AU",
    10: "AT",
    11: "BE",
    12: "BE",
    227: "BE",
    13: "BR",
    14: "CA",
    15: "CA",
    16: "CL",
    17: "CN",
    214: "CN",
    18: "CO",
    19: "CR",
    20: "DK",
    222: "DK",
    21: "EC",
    22: "EG",
    23: "FR",
    215: "FR",
    216: "DE",
    24: "DE",
    25: "HK",
    219: "HK",
    220: "HK",
    26: "ID",
    27: "IE",
    28: "IT",
    29: "JP",
    30: "MY",
    31: "MX",
    32: "NL",
    226: "NL",
    33: "NZ",
    34: "NG",
    35: "NO",
    212: "NO",
    36: "PE",
    37: "PH",
    38: "PL",
    39: "PT",
    178: "PT",
    40: "QA",
    180: "QA",
    41: "RU",
    42: "RU",
    205: "RU",
    43: "SA",
    63: "SA",
    44: "SG",
    45: "ZA",
    46: "KR",
    8: "ES",
    48: "SE",
    213: "SE",
    49: "CH",
    50: "CH",
    51: "TW",
    52: "TH",
    53: "TR",
    217: "TR",
    189: "GB",
    54: "GB",
    175: "GB",
    176: "GB",
    55: "UA",
    56: "AE",
    198: "AE",
    58: "VN",
    59: "PR",
    60: "PR",
    61: "DO",
    62: "UZ",
    64: "BG",
    65: "HR",
    66: "HR",
    67: "HR",
    68: "EE",
    69: "EE",
    162: "FI",
    163: "FI",
    196: "FI",
    197: "FI",
    164: "CY",
    165: "CY",
    166: "GR",
    167: "LV",
    168: "LT",
    169: "LU",
    170: "LU",
    171: "MT",
    172: "MT",
    173: "RO",
    174: "SI",
    177: "HU",
    179: "SK",
    181: "BD",
    182: "CM",
    183: "CI",
    184: "CI",
    185: "SN",
    186: "SN",
    187: "PAK",
    191: "KW",
    209: "KW",
    208: "BH",
    192: "BH",
    193: "OM",
    207: "OM",
    194: "MA",
    195: "MA",
    199: "NO",
    200: "DZ",
    201: "DZ",
    202: "JO",
    203: "JO",
    204: "KZ",
    206: "LB",
    210: "ET",
    218: "SR",
    221: "IQ",
    223: "UY",
    224: "CZ",
    228: "ZW",
    229: "TZ",
    230: "UG",
    231: "LK",
    232: "LK",
    233: "VT",
    234: "VT",
    235: "VT",
    236: "ME",
    237: "ME",
    238: "ME",
    239: "ME"
}



export const ZIP_REGEX = {
  US: /^\d{5}$/,                              // United States: 5 digits (12345)
  IN: /^\d{6}$/,                              // India: 6 digit PIN code (110001)
  CA: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/,             // Canada: A1A 1A1 format
  GB: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,   // United Kingdom: SW1A 1AA
  AU: /^\d{4}$/,                              // Australia: 4 digit postcode
  AT: /^\d{4}$/,                              // Austria: 4 digits
  BE: /^\d{4}$/,                              // Belgium: 4 digits
  BR: /^\d{5}-\d{3}$/,                        // Brazil: 12345-678 strictly with hyphen
  CL: /^\d{7}$/,                              // Chile: 7 digits
  CN: /^\d{6}$/,                              // China: 6 digits
  CO: /^\d{6}$/,                              // Colombia: 6 digits
  CR: /^\d{5}$/,                              // Costa Rica: 5 digits
  DK: /^\d{4}$/,                              // Denmark: 4 digits
  EC: /^\d{6}$/,                              // Ecuador: 6 digits
  EG: /^\d{5}$/,                              // Egypt: 5 digits
  FR: /^\d{5}$/,                              // France: 5 digits
  DE: /^\d{5}$/,                              // Germany: 5 digits
  HK: /^999077$|^\d{6}$/,                     // Hong Kong: usually 999077 or sometimes 6 digits
  ID: /^\d{5}$/,                              // Indonesia: 5 digits
  IE: /^[A-Z0-9]{3} ?[A-Z0-9]{4}$/i,           // Ireland: Eircode format (A65 F4E2)
  IT: /^\d{5}$/,                              // Italy: 5 digits
  JP: /^\d{3}-?\d{4}$/,                       // Japan: 123-4567
  MY: /^\d{5}$/,                              // Malaysia: 5 digits
  MX: /^\d{5}$/,                              // Mexico: 5 digits
  NL: /^\d{4} ?[A-Z]{2}$/i,                   // Netherlands: 1234 AB
  NZ: /^\d{4}$/,                              // New Zealand: 4 digits
  NG: /^\d{6}$/,                              // Nigeria: 6 digits
  NO: /^\d{4}$/,                              // Norway: 4 digits
  PE: /^\d{5}$/,                              // Peru: 5 digits
  PH: /^\d{4}$/,                              // Philippines: 4 digits
  PL: /^\d{2}-\d{3}$/,                        // Poland: 12-345
  PT: /^\d{4}-\d{3}$/,                        // Portugal: 1234-567
  QA: /^\d{5}$/,                              // Qatar: 5 digits
  RU: /^\d{6}$/,                              // Russia: 6 digits
  SA: /^\d{5}$/,                              // Saudi Arabia: 5 digits
  SG: /^\d{6}$/,                              // Singapore: 6 digits
  ZA: /^\d{4}$/,                              // South Africa: 4 digits
  KR: /^\d{5}$/,                              // South Korea: 5 digits
  ES: /^\d{5}$/,                              // Spain: 5 digits
  SE: /^\d{3}\s?\d{2}$/,                      // Sweden: 123 45
  CH: /^\d{4}$/,                              // Switzerland: 4 digits
  TW: /^\d{3}(\d{2})?$/,                      // Taiwan: 3 or 5 digits
  TH: /^\d{5}$/,                              // Thailand: 5 digits
  TR: /^\d{5}$/,                              // Turkey: 5 digits
  UA: /^\d{5}$/,                              // Ukraine: 5 digits
  AE: /^\d{5}$/,                              // UAE: commonly 5 digits (postal system limited)
  VN: /^\d{6}$/,                              // Vietnam: 6 digits
  DO: /^\d{5}$/,                              // Dominican Republic: 5 digits
  UZ: /^\d{6}$/,                              // Uzbekistan: 6 digits
  BG: /^\d{4}$/,                              // Bulgaria: 4 digits
  HR: /^\d{5}$/,                              // Croatia: 5 digits
  EE: /^\d{5}$/,                              // Estonia: 5 digits
  FI: /^\d{5}$/,                              // Finland: 5 digits
  CY: /^\d{4}$/,                              // Cyprus: 4 digits
  GR: /^\d{3}\s?\d{2}$/,                      // Greece: 123 45
  LV: /^LV-\d{4}$/,                           // Latvia: LV-1234
  LT: /^LT-\d{5}$/,                           // Lithuania: LT-12345
  LU: /^\d{4}$/,                              // Luxembourg: 4 digits
  MT: /^[A-Z]{3}\s?\d{4}$/i,                  // Malta: AAA 1234
  RO: /^\d{6}$/,                              // Romania: 6 digits
  SI: /^\d{4}$/,                              // Slovenia: 4 digits
  HU: /^\d{4}$/,                              // Hungary: 4 digits
  SK: /^\d{3}\s?\d{2}$/,                      // Slovakia: 123 45
  BD: /^\d{4}$/,                              // Bangladesh: 4 digits
  CM: /^\d{5}$/,                              // Cameroon: 5 digits
  CI: /^\d{5}$/,                              // Ivory Coast: 5 digits
  SN: /^\d{5}$/,                              // Senegal: 5 digits
  KW: /^\d{5}$/,                              // Kuwait: 5 digits
  BH: /^\d{3,4}$/,                            // Bahrain: 3–4 digits
  OM: /^\d{3}$/,                              // Oman: 3 digits
  MA: /^\d{5}$/,                              // Morocco: 5 digits
  DZ: /^\d{5}$/,                              // Algeria: 5 digits
  JO: /^\d{5}$/,                              // Jordan: 5 digits
  KZ: /^\d{6}$/,                              // Kazakhstan: 6 digits
  LB: /^\d{4}$/,                              // Lebanon: 4 digits
  ET: /^\d{4}$/,                              // Ethiopia: 4 digits
  SR: /^\d{5}$/,                              // Suriname: 5 digits
  IQ: /^\d{5}$/,                              // Iraq: 5 digits
  UY: /^\d{5}$/,                              // Uruguay: 5 digits
  CZ: /^\d{3}\s?\d{2}$/,                      // Czech Republic: 123 45
  ZW: /^\d{5}$/,                              // Zimbabwe: 5 digits
  TZ: /^\d{5}$/,                              // Tanzania: 5 digits
  UG: /^\d{5}$/,                              // Uganda: 5 digits
  LK: /^\d{5}$/,                              // Sri Lanka: 5 digits
  VT: /^\d{5}$/,                              // Vanuatu: 5 digits
  ME: /^\d{5}$/                               // Montenegro: 5 digits
};

export const ZIP_EXAMPLES = {
  US: "12345",
  IN: "110001",
  CA: "A1A 1A1",
  GB: "SW1A 1AA",
  AU: "1234",
  AT: "1234",
  BE: "1234",
  BR: "12345-678",
  CL: "1234567",
  CN: "123456",
  CO: "123456",
  CR: "12345",
  DK: "1234",
  EC: "123456",
  EG: "12345",
  FR: "12345",
  DE: "12345",
  HK: "999077",
  ID: "12345",
  IE: "A65 F4E2",
  IT: "12345",
  JP: "123-4567",
  MY: "12345",
  MX: "12345",
  NL: "1234 AB",
  NZ: "1234",
  NG: "123456",
  NO: "1234",
  PE: "12345",
  PH: "1234",
  PL: "12-345",
  PT: "1234-567",
  QA: "12345",
  RU: "123456",
  SA: "12345",
  SG: "123456",
  ZA: "1234",
  KR: "12345",
  ES: "12345",
  SE: "123 45",
  CH: "1234",
  TW: "123",
  TH: "12345",
  TR: "12345",
  UA: "12345",
  AE: "12345",
  VN: "123456",
  DO: "12345",
  UZ: "123456",
  BG: "1234",
  HR: "12345",
  EE: "12345",
  FI: "12345",
  CY: "1234",
  GR: "123 45",
  LV: "LV-1234",
  LT: "LT-12345",
  LU: "1234",
  MT: "AAA 1234",
  RO: "123456",
  SI: "1234",
  HU: "1234",
  SK: "123 45",
  BD: "1234",
  CM: "12345",
  CI: "12345",
  SN: "12345",
  KW: "12345",
  BH: "1234",
  OM: "123",
  MA: "12345",
  DZ: "12345",
  JO: "12345",
  KZ: "123456",
  LB: "1234",
  ET: "1234",
  SR: "12345",
  IQ: "12345",
  UY: "12345",
  CZ: "123 45",
  ZW: "12345",
  TZ: "12345",
  UG: "12345",
  LK: "12345",
  VT: "12345",
  ME: "12345"
};
