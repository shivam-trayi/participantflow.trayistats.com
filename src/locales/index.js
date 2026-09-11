import en from './en.json';
import hi from './hi.json';
import es from './es.json';
import ar from './ar.json';
import de from './de.json';
import fr from './fr.json';
import pt from './pt.json';
import zh from './zh.json';
import ru from './ru.json';
import it from './it.json';
import nl from './nl.json';
import ja from './ja.json';
import ko from './ko.json';
import tr from './tr.json';
import id from './id.json';
import th from './th.json';
import vi from './vi.json';
import da from './da.json';
import no from './no.json';
import pl from './pl.json';
import sv from './sv.json';
import uk from './uk.json';
import fi from './fi.json';
import el from './el.json';
import cs from './cs.json';
import hu from './hu.json';
import ro from './ro.json';
import sk from './sk.json';
import gu from './gu.json';
import ta from './ta.json';
import bg from './bg.json';
import sr from './sr.json';
import et from './et.json';
import uz from './uz.json';
import ms from './ms.json';
import sl from './sl.json';
import sq from './sq.json';
import zhTW from './zh-TW.json';
import lv from './lv.json';
import lt from './lt.json';
import lb from './lb.json';
import mt from './mt.json';
import kk from './kk.json';
import am from './am.json';
import si from './si.json';
import bi from './bi.json';
import bs from './bs.json';
import me from './me.json';
import ch from './ch.json';
import at from './at.json';
import hr from './hr.json';
import ec from './ec.json';
import ses from './ses.json';
import { getCountryMetadata } from '../utils/countryLangIdMapping';

const translations = {
  en, hi, es, ar, de, fr, pt, zh, ru,
  it, nl, ja, ko, tr, id, th, vi, ch, at, hr, ec, ses,
  da, no, pl, sv, uk, fi, el, cs, hu, ro, sk,
  gu, ta, bg, sr, et, uz, ms, sl, sq, lv, lt, lb, mt, kk, am, si, bi, bs, me, 'zh-TW': zhTW
};

export const getTranslationsByCountryId = (countryId) => {
    const { lang } = getCountryMetadata(countryId);
    return translations[lang] || translations['en'];
};

export const getTranslations = (code) => {
  const baseCode = code.split('-')[0].toLowerCase();
  return translations[baseCode] || translations['en'];
};

export default translations;
