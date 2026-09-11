export const getStyles = (isInlineImageLayout, imageUrl, isNoImageLayout, showStickyButton, isMobile) => ({
  wrapper: {
    position: 'relative',
    maxWidth: isMobile ? '100%' : '60%',
    margin: isMobile ? '0' : (isInlineImageLayout || imageUrl ? '30px auto' : '100px auto'),
  },
  container: {
    padding: '32px',
    backgroundColor: 'white',
    borderRadius: isInlineImageLayout || imageUrl ? '4px' : '12px',
    maxHeight: isInlineImageLayout || imageUrl ? '83vh' : '60vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.08)',
    paddingBottom: '30px',
    position: 'relative',
    overflow: 'hidden',
  },
  imageContainer: {
    marginBottom: '20px',
    flexShrink: 0,
    width: '100%',
    height: 'auto',
    maxHeight: '250px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    maxHeight: '250px',
    maxWidth: '100%',
    objectFit: 'cover',
    boxShadow: 'none',
  },
  scrollWrapper: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingRight: '10px',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(92, 42, 220, 0.2) transparent',
    position: 'relative',
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: isInlineImageLayout || imageUrl ? 'flex-start' : 'center',
    justifyContent: isInlineImageLayout || imageUrl ? 'flex-start' : 'center',
    minHeight: '100%',
  },
  content: {
    color: '#1f2937',
    textAlign: isInlineImageLayout || imageUrl ? 'left' : 'center',
    fontSize: '18px',
    maxWidth: '100%',
    marginBottom: '40px',
    width: '100%',
    paddingRight: '8px',
  },
  button: {
    padding: '15px 30px',
    backgroundColor: '#886CC0',
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: '600',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: isNoImageLayout ? '0 4px 12px rgba(92, 42, 220, 0.3), 0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
    fontFamily: 'inherit',
    alignSelf: 'center',
  },
  stickyButtonContainer: {
    position: 'fixed',
    top: isMobile ? '40%' : '50%',
    right: isMobile ? '0%' : '20%',
    transform: 'translateY(-50%)',
    display: showStickyButton ? 'flex' : 'none',
    alignItems: 'center',
    gap: '12px',
    zIndex: 10000,
  },
  stickyButton: {
    width: '50px',
    height: '50px',
    backgroundColor: '#886CC0',
    color: '#ffffff',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(92, 42, 220, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
    animation: 'bounceUpDown 1.5s ease-in-out infinite',
  },
  stickyTooltip: {
    backgroundColor: 'rgba(136, 108, 192, 0.95)',
    color: '#ffffff',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 12px rgba(92, 42, 220, 0.4)',
    animation: 'fadeSlideIn 1.5s ease-in-out infinite',
    cursor: 'pointer'
  },
  imageLoader: {
    width: '100%',
    height: '250px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
  },
  inlineImageLoader: {
    width: '100%',
    minHeight: '250px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '40px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(136, 108, 192, 0.2)',
    borderTop: '4px solid #886CC0',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
});

export const cssAnimations = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes bounceUpDown {
    0%, 100% { 
      transform: translateY(0px);
    }
    50% { 
      transform: translateY(-12px);
    }
  }
  
  @keyframes fadeSlideIn {
    0%, 100% { 
      opacity: 1;
      transform: translateX(0px);
    }
    50% { 
      opacity: 0.85;
      transform: translateX(-5px);
    }
  }
  
  .welcome-content h1, .welcome-content h2, .welcome-content h3 {
    color: #1f2937;
  }
  .welcome-content p {
    line-height: 1.6;
  }
  .welcome-content img {
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    .welcome-wrapper {
      max-width: 100% !important;
      margin: 0 !important;
    }
    .welcome-container-mobile {
      border-radius: 0 !important;
      box-shadow: none !important;
      max-height: 90vh !important;
    }
  }
`;