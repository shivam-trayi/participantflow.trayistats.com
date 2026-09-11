const COUNTRY_LANG_LIST = {
    4: "English-US", 6: "Hindi-IN", 7: "English-IN", 8: "Spanish-ES", 9: "English-AU",
    10: "German-AT", 11: "Dutch-BE", 12: "French-BE", 13: "Portuguese-BR", 14: "English-CA",
    15: "French-CA", 16: "Spanish-CL", 17: "Chinese-CN", 18: "Spanish-CO", 19: "Spanish-CR",
    20: "Danish-DK", 21: "Spanish-EC", 22: "Arabic-EG", 23: "French-FR", 24: "German-DE",
    25: "English-HK", 26: "Indonesian-ID", 27: "English-IE", 28: "Italian-IT", 29: "Japanese-JP",
    30: "Malay-MY", 31: "Spanish-MX", 32: "Dutch-NL", 33: "English-NZ", 34: "English-NG",
    35: "Norwegian-NO", 36: "Spanish-PE", 37: "English-PH", 38: "Polish-PL", 39: "Portuguese-PT",
    40: "Arabic-QA", 41: "Russian-RU", 42: "English-RU", 43: "Arabic-SA", 44: "English-SG",
    45: "English-ZA", 46: "Korean-KR", 48: "Swedish-SE", 49: "German-CH", 50: "French-CH",
    51: "Mandarin-TW", 52: "Thai-TH", 53: "Turkish-TR", 54: "English-GB", 55: "Ukrainian-UA",
    56: "Arabic-AE", 57: "Spanish-US", 58: "Vietnamese-VN", 59: "English-PR", 60: "Spanish-PR",
    61: "Spanish-DO", 62: "Uzbekistan-UZ", 63: "English-SA", 64: "Bulgarian-BG", 65: "Serbian-HR",
    66: "Bosnian-HR", 67: "Montenegrin-HR", 68: "Estonian-EE", 69: "Russian-EE", 162: "Finnish-FI",
    163: "Swedish-FI", 164: "Greek-CY", 165: "Turkish-CY", 166: "Greek-GR", 167: "Latvian-LV",
    168: "Lithuanian-LT", 169: "French-LU", 170: "Luxembourgish-LU", 171: "Maltese-MT",
    172: "English-MT", 173: "Romanian-RO", 174: "Slovenian-SI", 175: "Wales-GB",
    176: "Northern Ireland-GB", 177: "Hungarian-HU", 178: "Portuguese-PT", 179: "Slovak-SK",
    180: "English-QA", 181: "English-BD", 182: "English-CM", 183: "English-CI", 184: "French-CI",
    185: "French-SN", 186: "English-SN", 187: "English-PAK", 189: "scotland-GB", 190: "Spanish-AR",
    191: "Arabic-KW", 192: "Arabic-BH", 193: "Arabic-OM", 194: "Arabic-MA", 195: "French-MA",
    196: "Finnish-Fi", 197: "Swedish-Fi", 198: "English-AE", 199: "Swedish-NO", 200: "Arabic-DZ",
    201: "French-DZ", 202: "English-JO", 203: "Arabic-JO", 204: "Kazakh-KZ", 205: "Uzbekistan-RU",
    206: "Arabic-LB", 207: "English-OM", 208: "English-BH", 209: "English-KW", 210: "Amharic-ET",
    211: "Tamil-IN", 212: "English-NO", 213: "English-SE", 214: "English-CN", 215: "English-FR",
    216: "English-DE", 217: "English-TR", 218: "Serbian-SR", 219: "Traditional Chinese-HK",
    220: "Simplified Chinese-HK", 221: "Arabic-IQ", 222: "English-DK", 223: "Spanish-UY",
    224: "Czech-CZ", 225: "Gujrati-IN", 226: "English-NL", 227: "Germany-BE", 228: "English-ZW",
    229: "English-TZ", 230: "English-UG", 231: "Tamil-LK", 232: "Sinhalese-LK", 233: "English-VT",
    234: "Bislama-VT", 235: "French-VT", 236: "Montenegrin-ME", 237: "Serbian-ME", 238: "Bosnian-ME",
    239: "Albanian-ME", 240: "Chinese Simplified-MY", 241: "English-MY", 244:"Croatian-HR",253:"Spanish-SV",242: "Spanish-EC",243: "Spanish-GT"
};

/**
 * Compatibility export for demographics logic that expects a 2-letter country code.
 * Example: { 4: "US", 6: "IN", 7: "IN", ... }
 */
export const COUNTRY_CODE = Object.keys(COUNTRY_LANG_LIST).reduce((acc, id) => {
    const val = COUNTRY_LANG_LIST[id];
    // Specific overrides for countries that don't match the simple split logic if needed
    const parts = val.split('-');
    acc[id] = parts[parts.length - 1].toUpperCase();
    
    // Cleanup for specific cases like scotland-GB, etc.
    if (acc[id] === 'GB') acc[id] = 'GB';
    
    return acc;
}, {});

export const ZIP_REGEX = {
  US: /^\d{5}$/, IN: /^\d{6}$/, CA: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/,
  GB: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, AU: /^\d{4}$/, AT: /^\d{4}$/,
  BE: /^\d{4}$/, BR: /^\d{5}-?\d{3}$/, CL: /^\d{7}$/, CN: /^\d{6}$/,
  CO: /^\d{6}$/, CR: /^\d{5}$/, DK: /^\d{4}$/, EC: /^\d{6}$/,
  EG: /^\d{5}$/, FR: /^\d{5}$/, DE: /^\d{5}$/, HK: /^999077$|^\d{6}$/,
  ID: /^\d{5}$/, IE: /^[A-Z0-9]{3} ?[A-Z0-9]{4}$/i, IT: /^\d{5}$/,
  JP: /^\d{3}-?\d{4}$/, MY: /^\d{5}$/, MX: /^\d{5}$/, NL: /^\d{4} ?[A-Z]{2}$/i,
  NZ: /^\d{4}$/, NG: /^\d{6}$/, NO: /^\d{4}$/, PE: /^\d{5}$/,
  PH: /^\d{4}$/, PL: /^\d{2}-\d{3}$/, PT: /^\d{4}-\d{3}$/, QA: /^\d{5}$/,
  RU: /^\d{6}$/, SA: /^\d{5}$/, SG: /^\d{6}$/, ZA: /^\d{4}$/,
  KR: /^\d{5}$/, ES: /^\d{5}$/, SE: /^\d{3}\s?\d{2}$/, CH: /^\d{4}$/,
  TW: /^\d{3}(\d{2})?$/, TH: /^\d{5}$/, TR: /^\d{5}$/, UA: /^\d{5}$/,
  AE: /^\d{5}$/, VN: /^\d{6}$/, DO: /^\d{5}$/, UZ: /^\d{6}$/,
  BG: /^\d{4}$/, HR: /^\d{5}$/, EE: /^\d{5}$/, FI: /^\d{5}$/,
  CY: /^\d{4}$/, GR: /^\d{3}\s?\d{2}$/, LV: /^LV-\d{4}$/, LT: /^LT-\d{5}$/,
  LU: /^\d{4}$/, MT: /^[A-Z]{3}\s?\d{4}$/i, RO: /^\d{6}$/, SI: /^\d{4}$/,
  HU: /^\d{4}$/, SK: /^\d{3}\s?\d{2}$/, BD: /^\d{4}$/, CM: /^\d{5}$/,
  CI: /^\d{5}$/, SN: /^\d{5}$/, KW: /^\d{5}$/, BH: /^\d{3,4}$/,
  OM: /^\d{3}$/, MA: /^\d{5}$/, DZ: /^\d{5}$/, JO: /^\d{5}$/,
  KZ: /^\d{6}$/, LB: /^\d{4}$/, ET: /^\d{4}$/, SR: /^\d{5}$/,
  IQ: /^\d{5}$/, UY: /^\d{5}$/, CZ: /^\d{3}\s?\d{2}$/, ZW: /^\d{5}$/,
  TZ: /^\d{5}$/, UG: /^\d{5}$/, LK: /^\d{5}$/, VT: /^\d{5}$/, ME: /^\d{5}$/
};

const ID_TO_LANG = {
    4: "en", 6: "hi", 7: "en", 8: "ses", 9: "en", 10: "at", 11: "nl", 12: "fr", 13: "pt", 14: "en",
    15: "fr", 16: "es", 17: "zh", 18: "es", 19: "es", 20: "da", 21: "ec", 22: "ar", 23: "fr", 24: "de",
    25: "en", 26: "id", 27: "en", 28: "it", 29: "ja", 30: "ms", 31: "es", 32: "nl", 33: "en", 34: "en",
    35: "no", 36: "es", 37: "en", 38: "pl", 39: "pt", 40: "ar", 41: "ru", 42: "en", 43: "ar", 44: "en",
    45: "en", 46: "ko", 48: "sv", 49: "ch", 50: "fr", 51: "zh-TW", 52: "th", 53: "tr", 54: "en", 55: "uk",
    56: "ar", 57: "es", 58: "vi", 59: "en", 60: "es", 61: "es", 62: "uz", 63: "en", 64: "bg", 65: "sr",
    66: "bs", 67: "me", 68: "et", 69: "ru", 162: "fi", 163: "sv", 164: "el", 165: "tr", 166: "el", 167: "lv",
    168: "lt", 169: "fr", 170: "lb", 171: "mt", 172: "en", 173: "ro", 174: "sl", 175: "en", 176: "en",
    177: "hu", 178: "pt", 179: "sk", 180: "en", 181: "en", 182: "en", 183: "en", 184: "fr", 185: "fr",
    186: "en", 187: "en", 189: "en", 190: "es", 191: "ar", 192: "ar", 193: "ar", 194: "ar", 195: "fr",
    196: "fi", 197: "sv", 198: "en", 199: "sv", 200: "ar", 201: "fr", 202: "en", 203: "ar", 204: "kk",
    205: "uz", 206: "ar", 207: "en", 208: "en", 209: "en", 210: "am", 211: "ta", 212: "en", 213: "en",
    214: "en", 215: "en", 216: "en", 217: "en", 218: "sr", 219: "zh-TW", 220: "zh", 221: "ar", 222: "en",
    223: "es", 224: "cs", 225: "gu", 226: "en", 227: "de", 228: "en", 229: "en", 230: "en", 231: "ta",
    232: "si", 233: "en", 234: "bi", 235: "fr", 236: "me", 237: "sr", 238: "bs", 239: "sq", 240: "zh", 241: "en" , 244: "hr", 253: "es", 242: "es"
};

const COUNTRY_TO_LANG = {
    'AU': 'en', 'BD': 'en', 'CA': 'en', 'CM': 'en', 'GB': 'en', 'IE': 'en', 
    'LK': 'en', 'NG': 'en', 'NZ': 'en', 'PAK': 'en', 'SG': 'en', 'TZ': 'en', 
    'UG': 'en', 'US': 'en', 'ZA': 'en', 'ZW': 'en', 'PH': 'en', 'MT': 'en', 
    'CY': 'en', 'LV': 'en', 'LT': 'en', 'AR': 'es', 'CL': 'es', 'CO': 'es', 
    'CR': 'es', 'EC': 'ec', 'MX': 'es', 'PE': 'es', 'PR': 'es', 'DO': 'es', 
    'UY': 'es', 'ES': 'ses', 'AE': 'ar', 'BH': 'ar', 'DZ': 'ar', 'EG': 'ar', 
    'IQ': 'ar', 'JO': 'ar', 'KW': 'ar', 'LB': 'ar', 'MA': 'ar', 'OM': 'ar', 
    'QA': 'ar', 'SA': 'ar', 'RU': 'ru', 'KZ': 'ru', 'UA': 'uk', 'UZ': 'uz',
    'CN': 'zh', 'HK': 'zh', 'TW': 'zh-TW', 'AT': 'at', 'CH': 'ch', 'DE': 'de',
    'BE': 'nl', 'NL': 'nl', 'BR': 'pt', 'PT': 'pt', 'BG': 'bg', 'CZ': 'cs', 
    'DK': 'da', 'EE': 'et', 'FI': 'fi', 'FR': 'fr', 'GR': 'el', 'HU': 'hu', 
    'ID': 'id', 'IT': 'it', 'JP': 'ja', 'KR': 'ko', 'MY': 'ms', 'NO': 'no', 
    'PL': 'pl', 'RO': 'ro', 'SE': 'sv', 'SI': 'sl', 'SK': 'sk', 'SR': 'sr', 
    'ME': 'sr', 'TH': 'th', 'TR': 'tr', 'VN': 'vi', 'SQ': 'sq', 'HR': 'hr'
};

/**
 * @param {number|string} countryId 
 * @returns {{countryCode: string, lang: string}}
 */
export const getCountryMetadata = (countryId) => {
    const id = parseInt(countryId);
    let countryCode = COUNTRY_CODE[id];
    
    if (!countryCode && typeof countryId === 'string' && countryId.length === 2) {
        countryCode = countryId.toUpperCase();
    }
    
    countryCode = countryCode || 'US';
    const lang = ID_TO_LANG[id] || COUNTRY_TO_LANG[countryCode] || 'en';
    
    return { countryCode, lang };
};