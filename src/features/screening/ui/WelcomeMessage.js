import React, { useEffect, useState, useRef } from "react";
import { getStyles, cssAnimations } from "./WelcomeMessage.styles";
import { connect } from 'react-redux';

const WelcomeMessage = ({ fetchData, imageUrl, content }) => {
  console.log('WelcomeMessage rendered')
  const hasSeparateImage = imageUrl && imageUrl.trim() !== '';
  const hasContent = content && content.trim() !== '';
  const hasInlineImage = hasContent && /<img\s+[^>]*src\s*=\s*["'][^"']+["'][^>]*>/i.test(content);
  const isInlineImageLayout = hasInlineImage && !hasSeparateImage;
  const isSeparateImageLayout = hasSeparateImage && hasContent;
  const isNoImageLayout = !hasSeparateImage && !hasInlineImage;
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const [separateImageLoaded, setSeparateImageLoaded] = useState(false);
  const [inlineImagesLoaded, setInlineImagesLoaded] = useState(false);
  const scrollRef = useRef(null);
  const buttonRef = useRef(null);
  const styles = getStyles(isInlineImageLayout, imageUrl, isNoImageLayout, showStickyButton, isMobile);

  // Hide body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const checkScrollable = () => {
      if (scrollRef.current) {
        const scrollDifference = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
        const hasScroll = scrollDifference > 60
        setShowStickyButton(hasScroll);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    
    return () => window.removeEventListener('resize', checkScrollable);
  }, [content, separateImageLoaded, inlineImagesLoaded]);

  // Handle inline images loading
  useEffect(() => {
    if (!hasInlineImage) {
      setInlineImagesLoaded(true);
      return;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const images = tempDiv.querySelectorAll('img');
    
    if (images.length === 0) { setInlineImagesLoaded(true); return;}
    let loadedCount = 0;
    const totalImages = images.length;

    images.forEach((img) => {
      const image = new Image();
      image.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setInlineImagesLoaded(true);
        }
      };
      image.onerror = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setInlineImagesLoaded(true);
        }
      };
      image.src = img.src;
    });
  }, [content, hasInlineImage]);

  // Handle scroll to show/hide sticky button
  const handleScroll = (e) => {
    const element = e.target;
    const scrollPosition = element.scrollTop;
    const scrollDifference = element.scrollHeight - element.clientHeight;
    const hasScroll = scrollDifference > 60;
    
    if (!hasScroll) {
      setShowStickyButton(false);
      return;
    }

    if (scrollPosition > 50) {
      setShowStickyButton(false);
    } else {
      setShowStickyButton(true);
    }
  };

  // Scroll to survey button
  const scrollToButton = () => {
    if (buttonRef.current && scrollRef.current) {
      buttonRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center'
      });
    }
  };

  let processedContent = (content || "")
    .replace(/\\n\\n/g, '')
    .replace(/\\n/g, '');

  if (hasInlineImage) {
    processedContent = processedContent.replace(
      /<img\s+([^>]*)>/gi,
      '<img $1 style="width: 100%; height: auto; max-height: 250px; display: block; margin: 16px 0; border-radius: 8px; object-fit: cover;"><br>'
    );
  }

  return (
    <div style={styles.wrapper} className="welcome-wrapper">
      <style>
        {cssAnimations}
      </style>
      <div onScroll={handleScroll} ref={scrollRef} style={{...styles.container, ...styles.scrollWrapper}} className="welcome-container-mobile">
        {isSeparateImageLayout && (
          <div style={styles.imageContainer}>
            {!separateImageLoaded && (
              <div style={styles.imageLoader}>
                <div style={styles.spinner}></div>
              </div>
            )}
            <img 
              src={imageUrl} 
              alt="Welcome" 
              style={{...styles.image, display: separateImageLoaded ? 'block' : 'none'}}
              onLoad={() => setSeparateImageLoaded(true)}
            />
          </div>
        )}

        <div>
          <div style={styles.contentWrapper}>
            {hasInlineImage && !inlineImagesLoaded && (
              <div style={styles.inlineImageLoader}>
                <div style={styles.spinner}></div>
              </div>
            )}
            <div
              className="welcome-content"
              style={{...styles.content, display: (hasInlineImage && !inlineImagesLoaded) ? 'none' : 'block'}}
              dangerouslySetInnerHTML={{
                __html: processedContent,
              }}
            />

            <button
              ref={buttonRef}
              onClick={fetchData}
              style={styles.button}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#6B4FA0';
                if (isNoImageLayout) {
                  e.target.style.boxShadow = '0 6px 16px rgba(92, 42, 220, 0.4), 0 2px 6px rgba(0, 0, 0, 0.15)';
                }
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#886CC0';
                if (isNoImageLayout) {
                  e.target.style.boxShadow = '0 4px 12px rgba(92, 42, 220, 0.3), 0 1px 3px rgba(0, 0, 0, 0.1)';
                } else {
                  e.target.style.boxShadow = 'none';
                }
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Start Survey
            </button>
          </div>
        </div>
      </div>

      {/* Sticky scroll button with tooltip - both animate infinitely */}
      <div style={styles.stickyButtonContainer}>
        <div style={styles.stickyTooltip} onClick={scrollToButton}>
          Start Survey ✨
        </div>
        <button
          onClick={scrollToButton}
          style={styles.stickyButton}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#6B4FA0';
            e.target.style.boxShadow = '0 6px 16px rgba(92, 42, 220, 0.5), 0 3px 10px rgba(0, 0, 0, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#886CC0';
            e.target.style.boxShadow = '0 4px 12px rgba(92, 42, 220, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)';
          }}
          title="Scroll to Survey Button"
        >
          ↓
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const welcomeData = state.participant?.welcomeMessageData || {};  
  return {
    imageUrl: welcomeData.image_url|| '',
    content: welcomeData.welcomeMessage || '',
  }
}

export default connect(mapStateToProps)(WelcomeMessage);