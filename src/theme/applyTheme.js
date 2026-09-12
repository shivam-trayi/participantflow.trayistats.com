import { themeColors } from './themeConfig';

const hexToRgb = (hex) => {
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    let fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : null;
};

export const applyTheme = () => {
    const root = document.documentElement;
    const setVar = (name, hex) => { 
        root.style.setProperty(name, hexToRgb(hex) || hex); 
    };
    
    // Primary
    setVar('--brand-from', themeColors.primary.gradientFrom);
    setVar('--brand-to', themeColors.primary.gradientTo);
    setVar('--brand-hoverFrom', themeColors.primary.gradientHoverFrom);
    setVar('--brand-hoverTo', themeColors.primary.gradientHoverTo);
    
    // Background
    setVar('--brand-bgFrom', themeColors.background.gradientFrom);
    setVar('--brand-bgVia', themeColors.background.gradientVia);
    setVar('--brand-bgTo', themeColors.background.gradientTo);
    
    // Button
    setVar('--brandButton-from', themeColors.button.gradientFrom);
    setVar('--brandButton-to', themeColors.button.gradientTo);
    setVar('--brandButton-hoverFrom', themeColors.button.gradientHoverFrom);
    setVar('--brandButton-hoverTo', themeColors.button.gradientHoverTo);
    
    // Option Card
    setVar('--brandCard-selectedBg', themeColors.optionCard.selectedBg);
    setVar('--brandCard-selectedBorder', themeColors.optionCard.selectedBorder);
    setVar('--brandCard-selectedText', themeColors.optionCard.selectedText);
    setVar('--brandCard-unselectedBorderHover', themeColors.optionCard.unselectedBorderHover);
    setVar('--brandCard-unselectedBgHover', themeColors.optionCard.unselectedBgHover);
    
    // Loader
    setVar('--brandLoader-text', themeColors.loader.textColor);
    
    // Alert
    setVar('--brandAlert-from', themeColors.alert.gradientFrom);
    setVar('--brandAlert-to', themeColors.alert.gradientTo);
    setVar('--brandAlert-iconBg', themeColors.alert.iconBg);
    setVar('--brandAlert-iconColor', themeColors.alert.iconColor);
};
