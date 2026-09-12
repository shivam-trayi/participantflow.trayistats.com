import React from 'react';
import { AlertCircle } from 'lucide-react';
import { themeClasses } from '../../theme/themeConfig';

const AlertMessage = (props) => {

  let errorMessage = "Please contact support. Thank you.";

  if (props?.alertMessage?.message && props.alertMessage.message.length > 0) {
      errorMessage = props.alertMessage.message;
  }

  return (
      <div className={`fixed inset-0 min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 ${themeClasses.mainBackground} z-[99999] overflow-hidden`}>
          
          {/* Dynamic ambient survey backdrop (Matched with main app) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
              <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full ${themeClasses.ambientOrb1}`} />
              <div className={`absolute top-1/4 -right-32 w-96 h-96 rounded-full ${themeClasses.ambientOrb2}`} />
              <div className={`absolute -bottom-32 left-1/3 w-96 h-96 rounded-full ${themeClasses.ambientOrb3}`} />
          </div>

          <div className={`w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-500 relative z-10 ${themeClasses.surfaceCard}`}>
              
              {/* Top Accent Bar */}
              <div className={`absolute top-0 left-0 w-full h-1.5 ${themeClasses.errorAccentBar}`} />
              
              <div className="p-8 sm:p-10 flex flex-col items-center text-center">
                  
                  {/* Icon Wrapper */}
                  <div className={`relative flex items-center justify-center w-20 h-20 mb-6 rounded-full shadow-inner ${themeClasses.errorIconWrapper} ${themeClasses.text.errorIcon}`}>
                      <AlertCircle className="w-9 h-9 stroke-[2.5]" />
                      <div className={`absolute top-1 right-0 w-4 h-4 rounded-full border-[3px] ${themeClasses.errorIconDot}`} />
                  </div>
                  
                  <h2 className={`mb-3 ${themeClasses.typography.headlineMedium} ${themeClasses.text.primary}`}>
                      Oops! Access Denied
                  </h2>
                  
                  <p className={`${themeClasses.typography.bodyLarge} ${themeClasses.text.secondary}`}>
                      {errorMessage}
                  </p>
                  
              </div>
              
              {/* Bottom Footer Area */}
              <div className={`px-8 py-5 flex flex-col items-center justify-center ${themeClasses.surfaceFooter}`}>
                  <p className={`text-center ${themeClasses.typography.bodySmall} ${themeClasses.text.tertiary}`}>
                      If you believe this is a mistake, please reach out to the support team or your administrator.
                  </p>
              </div>

          </div>
      </div>
  )
}

export default AlertMessage;
