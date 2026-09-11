const fs = require('fs');
const path = require('path');

const rootDir = 'C:/companyrepos/participantflow.trayistats.com/src';

const moves = [
  // Hooks
  { from: 'features/entry/useBotDetector.js', to: 'hooks/useBotDetector.js' },
  { from: 'features/entry/useCopyPasteDetector.js', to: 'hooks/useCopyPasteDetector.js' },
  { from: 'features/entry/useCopyPasteLogger.js', to: 'hooks/useCopyPasteLogger.js' },
  { from: 'features/entry/useUserActivity.js', to: 'hooks/useUserActivity.js' },
  { from: 'features/entry/useWelcomeUserActivityTracker.js', to: 'hooks/useWelcomeUserActivityTracker.js' },
  // Utils
  { from: 'features/entry/getFingerprint.js', to: 'utils/getFingerprint.js' },
  { from: 'features/entry/requestData.js', to: 'utils/requestData.js' },
  { from: 'common/utils/ipRanker.js', to: 'utils/ipRanker.js' },
  { from: 'common/utils/logger.js', to: 'utils/logger.js' },
  // Pages
  { from: 'features/entry/home.js', to: 'pages/entry/EntryPage.js' }, 
  // Components
  { from: 'features/entry/DragAndDropGame.js', to: 'features/screening/components/DragAndDropGame.js' },
  { from: 'features/entry/SurveyQuestions.js', to: 'features/screening/components/SurveyQuestions.js' },
  { from: 'features/entry/WelcomeMessage.js', to: 'features/screening/components/WelcomeMessage.js' },
  { from: 'features/entry/WelcomeMessage.styles.js', to: 'features/screening/components/WelcomeMessage.styles.js' },
  { from: 'features/entry/multiselectDropdown.css', to: 'features/screening/components/multiselectDropdown.css' },
  // Screening Core
  { from: 'features/entry/demographics.js', to: 'features/screening/demographics.js' },
  { from: 'features/entry/demographicsIsSinglePageScreening.js', to: 'features/screening/demographicsIsSinglePageScreening.js' },
  // Services
  { from: 'common/api/apiService.js', to: 'services/api/apiService.js' },
  { from: 'common/api/apiWrapper.js', to: 'services/api/apiWrapper.js' },
  { from: 'common/api/config.js', to: 'services/api/config.js' },
  { from: 'common/sdk/api/client.js', to: 'services/sdk/api/client.js' },
  { from: 'common/sdk/collectors/behaviorCollector.js', to: 'services/sdk/collectors/behaviorCollector.js' },
  { from: 'common/sdk/collectors/deviceCollector.js', to: 'services/sdk/collectors/deviceCollector.js' },
  { from: 'common/sdk/collectors/fingerprintCollector.js', to: 'services/sdk/collectors/fingerprintCollector.js' },
  { from: 'common/sdk/collectors/index.js', to: 'services/sdk/collectors/index.js' },
  { from: 'common/sdk/utils/fontDetector.js', to: 'services/sdk/utils/fontDetector.js' },
  { from: 'common/sdk/utils/hash.js', to: 'services/sdk/utils/hash.js' },
  { from: 'common/sdk/utils/hmac.js', to: 'services/sdk/utils/hmac.js' },
  { from: 'common/sdk/IPRanker.js', to: 'services/sdk/IPRanker.js' },
  { from: 'common/sdk/index.js', to: 'services/sdk/index.js' },
  { from: 'common/countryLangIdMapping.js', to: 'utils/countryLangIdMapping.js' },
  { from: 'common/countrylangMapping.js', to: 'utils/countrylangMapping.js' }
];

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const pathMap = {};
moves.forEach(m => {
  const oldAbs = path.join(rootDir, m.from).replace(/\\/g, '/');
  const newAbs = path.join(rootDir, m.to).replace(/\\/g, '/');
  pathMap[oldAbs] = newAbs;
});

console.log('Moving files...');
moves.forEach(m => {
  const oldPath = path.join(rootDir, m.from);
  const newPath = path.join(rootDir, m.to);
  if (fs.existsSync(oldPath)) {
    ensureDir(newPath);
    fs.renameSync(oldPath, newPath);
    console.log(`Moved ${m.from} -> ${m.to}`);
  }
});

function getAllFiles(dir, ext, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, ext, fileList);
    } else if (filePath.endsWith(ext) || filePath.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allJsFiles = getAllFiles(rootDir, '.js');

function resolveImport(currentFilePath, importStr) {
  if (!importStr.startsWith('.')) return importStr;
  
  const normalizedCurrent = currentFilePath.replace(/\\/g, '/');
  let oldCurrentFilePath = normalizedCurrent;
  
  for (const oldAbs in pathMap) {
    if (pathMap[oldAbs] === normalizedCurrent) {
      oldCurrentFilePath = oldAbs;
      break;
    }
  }
  
  const oldCurrentDir = path.dirname(oldCurrentFilePath);
  let oldImportedAbs = path.resolve(oldCurrentDir, importStr).replace(/\\/g, '/');
  
  let newImportedAbs = null;
  const possibleExts = ['', '.js', '.jsx', '.css'];
  
  for (const ext of possibleExts) {
    const testPath = oldImportedAbs + ext;
    if (pathMap[testPath]) {
      newImportedAbs = pathMap[testPath];
      if (ext !== '' && !importStr.endsWith(ext)) {
        newImportedAbs = newImportedAbs.replace(new RegExp(ext + '$'), '');
      }
      break;
    }
  }
  
  if (!newImportedAbs) {
     newImportedAbs = oldImportedAbs; 
  }
  
  let newRelative = path.relative(path.dirname(normalizedCurrent), newImportedAbs).replace(/\\/g, '/');
  if (!newRelative.startsWith('.')) {
    newRelative = './' + newRelative;
  }
  return newRelative;
}

console.log('Updating imports...');
allJsFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  content = content.replace(/(import\s+.*?from\s+['"])(.*?)(['"])/g, (match, p1, p2, p3) => {
    const newImport = resolveImport(filePath, p2);
    if (newImport !== p2) changed = true;
    return p1 + newImport + p3;
  });
  
  content = content.replace(/(require\(['"])(.*?)(['"]\))/g, (match, p1, p2, p3) => {
    const newImport = resolveImport(filePath, p2);
    if (newImport !== p2) changed = true;
    return p1 + newImport + p3;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated imports in ${path.relative(rootDir, filePath)}`);
  }
});

// Update App.js specific imports since home.js was renamed
const appJsPath = path.join(rootDir, 'App.js');
if (fs.existsSync(appJsPath)) {
  let appJs = fs.readFileSync(appJsPath, 'utf8');
  // Be careful with replacing 'home' -> 'EntryPage' globally
  appJs = appJs.replace(/features\/entry\/home/g, 'pages/entry/EntryPage');
  appJs = appJs.replace(/import Home /g, 'import EntryPage ');
  appJs = appJs.replace(/<Home/g, '<EntryPage');
  appJs = appJs.replace(/<\/Home>/g, '</EntryPage>');
  fs.writeFileSync(appJsPath, appJs, 'utf8');
}
